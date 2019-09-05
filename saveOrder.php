<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "estrasol";
$db = "bd_festiboda";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

if (!$conn) {
    die('Could not connect: ');
}

$sqlcont = 'Select LPAD( (count(*)+1), 7, 0) as cont From orden_compra';
$resultcont = mysqli_query($conn, $sqlcont);

$cont_folio = 0;
if (mysqli_num_rows($resultcont) > 0) {
    while($row = mysqli_fetch_assoc($resultcont)) {
       $cont_folio = $row['cont'];
    }
 }

$sql = " 
INSERT INTO orden_compra
    VALUES
    (
    UUID(),
    '". $cont_folio."',
    '".$_POST['client_name']."',
    '".$_POST['fecha_evento']."',
    '".$_POST['envio_selected']."',
    ".$_POST['price_envio_selected'].",
    ".$_POST['total'].",
    ".$_POST['num_pagos'].",
    '".$_POST['order_status']."',
    '".$_POST['envio_calle']."',
    '".$_POST['envio_numext']."',
    '".$_POST['envio_numint']."',
    '".$_POST['envio_cp']."',
    '".$_POST['envio_tel']."',
    '".$_POST['envio_cel']."',
    '".$_POST['envio_referencia']."',
    '".$_POST['envio_municipio']."',
    '".$_POST['envio_estado']."',
    '".$_POST['envio_pais']."',
    NOW()
    )
    ;
";
 
$sql_arr = array(
    "SQL" => $sql,
    "success" => "",
    "error" => ""
);

if ($conn->query($sql) === TRUE) {
    $sql_arr['success'] = "Record updated successfully";
} else {
    $sql_arr['error'] = $conn->error;
}
$conn->close();

echo json_encode($sql_arr);
