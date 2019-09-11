<?php
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

$sql_arr = array(
    "SQL" => $sql_order,
    "success" => "",
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
