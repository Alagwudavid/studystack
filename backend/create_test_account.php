<?php

echo "Creating test account for frontend testing...\n";

// Request verification code for a unique email
$testEmail = 'frontend-test-' . time() . '@example.com';

echo "Using email: " . $testEmail . "\n\n";

$url = 'http://localhost:8000/api/auth/request-code';
$data = json_encode(['email' => $testEmail]);
$headers = [
    'Content-Type: application/json',
    'Accept: application/json',
    'X-Requested-With: XMLHttpRequest',
    'X-CSRF-Protection: 1'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Request code response: " . $response . "\n\n";

// Get the verification code
$url = 'http://localhost:8000/api/debug-codes';
$headers = ['Accept: application/json'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
curl_close($ch);

$debugData = json_decode($response, true);
$verificationCode = null;

if ($debugData && isset($debugData['codes'])) {
    foreach ($debugData['codes'] as $code) {
        if ($code['email'] === $testEmail) {
            $verificationCode = $code['code'];
            break;
        }
    }
}

if ($verificationCode) {
    echo "✓ Test account ready!\n";
    echo "Email: " . $testEmail . "\n";
    echo "Code: " . $verificationCode . "\n\n";
    echo "Now you can test in the browser:\n";
    echo "1. Go to http://localhost:3001/auth\n";
    echo "2. Enter email: " . $testEmail . "\n";
    echo "3. Enter code: " . $verificationCode . "\n";
    echo "4. Check if it redirects to /home without showing error\n";
} else {
    echo "✗ Could not get verification code\n";
}
