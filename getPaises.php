<?php

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "estrasol";
$db = "bd_festiboda";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

if (!$conn) {
    die('Could not connect: ');
}

$sql = 'Select * From paises Order by id';
$result = mysqli_query($conn, $sql);

$paises = array();
if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
       $paises[] = $row;
    }
 }


 


$conn->close();

echo json_encode($paises);
