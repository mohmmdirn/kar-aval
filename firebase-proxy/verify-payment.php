<?php
// verify-payment.php
header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Enable error reporting for debugging (disable in production)
if (getenv('NODE_ENV') !== 'production') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Input validation
if (!isset($_GET['Authority']) || !isset($_GET['Status'])) {
    http_response_code(400);
    echo '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">';
    echo '<h2 style="color: #e74c3c;">خطا</h2>';
    echo '<p>اطلاعات پرداخت ناقص است.</p>';
    echo '<a href="javascript:history.back()" style="color: #3498db; text-decoration: none;">بازگشت</a>';
    echo '</div>';
    exit;
}

$Authority = trim($_GET['Authority']);
$Status = trim($_GET['Status']);

// Validate Authority format (should be alphanumeric)
if (!preg_match('/^[a-zA-Z0-9]+$/', $Authority)) {
    http_response_code(400);
    echo '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">';
    echo '<h2 style="color: #e74c3c;">خطا</h2>';
    echo '<p>کد تراکنش نامعتبر است.</p>';
    echo '<a href="javascript:history.back()" style="color: #3498db; text-decoration: none;">بازگشت</a>';
    echo '</div>';
    exit;
}

// Get configuration
$MerchantID = getenv('ZARINPAL_MERCHANT_ID') ?: 'YOUR_MERCHANT_ID_HERE';

// Validate merchant ID
if ($MerchantID === 'YOUR_MERCHANT_ID_HERE') {
    http_response_code(500);
    echo '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">';
    echo '<h2 style="color: #e74c3c;">خطا</h2>';
    echo '<p>خطا در پیکربندی درگاه پرداخت.</p>';
    echo '<a href="javascript:history.back()" style="color: #3498db; text-decoration: none;">بازگشت</a>';
    echo '</div>';
    exit;
}

// Get amount from session or database (you should implement this based on your needs)
$Amount = isset($_SESSION['payment_amount']) ? $_SESSION['payment_amount'] : 1000;

if ($Status == 'OK') {
    $data = array(
        'MerchantID' => $MerchantID,
        'Authority' => $Authority,
        'Amount' => $Amount
    );

    $jsonData = json_encode($data);

    if ($jsonData === false) {
        http_response_code(500);
        echo '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">';
        echo '<h2 style="color: #e74c3c;">خطا</h2>';
        echo '<p>خطا در پردازش داده.</p>';
        echo '<a href="javascript:history.back()" style="color: #3498db; text-decoration: none;">بازگشت</a>';
        echo '</div>';
        exit;
    }

    // Initialize cURL
    $ch = curl_init('https://api.zarinpal.com/pg/v4/payment/verify.json');
    if ($ch === false) {
        http_response_code(500);
        echo '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">';
        echo '<h2 style="color: #e74c3c;">خطا</h2>';
        echo '<p>خطا در اتصال به درگاه پرداخت.</p>';
        echo '<a href="javascript:history.back()" style="color: #3498db; text-decoration: none;">بازگشت</a>';
        echo '</div>';
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
        echo '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">';
        echo '<h2 style="color: #e74c3c;">خطا</h2>';
        echo '<p>خطا در ارتباط با درگاه پرداخت.</p>';
        echo '<a href="javascript:history.back()" style="color: #3498db; text-decoration: none;">بازگشت</a>';
        echo '</div>';
        exit;
    }

    $response = json_decode($result);

    if ($response === null) {
        http_response_code(500);
        echo '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">';
        echo '<h2 style="color: #e74c3c;">خطا</h2>';
        echo '<p>خطا در پردازش پاسخ درگاه پرداخت.</p>';
        echo '<a href="javascript:history.back()" style="color: #3498db; text-decoration: none;">بازگشت</a>';
        echo '</div>';
        exit;
    }

    if ($response && isset($response->data->Code) && $response->data->Code == 100) {
        $RefID = $response->data->RefID;
        echo '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">';
        echo '<h2 style="color: #27ae60;">پرداخت موفق</h2>';
        echo '<p>پرداخت شما با موفقیت انجام شد.</p>';
        echo '<p><strong>شماره پیگیری:</strong> ' . htmlspecialchars($RefID) . '</p>';
        echo '<p><strong>مبلغ:</strong> ' . number_format($Amount) . ' تومان</p>';
        echo '<a href="/" style="color: #3498db; text-decoration: none;">بازگشت به صفحه اصلی</a>';
        echo '</div>';
        
        // Here you should update your database/order status
        // Example: updateOrderStatus($Authority, 'completed', $RefID);
        
    } else {
        echo '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">';
        echo '<h2 style="color: #e74c3c;">خطا</h2>';
        echo '<p>پرداخت ناموفق بود یا قبلاً تایید شده است.</p>';
        echo '<a href="javascript:history.back()" style="color: #3498db; text-decoration: none;">بازگشت</a>';
        echo '</div>';
    }
} else {
    echo '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">';
    echo '<h2 style="color: #e74c3c;">پرداخت لغو شد</h2>';
    echo '<p>پرداخت لغو یا ناموفق بود.</p>';
    echo '<a href="javascript:history.back()" style="color: #3498db; text-decoration: none;">بازگشت</a>';
    echo '</div>';
}
?>
