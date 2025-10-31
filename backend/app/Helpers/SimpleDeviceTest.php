<?php

/**
 * Simple test for enhanced device detection functionality
 * Tests the core device detection without database operations
 */

require_once __DIR__ . '/EnhancedDeviceDetection.php';

// Test the core enhanced device detection
echo "Testing Enhanced Device Detection Functions\n";
echo str_repeat("=", 50) . "\n\n";

// Mock user agent and headers
$userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
$ip = '8.8.8.8';

$headers = [
    'User-Agent' => $userAgent,
    'X-Device-Fingerprint' => 'canvas:abcd1234,audio:efgh5678',
    'X-Graphics-Info' => 'vendor:NVIDIA Corporation,renderer:NVIDIA GeForce RTX 3080,version:OpenGL 4.6',
    'X-Hardware-Info' => 'cores:8,memory:16,gpu-memory:10240',
    'X-Screen-Info' => 'resolution:2560x1440,depth:24,ratio:1.5',
    'Accept-Language' => 'en-US,en;q=0.9',
    'Accept-Timezone' => 'America/New_York',
];

echo "1. Testing enhancedDeviceDetection():\n";
$deviceInfo = enhancedDeviceDetection($userAgent, $ip);
foreach ($deviceInfo as $key => $value) {
    echo "   {$key}: {$value}\n";
}

echo "\n2. Testing detectGraphicsCapabilities():\n";
$graphics = detectGraphicsCapabilities($headers, $userAgent);
foreach ($graphics as $key => $value) {
    echo "   {$key}: " . (is_bool($value) ? ($value ? 'true' : 'false') : $value) . "\n";
}

echo "\n3. Testing generateDeviceFingerprint():\n";
$fingerprint = generateDeviceFingerprint($deviceInfo, $headers);
foreach ($fingerprint as $key => $value) {
    echo "   {$key}: " . (is_bool($value) ? ($value ? 'true' : 'false') : $value) . "\n";
}

echo "\n4. Testing generateUniqueDeviceId():\n";
$deviceId = generateUniqueDeviceId($deviceInfo, $graphics, $fingerprint);
echo "   Device ID: {$deviceId}\n";

echo "\n5. Testing detectUserPreferences():\n";
$preferences = detectUserPreferences($headers);
foreach ($preferences as $key => $value) {
    echo "   {$key}: {$value}\n";
}

echo "\n6. Testing compareDeviceCharacteristics():\n";
$characteristics1 = array_merge($deviceInfo, $graphics, $fingerprint);
$characteristics2 = $characteristics1;
$characteristics2['browser'] = 'Firefox'; // Change one thing
$similarity = compareDeviceCharacteristics($characteristics1, $characteristics2);
echo "   Similarity score: {$similarity}\n";

echo "\n7. Testing location detection:\n";
// Test with different IPs
$testIPs = ['8.8.8.8', '1.1.1.1', '127.0.0.1'];
foreach ($testIPs as $testIP) {
    // Simple location detection test (won't work without internet)
    if ($testIP === '127.0.0.1') {
        $location = 'Local/Unknown Location';
    } else {
        $location = "Unknown Location ({$testIP})";
        // Try a simple detection
        try {
            $response = @file_get_contents("https://ipapi.co/{$testIP}/json/", false, stream_context_create([
                'http' => ['timeout' => 2]
            ]));
            if ($response) {
                $data = json_decode($response, true);
                if ($data && $data['status'] === 'success') {
                    $location = "{$data['city']}, {$data['regionName']}, {$data['country']}";
                }
            }
        } catch (Exception $e) {
            // Ignore
        }
    }
    echo "   {$testIP}: {$location}\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "Core functionality test completed!\n\n";

echo "Summary of what should be working:\n";
echo "✓ Enhanced device detection (browser, OS, device type)\n";
echo "✓ Graphics capabilities detection (GPU info, WebGL)\n";
echo "✓ Device fingerprinting (canvas, audio)\n";
echo "✓ Unique device ID generation\n";
echo "✓ User preferences detection\n";
echo "✓ Device similarity comparison\n";
echo "✓ Location detection (with external services)\n\n";

echo "The remaining issue is likely in the session creation integration.\n";
echo "Check that all these values are properly mapped to the session record.\n";
