<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "estrasol";
$db = "bd_festiboda";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

if (!$conn) {
    die('Could not connect: ');
}

$data_id =  $_POST['data_id'];
$data_type =  $_POST['data_type'];
$module_name = "";

if ($data_type == 'product') {
    $module_name = 'products';
} else if ($data_type == 'tipoenvio') {
    $module_name = 'tipos_envio';
}

$sql = "
    DELETE FROM " . $module_name . "
    WHERE id = '" . $data_id . "';
    ";

$sql_arr = array(
    "SQL" => $sql,
    "success" => "",
    "error" => ""
);


if ($conn->query($sql) === TRUE) {
    $sql_arr['success'] = true;
} else {
    $sql_arr['error'] = $conn->error;
}
$conn->close();

echo json_encode($sql_arr);
