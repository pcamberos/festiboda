<?php
require_once("lib/Conekta.php");
\Conekta\Conekta::setApiKey("key_Tq9owscXwXiRS1z7xPDPwg");
\Conekta\Conekta::setApiVersion("2.0.0");


$myObj = json_decode($_POST["full_cotizador"]);
$line_items = array();
foreach ($myObj as $key => $value) {
  if ($value->quantity > 0) {
    $line_items[] = array(
      "name" => $value->productname,
      "unit_price" => ($value->unitprice*100),
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
          )//first line_item
        ), //line_items*/
      "shipping_lines" => array(
        array(
          "amount" => ($costo_envio*100),
          "carrier" => "ESTAFETA"
        )
      ), //shipping_lines - physical goods only
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
        ) //address
      ), //shipping_contact - required only for physical goods
      "metadata" => array("reference" => "12987324097", "more_info" => "lalalalala"),
      "charges" => array(
        array(
          "payment_method" => array(
            //"monthly_installments" => 3,
            "type" => "card",
            "token_id" => "tok_test_visa_4242"
          ) //payment_method - use customer's default - a card
          //to charge a card, different from the default,
          //you can indicate the card's source_id as shown in the Retry Card Section
        ) //first charge
      ) //charges
    ) //order
  );
} catch (\Conekta\ProcessingError $error) {
  echo $error->getMessage();
} catch (\Conekta\ParameterValidationError $error) {
  echo $error->getMessage();
} catch (\Conekta\Handler $error) {
  echo $error->getMessage();
}


var_dump($order);
