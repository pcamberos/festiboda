<?php
$dbhost = "localhost";
$dbuser = "root";
$dbpass = "estrasol";
$db = "bd_festiboda";
$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

if (!$conn) {
    die('Could not connect: ');
}

$product_id = $_POST['data_id'];
$product_name = $_POST['data_name'];
$product_price = $_POST['data_price'];
$product_minimo= $_POST['data_minimo'];
$is_new = $_POST['data_new'];


if ($is_new == 'false') {
    $sql = " 
        UPDATE products
        SET name = '" . $product_name . "',
        minimo = '" . $product_minimo . "',
        unit_price = " . $product_price . "
        WHERE id = '" . $product_id . "';
        ";
} else {
    $sqlId = 'Select UUID() as new_id ';
    $resultId = mysqli_query($conn, $sqlId);

    while ($row = mysqli_fetch_assoc($resultId)) {
        $product_id = $row['new_id'];
    }


    $sql = "
        INSERT INTO products
        VALUES
        (
        '" . $product_id . "',
        '" . $product_name . "',
        " . $product_price . ",
        NOW(),
        '" . $product_minimo . "',
        );    
    ";
}

$sql_arr = array(
    "SQL" => $sql,
    "success" => "",
    "newId" => $product_id,
    "error" => ""
);


if ($conn->query($sql) === TRUE) {
    $sql_arr['success'] = true;
} else {
    $sql_arr['error'] = $conn->error;
}
$conn->close();

echo json_encode($sql_arr);
