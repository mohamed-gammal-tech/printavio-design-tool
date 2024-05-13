<?php

$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    ini_set('memory_limit', '256M');

    $servername = "sxb1plzcpnl504560";
    $username = "admin";
    $password = "123456";
    $dbname = "printavio";


    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $user_id = isset($_POST['user_id']) ? $_POST['user_id'] : null;
    $productImage = isset($_POST['product-image']) ? $_POST['product-image'] : null;
    $mockupImage = isset($_POST['mockup-image']) ? $_POST['mockup-image'] : null;
    $designId = isset($_POST['design-id']) ? $_POST['design-id'] : null;
    $designName = isset($_POST['designName']) ? $_POST['designName'] : null;
    $productPrice = isset($_POST['productPrice']) ? $_POST['productPrice'] : null;
    $artistProfit = isset($_POST['artistProfit']) ? $_POST['artistProfit'] : null;
    $productName = isset($_POST['productName']) ? $_POST['productName'] : null;
    $productType = isset($_POST['productType']) ? $_POST['productType'] : null;

    $productImageBase64 = explode('base64,', $productImage)[1];

    $uploadDirectory = "../uploadmockups/uploads/";
    $productImageName = uniqid() . ".jpg"; // Generate unique image name
    $productImagePath = $uploadDirectory . $productImageName;
    $databasePath = "uploads/". $productImageName;
    file_put_contents($productImagePath, base64_decode($productImageBase64));

    $stmt = $conn->prepare("INSERT INTO waitingproducts (design_id, canvas_src) VALUES (?, ?)");
    $stmt->bind_param("is", $designId, $mockupImage);
    $stmt->execute();
    $waitingProductId = $stmt->insert_id;

    $stmt = $conn->prepare("INSERT INTO products (product_id, design_id, product_name, product_type, price, artist_profit, canvas_src) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iisssss", $waitingProductId, $designId, $productName,  $productType, $productPrice, $artistProfit, $databasePath);


    $stmt->execute();

    $stmt->close();
    $conn->close();

    $response['success'] = true;
    $response['message'] = "Product details saved successfully.";
    echo json_encode($response);
    exit;
} else {
    header('HTTP/1.1 405 Method Not Allowed');
    exit;
}
?>
