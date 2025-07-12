<?php
// create-payment.php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Enable error reporting for debugging (disable in production)
if (getenv('NODE_ENV') !== 'production') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Input validation
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'متد غیرمجاز']);
    exit;
}

if (!isset($_POST['amount']) || !is_numeric($_POST['amount'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'مبلغ نامعتبر است']);
    exit;
}

$amount = intval($_POST['amount']);

// Validate amount range
if ($amount < 1000 || $amount > 50000000) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'مبلغ باید بین ۱,۰۰۰ تا ۵۰,۰۰۰,۰۰۰ تومان باشد']);
    exit;
}

// Get configuration
$MerchantID = getenv('ZARINPAL_MERCHANT_ID') ?: 'YOUR_MERCHANT_ID_HERE';
$Description = 'خرید از فروشگاه کار اول';
$CallbackURL = getenv('CALLBACK_URL') ?: 'https://yourdomain.com/verify-payment.php';

// Validate merchant ID
if ($MerchantID === 'YOUR_MERCHANT_ID_HERE') {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطا در پیکربندی درگاه پرداخت']);
    exit;
}

$data = array(
    'MerchantID' => $MerchantID,
    'Amount' => $amount,
    'Description' => $Description,
    'CallbackURL' => $CallbackURL
);

$jsonData = json_encode($data);

if ($jsonData === false) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطا در پردازش داده']);
    exit;
}

// Initialize cURL
$ch = curl_init('https://api.zarinpal.com/pg/v4/payment/request.json');
if ($ch === false) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطا در اتصال به درگاه پرداخت']);
    exit;
}

// Set cURL options
curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => $jsonData,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_USERAGENT => 'Kar-Aval-Payment/1.0'
]);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($result === false || $curlError) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطا در ارتباط با درگاه پرداخت: ' . $curlError]);
    exit;
}

if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطا در پاسخ درگاه پرداخت']);
    exit;
}

$response = json_decode($result);

if ($response === null) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطا در پردازش پاسخ درگاه پرداخت']);
    exit;
}

if ($response && isset($response->data->Authority)) {
    $Authority = $response->data->Authority;
    echo json_encode([
        'status' => 'success', 
        'url' => "https://www.zarinpal.com/pg/StartPay/$Authority",
        'authority' => $Authority
    ]);
} else {
    $errorMessage = isset($response->errors) ? implode(', ', $response->errors) : 'خطا در ایجاد تراکنش';
    echo json_encode(['status' => 'error', 'message' => $errorMessage]);
}
?>
