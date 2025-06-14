<?php
// verify-payment.php

$MerchantID = 'کد-merchant-شما-اینجا'; // جایگزین کن

if (!isset($_GET['Authority']) || !isset($_GET['Status'])) {
    die('اطلاعات پرداخت ناقص است.');
}

$Authority = $_GET['Authority'];
$Status = $_GET['Status'];

if ($Status == 'OK') {
    $data = array(
        'MerchantID' => $MerchantID,
        'Authority' => $Authority,
        'Amount' => 1000  // باید مبلغ اصلی سفارش رو اینجا قرار بدی
    );

    $jsonData = json_encode($data);

    $ch = curl_init('https://api.zarinpal.com/pg/v4/payment/verify.json');
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);

    $result = curl_exec($ch);
    curl_close($ch);

    $response = json_decode($result);

    if ($response && $response->data->Code == 100) {
        echo "پرداخت موفق بود. شماره پیگیری: " . $response->data->RefID;
        // اینجا می‌تونی سفارش رو تایید و ثبت کنی
    } else {
        echo "پرداخت ناموفق بود یا قبلاً تایید شده است.";
    }
} else {
    echo "پرداخت لغو یا ناموفق بود.";
}
?>
