<?php

echo "Checking debug codes endpoint...\n";

$url = 'http://localhost:8000/api/debug-codes';
$headers = [
    'Accept: application/json'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: " . $httpCode . "\n";
echo "Response: " . $response . "\n";

if ($httpCode === 200) {
    $data = json_decode($response, true);
    if ($data && isset($data['codes'])) {
        echo "\nRecent verification codes:\n";
        foreach ($data['codes'] as $code) {
            echo "Email: " . $code['email'] . " | Code: " . $code['code'] . " | Expires: " . $code['expires_at'] . "\n";
        }
    }
}
