<?php

echo "Complete fresh authentication flow test...\n\n";

// Step 1: Request a fresh verification code
echo "1. Requesting fresh verification code...\n";

$url = 'http://localhost:8000/api/auth/request-code';
$data = json_encode(['email' => 'fresh@example.com']);
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

echo "HTTP Status: " . $httpCode . "\n";
echo "Response: " . $response . "\n\n";

// Step 2: Get the verification code from debug endpoint
echo "2. Getting verification code from debug endpoint...\n";

$url = 'http://localhost:8000/api/debug-codes';
$headers = ['Accept: application/json'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$debugData = json_decode($response, true);
$verificationCode = null;

if ($debugData && isset($debugData['codes'])) {
    foreach ($debugData['codes'] as $code) {
        if ($code['email'] === 'fresh@example.com') {
            $verificationCode = $code['code'];
            echo "Found verification code: " . $verificationCode . "\n\n";
            break;
        }
    }
}

if (!$verificationCode) {
    echo "✗ Could not find verification code\n";
    exit(1);
}

// Step 3: Test verification (simulating frontend)
echo "3. Testing verification with fresh code: " . $verificationCode . "\n";

$url = 'http://localhost:8000/api/auth/verify-code';
$data = json_encode([
    'email' => 'fresh@example.com',
    'code' => $verificationCode,
    'keepSignedIn' => false
]);

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

echo "HTTP Status: " . $httpCode . "\n";
echo "Response: " . $response . "\n\n";

$verifyData = json_decode($response, true);

echo "Response analysis:\n";
echo "- success: " . ($verifyData['success'] ? 'true' : 'false') . "\n";
echo "- message: " . ($verifyData['message'] ?? 'none') . "\n";
echo "- has data: " . (isset($verifyData['data']) ? 'true' : 'false') . "\n";
echo "- has token: " . (isset($verifyData['data']['token']) ? 'true' : 'false') . "\n";

if ($verifyData && $verifyData['success'] && isset($verifyData['data'])) {
    echo "\n✓ Verification successful!\n";
    
    if (isset($verifyData['data']['notifications'])) {
        $notifications = $verifyData['data']['notifications'];
        echo "✓ Notifications status:\n";
        echo "  - Welcome sent: " . ($notifications['welcome_sent'] ? 'yes' : 'no') . "\n";
        echo "  - Login alert sent: " . ($notifications['login_alert_sent'] ? 'yes' : 'no') . "\n";
    }
    
    echo "\n✓ Backend flow is working correctly!\n";
    echo "  The issue must be in the frontend redirect/error handling.\n";
} else {
    echo "\n✗ Verification failed: " . ($verifyData['message'] ?? 'Unknown error') . "\n";
}
