<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "estrasol";
$db = "bd_festiboda";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

if (!$conn) {
    die('Could not connect: ');
}

$sql = " 
INSERT INTO products
    VALUES
    (
    UUID(),
    '".$_POST['product_name']."',
    '".$_POST['unit_price']."',
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
