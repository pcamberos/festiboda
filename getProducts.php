<?php

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "estrasol";
$db = "bd_festiboda";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

if (!$conn) {
    die('Could not connect: ');
}

$sql = 'Select * From products';
$result = mysqli_query($conn, $sql);

$products = array();
if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
       $products[] = $row;
    }
 }


 


$conn->close();

echo json_encode($products);
