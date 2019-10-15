<?php
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
$sql_arr = array(
    "SQL" => "",
    "success" => "",
    "folio" => "",
    "error" => ""
);
$folio = $_POST['folio'];
$return_array = array();

/**
 * 1. Obteniendo datos de la venta a traves del folio
 */

$sql = "Select lit.*, prod.referencia_web as prod_name from orden_compra ord
        Inner join line_items lit ON ord.folio = lit.order_folio
        Inner Join products prod ON prod.id = lit.product_id 
        Where folio = '". $folio."';";
$result = mysqli_query($conn, $sql);
$line_products = '{';
$index = 1;
$num_rows = mysqli_num_rows($result);
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $line_products .= '"' . $index . '":["' . $row['prod_name'] . '",' . $row['product_quantity'] . ',' . $row['product_unitprice'] . ',"Sometext"]';
        if($index < $num_rows){
            $line_products .= ',';
        }
        $index++;
    }
}
$line_products .= '}';
$conn->close();

/**
 * CHAT2DESK
 */




$return_array['line_products'] = $line_products;
echo json_encode($return_array);
