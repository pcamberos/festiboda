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

/*******************************************************************
 * Variables principales del servicio
 */
$myObj = json_decode($_POST["full_cotizador"]);
$data = array(
    'client_id' => $_POST['client_id'],
    'transport' => $_POST['transport'],
    'channel_id' => $_POST['channel_id'],
    'text' => '',
    'type' => 'autoreply'
);

/**
 * Obteniendo Precio de tipo de envio
 */

$precio_envio = 0;
$tipo_envio = "";
$result_envio = $conn->query("Select name, price from tipos_envio where keyword = '" . $_POST["envio_selected"] . "';");
while ($row_envio = mysqli_fetch_assoc($result_envio)) {
    $precio_envio  = $row_envio['price'];
    $tipo_envio  = $row_envio['name'];
}


/*******************************************************************
 * 1. Obteniendo lista de productos con Precios-Reales
 */
$sql = 'Select * From products Order by date_created';
$result = mysqli_query($conn, $sql);
$products = array();
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $products[$row['id']] = $row;
    }
}
$line_items = array();
$total_venta = $precio_envio;
foreach ($myObj as $key => $value) {
    if ($value->quantity > 0) {
        $total_prod = $value->quantity * $value->unitprice;
        $total_venta = $total_venta + $total_prod;
        $line_items[] = array(
            "name" => $value->productname,
            "unit_price" => ($value->unitprice),
            "quantity" => $value->quantity,
            "total_prod" => $total_prod
        );
    }
}

$msg_body = "COTIZACIÓN SOLICITADA:

";
foreach ($line_items as $item) {
    $msg_body .= $item['quantity'] . " " . $item['name'] . " : " . " $" . number_format($item['total_prod'], 2, ".", ",") . "
";
}

$msg_body .= "
" . $tipo_envio .": $" . $precio_envio . "
";
$msg_body .= "
Total: $" . number_format($total_venta, 2, ".", ",");


/*******************************************************************
 * CHAT2DESK Methods
 */
$data['text'] =
    $msg_body;
//'Estos son los precios que manejamos .  
//
//AA$$';// $msg_body;
$payload = json_encode($data);
$ch = curl_init("https://api.chat2desk.com.mx/v1/messages");
$authorization = "Authorization: 21f98ba7e707576f8dcc5aadd2db6c";
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLINFO_HEADER_OUT, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt(
    $ch,
    CURLOPT_HTTPHEADER,
    array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($payload),
        $authorization
    )
);
$result = curl_exec($ch);

curl_close($ch);
/**************************************************************** */

echo json_encode($result);
