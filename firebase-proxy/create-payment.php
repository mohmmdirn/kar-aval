<?php
// create-payment.php

header('Content-Type: application/json');

$MerchantID = 'کد-merchant-شما-اینجا'; // اینجا جایگزین کن
$Amount = $_POST['amount'];  // مبلغ به تومان
$Description = 'خرید از فروشگاه من';
$CallbackURL = 'https://yourdomain.com/verify-payment.php'; // آدرس صفحه تایید پرداخت شما

$data = array(
    'MerchantID' => $MerchantID,
    'Amount' => intval($Amount),
    'Description' => $Description,
    'CallbackURL' => $CallbackURL
);

$jsonData = json_encode($data);

$ch = curl_init('https://api.zarinpal.com/pg/v4/payment/request.json');
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);

$result = curl_exec($ch);
curl_close($ch);

$response = json_decode($result);

if($response && $response->data->Authority) {
    $Authority = $response->data->Authority;
    echo json_encode(['status' => 'success', 'url' => "https://www.zarinpal.com/pg/StartPay/$Authority"]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'خطا در ایجاد تراکنش']);
}
?>
