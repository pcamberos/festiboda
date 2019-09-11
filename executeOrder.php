<?php
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
require 'vendor/autoload.php';

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "estrasol";
$db = "bd_festiboda";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

if (!$conn) {
    die('Could not connect: ');
}
$conn->autocommit(false);

$cont = '00000000';
$sqlcont = "
SELECT LPAD( (count(*)+1), 7, 0) as cont From orden_compra; 
";
$contresult = $conn->query($sqlcont);
if ($contresult->num_rows > 0) {
    while ($row = $contresult->fetch_assoc()) {
        $cont = $row['cont'];
    }
}

//SELECT @cont := LPAD( (count(*)+1), 7, 0) as cont From orden_compra; 

$sql_order = " 
INSERT INTO orden_compra
    VALUES
    (
    UUID(),
    'V" . $cont . "',
    '" . $_POST['client_name'] . "',
    '" . $_POST['fecha_evento'] . "',
    '" . $_POST['envio_selected'] . "',
    " . $_POST['price_envio_selected'] . ",
    " . $_POST['total'] . ",
    " . $_POST['num_pagos'] . ",
    '" . $_POST['order_status'] . "',
    '" . $_POST['envio_calle'] . "',
    '" . $_POST['envio_numext'] . "',
    '" . $_POST['envio_numint'] . "',
    '" . $_POST['envio_cp'] . "',
    '" . $_POST['envio_tel'] . "',
    '" . $_POST['envio_cel'] . "',
    '" . $_POST['envio_referencia'] . "',
    '" . $_POST['envio_municipio'] . "',
    '" . $_POST['envio_estado'] . "',
    '" . $_POST['envio_pais'] . "',
    date(NOW())
    )
    ;
";

$folio = "V" . $cont;
$sql_arr = array(
    "SQL" => $sql_order,
    "success" => "",
    "folio" => $folio,
    "error" => ""
);

if ($conn->query($sql_order) === TRUE) {
    require_once("lib/Conekta.php");
    \Conekta\Conekta::setApiKey("key_Tq9owscXwXiRS1z7xPDPwg");
    \Conekta\Conekta::setApiVersion("2.0.0");

    $myObj = json_decode($_POST["full_cotizador"]);
    $line_items = array();
    foreach ($myObj as $key => $value) {
        if ($value->quantity > 0) {
            $line_items[] = array(
                "name" => $value->productname,
                "unit_price" => ($value->unitprice * 100),
                "quantity" => $value->quantity
            );
        }
    }

    $costo_envio = $_POST["costoenvio"];
    $client_name = $_POST["client_name"];
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
                        "amount" => ($costo_envio * 100),
                        "carrier" => "ESTAFETA"
                    )
                ),
                "currency" => "MXN",
                "customer_info" => array(
                    "name" => $client_name,
                    "email" => "usuario@gmail.com",
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
                            "token_id" => "tok_test_visa_4242"
                        )
                    )
                )
            )
        );
        $conn->commit();
        $sql_arr['success'] = "Record updated successfully";

        
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

            //Recipients
            $mail->setFrom('pruebas@democrm7.estrasol.com.mx', 'FESTIBODA');
            $mail->addAddress('juan.camberos@estrasol.com.mx',  $_POST['client_name']);     // Add a recipient
            //$mail->addAddress('ajuarez@estrasol.com.mx');               // Name is optional
            //$mail->addReplyTo('info@example.com', 'Information');
            //$mail->addCC('cc@example.com');
            //$mail->addBCC('bcc@example.com');

            // Attachments
            //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
            //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

            // Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = 'GRACIAS POR TU COMPRA!';
            $msg_body = 'Tu pago se ha realizado con éxito! ';
            $msg_body .= '<br>Con el siguiente folio: <b>V' . $cont . "</b>";
            $msg_body .= "<br><br>Productos en la compra:";
            foreach($line_items as $item){
                $msg_body .= "<br>". $item['name'] . " $" . $item['unit_price'];
            }
            $msg_body .= "Por un total de: $" . $_POST['total'];


            $mail->Body  = $msg_body;
            //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

            $mail->send();
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    } catch (\Conekta\ProcessingError $error) {
        $conn->rollback();
        echo $error->getMessage();
    } catch (\Conekta\ParameterValidationError $error) {
        $conn->rollback();
        echo $error->getMessage();
    } catch (\Conekta\Handler $error) {
        $conn->rollback();
        echo $error->getMessage();
    }
} else {
    $sql_arr['error'] = $conn->error;
}
$conn->close();

echo json_encode($sql_arr);
