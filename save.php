<?php
$host = 'sxb1plzcpnl504560';
$dbname = 'printavio';
$username = 'admin';
$password = '123456';

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$response = [];

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!empty($_FILES['designFile']['name']) && !empty($_POST['designTitle']) && !empty($_POST['designDescription'])) {
            $sql = "INSERT INTO designs (title, description) VALUES (?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$_POST['designTitle'], $_POST['designDescription']]);
            $designId = $pdo->lastInsertId();
            $designTitle = $_POST['designTitle'];
            $imageData = file_get_contents($_FILES['designFile']['tmp_name']);
            $base64 = base64_encode($imageData);
            $fullImageData = 'data:image/jpeg;base64,' . $base64; 

            $sql = "INSERT INTO images (design_id, image_placeholder_src) VALUES (?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$designId, $fullImageData]);

            $response['base64Image'] = $fullImageData;
            $response['success'] = 'Design and image have been successfully saved.';
            $response['designId'] = $designId;
            $response['designTitle'] = $designTitle;
        } else {
            $response['error'] = 'All fields are required.';
        }
    }
} catch (PDOException $e) {
    $response['error'] = 'Database error: ' . $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);

?>