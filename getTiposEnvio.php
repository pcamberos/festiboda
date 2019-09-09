<?php

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "estrasol";
$db = "bd_festiboda";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

if (!$conn) {
    die('Could not connect: ');
}

$sql = 'Select * From tipos_envio  Order by date_created';
$result = mysqli_query($conn, $sql);

$tipos_envio = array();
if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
       $tipos_envio[] = $row;
    }
 }

$conn->close();

echo json_encode($tipos_envio);
