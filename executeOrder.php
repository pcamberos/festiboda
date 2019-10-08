<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

/**
 * Información de la Base de datos
 */
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "estrasol";
$db = "bd_festiboda";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);
if (!$conn) {
    die('Could not connect: ');
}
$conn->autocommit(false);

/**
 * Variables principales del servicio
 */
$client_name = $_POST["client_name"];
$myObj = json_decode($_POST["full_cotizador"]);
$sql_arr = array(
    "SQL" => "",
    "success" => "",
    "folio" => "",
    "error" => ""
);

/**
 * Obteniendo Precio de tipo de envio
 */
$precio_envio=0;
$result_envio = $conn->query("Select price from tipos_envio where keyword = '".$_POST["envio_selected"]."';");
while ($row_envio = mysqli_fetch_assoc($result_envio)) {
    $precio_envio  = $row_envio['price'];
}

/**
 * 1. Obteniendo lista de productos con Precios-Reales
 * 2. Asignando Precio Final de la venta
 */
$sql = 'Select * From products Order by date_created';
$result = mysqli_query($conn, $sql);
$products = array();
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $products[$row['id']] = $row;
    }
}

$total_order = $precio_envio;
foreach ($myObj as $key => $value) {
    if ($value->quantity > 0) {
        $prod_unitprice = $products[$value->id]['unit_price'];
        $prod_totalprice = $prod_unitprice * $value->quantity;
        $total_order += $prod_totalprice;
    }
}

/**
 * Obteniendo Folio
 */
$result_folio = $conn->query(" SELECT CONCAT('V' ,LPAD( (count(*)+1), 7, 0))  as folio from orden_compra;");
while ($row_folio = mysqli_fetch_assoc($result_folio)) {
    $sql_arr['folio']  = $row_folio['folio'];
}

/**
 * Creando la orden de venta!! 
 */

$sql_arr['SQL'] = " CALL create_order (
    '" . $sql_arr['folio'] . "',
    '" . $_POST['client_name'] . "', 
    '" . $_POST['fecha_evento'] . "',
    '" . $_POST['envio_selected'] . "',
    " . $precio_envio . ",
    " . $total_order . ",
    " . $_POST['num_pagos'] . ",
    '" . $_POST['order_status'] . "');
";
$result = $conn->query($sql_arr['SQL']);
$sql_arr['success'] = $result;


if ($sql_arr['success']) {
    /**
     * Se guarda el de talle de la venta
     * - Lineas cada uno de los productos vendidos.
     */
    $bool_line_items = true;
    $line_items = array();
    foreach ($myObj as $key => $value) {
        if ($value->quantity > 0) {
            $prod_unitprice = $products[$value->id]['unit_price'];
            $prod_totalprice = $prod_unitprice * $value->quantity;

            $line_items[] = array(
                "name" => $value->productname,
                "unit_price" => ($value->unitprice * 100),
                "quantity" => $value->quantity
            );

            $query_li = "
            INSERT INTO line_items VALUES (
                UUID(),
                '" . $sql_arr['folio'] . "',
                '" . $value->id . "',
                " . $prod_unitprice . ",
                " . $value->quantity . ",
                " . $prod_totalprice . ",
                 NOW()
                );
            ";
            if ($conn->query($query_li) === FALSE) {
                $sql_arr['error'] = $conn->error;
                $bool_line_items = false;
            }
        }
    }

    if ($bool_line_items) {
        /**
         * Si el insertado en base de datos es correcto se procede a realizar la venta
         * Desde Conekta
         */
        require_once("lib/Conekta.php"); 
//        \Conekta\Conekta::setApiKey("key_Tq9owscXwXiRS1z7xPDPwg");    // Testing Estrasol 
        \Conekta\Conekta::setApiKey("key_d6WBcnrimsydrEFSfJLa3Q");    // Testing Festiboda
//        \Conekta\Conekta::setApiKey("key_cvmf4VJ9hVak3j1wbzy5rQ");    // Producción Festiboda
        \Conekta\Conekta::setApiVersion("2.0.0");
        try { 
            $order = \Conekta\Order::create(
                array(
                    "line_items" => $line_items,
                    /* array(
                        array(
                            "name" => "Tacos",
                            "unit_price" => 1000,
                            "quantity" => 120
                        )
                ), */
                    "shipping_lines" => array(
                        array(
                            "amount" => ($precio_envio * 100),
                            "carrier" => "ESTAFETA"
                        )
                    ),
                    "currency" => "MXN",
                    "customer_info" => array(
                        "name" => $client_name,
                        "email" => $_POST['client_mail'],
                        "phone" => "5512345678"
                    ), //customer_info
                    "shipping_contact" => array(
                        "address" => array(
                            "street1" => "Calle 123, int 2",
                            "postal_code" => "06100",
                            "country" => "MX"
                        )
                    ),
                    "metadata" => array("reference" => "12987324097", "more_info" => "lalalalala"),
                    "charges" => array(
                        array(
                            "payment_method" => array(
                                //"monthly_installments" => 3,
                                "type" => "card",
                                "token_id" => $_POST['token_venta'],
                            )
                        )
                    )
                )
            );
            
            $conn->commit();
            $sql_arr['success'] = "Record updated successfully";


            /**
             * Una vez realizado el guardado en base de datos y la venta en coneckta
             * Se procede a enviar correo de confirmación con el Cliente!
             */
            $mail = new PHPMailer(true);
            try {
                //Server settings
                $mail->SMTPDebug = 2;                                       // Enable verbose debug output
                $mail->isSMTP();                                            // Set mailer to use SMTP
                $mail->Host       = 'democrm7.estrasol.com.mx';  // Specify main and backup SMTP servers
                $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
                $mail->Username   = 'pruebas@democrm7.estrasol.com.mx';                     // SMTP username
                $mail->Password   = '%.zyzf5jW(X8';                               // SMTP password
                $mail->SMTPSecure = 'tls';                                  // Enable TLS encryption, `ssl` also accepted
                $mail->Port       = 587;                                    // TCP port to connect to
                $mail->CharSet = 'UTF-8';
                //Recipients
                $mail->setFrom('pruebas@democrm7.estrasol.com.mx', 'FESTIBODA');
                $mail->addAddress('juan.camberos@estrasol.com.mx',  $_POST['client_name']);     // Add a recipient
                // Content
                $mail->isHTML(true);                                  // Set email format to HTML
                $mail->Subject = '!GRACIAS POR TU COMPRA EN FESTIBODA!';
                $msg_body = 'Tu pago se ha realizado con éxito. ';
                $msg_body .= '<br>Folio de compra: <b>' . $sql_arr['folio'] . "</b>";
                $msg_body .= "<br><br>Productos en la compra: <br><br>";

                $msg_body .= '<table>';
                foreach ($line_items as $item) {
                    $msg_body .= "<tr>"; 
                        $msg_body .= '<td style="border: 1px solid black; width: 250px;">';
                            $msg_body .= $item['name'];
                        $msg_body .= '</td>';
                        $msg_body .= '<td style="border: 1px solid black; width: 80px;">';
                            $msg_body .= " $" . number_format($item['unit_price'],2,".",",");
                        $msg_body .= '</td>';
                    $msg_body .= "</tr>";
                }
                $msg_body .= "</table>";

                $msg_body .= "<br>";
                $msg_body .= "Precio total de la compra: $" . number_format($total_order,2,".",",");
                $mail->Body  = $msg_body;
                $mail->send();
            } catch (Exception $e) {
                echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            }
        } catch (\Conekta\ProcessingError $error) {
            $conn->rollback();
            echo json_encode($error->getMessage() . " 1");
            exit();
        } catch (\Conekta\ParameterValidationError $error) {
            $conn->rollback();
            echo json_encode($error->getMessage() . " 2");
            exit();
        } catch (\Conekta\Handler $error) {
            $conn->rollback();
            echo json_encode($error->getMessage()  . " 3");
            exit();
        }
    }
} else {
    $sql_arr['error'] = $conn->error;
}
$conn->close();

echo json_encode($sql_arr);
