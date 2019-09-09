<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "estrasol";
$db = "bd_festiboda";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

if (!$conn) {
    die('Could not connect: ');
}

$tipoenvio_id = $_POST['data_id'];
$tipoenvio_name = $_POST['data_name'];
$tipoenvio_dias = $_POST['data_dias'];
$tipoenvio_price = $_POST['data_price'];

$is_new = $_POST['data_new'];
$tipoenvio_keyword = $_POST['data_keyword'];

if ($is_new == 'false') {
    $sql = "
        UPDATE tipos_envio
        SET
        name = '" . $tipoenvio_name . "',
        dias_habiles = " . $tipoenvio_dias . ",
        price = " . $tipoenvio_price . "
        WHERE id = '" . $tipoenvio_id . "';
    ";
} else {
    $sqlId = 'Select UUID() as new_id ';
    $resultId = mysqli_query($conn, $sqlId);

    while ($row = mysqli_fetch_assoc($resultId)) {
        $tipoenvio_id = $row['new_id'];
    }

    $sql = "
        INSERT INTO tipos_envio
        VALUES
        (
        '" . $tipoenvio_id . "',
        '" . $tipoenvio_keyword . "',
        '" . $tipoenvio_name . "',
        " . $tipoenvio_dias . ",
        " . $tipoenvio_price . ",
        NOW()
        );    
    ";
 }

 $sql_arr = array(
    "SQL" => $sql,
    "success" => "",
    "newId" => $tipoenvio_id,
    "error" => ""
);
if ($conn->query($sql) === TRUE) {
    $sql_arr['success'] = true;
} else {
    $sql_arr['error'] = $conn->error;
}
$conn->close();

echo json_encode($sql_arr);
