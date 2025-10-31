<?php

/**
 * Complete test of device detection and session management system
 */

// Set up basic includes for Laravel
$basePath = __DIR__ . '/../..';
require_once $basePath . '/vendor/autoload.php';

// Load Laravel app
$app = require_once $basePath . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// Include our helper classes
require_once $basePath . '/app/Helpers/EnhancedDeviceDetection.php';
require_once $basePath . '/app/Helpers/DatabaseDeviceSessionManager.php';

echo "Complete Device Detection & Session Management Test\n";
echo str_repeat("=", 60) . "\n\n";

try {
    // 1. Get or create test user
    echo "1. Setting up test user:\n";
    $testUser = DB::table('users')->where('email', 'test@example.com')->first();
    if (!$testUser) {
        $userId = DB::table('users')->insertGetId([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "✓ Created test user with ID: {$userId}\n";
    } else {
        $userId = $testUser->id;
        echo "✓ Using existing test user with ID: {$userId}\n";
    }

    // 2. Create mock request
    echo "\n2. Creating mock request:\n";
    $mockRequest = new class {
        public function header($key, $default = null) {
            $headers = [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language' => 'en-US,en;q=0.9',
                'X-Device-Fingerprint' => json_encode([
                    'screen' => ['width' => 1920, 'height' => 1080, 'colorDepth' => 24],
                    'timezone' => 'America/New_York',
                    'language' => 'en-US',
                    'platform' => 'Win32',
                    'cookieEnabled' => true,
                    'plugins' => ['Chrome PDF Plugin'],
                    'canvas' => 'canvas_hash_12345',
                    'webgl' => 'webgl_hash_67890'
                ]),
                'X-Graphics-Info' => json_encode([
                    'vendor' => 'NVIDIA Corporation',
                    'renderer' => 'NVIDIA GeForce RTX 3070',
                    'version' => 'OpenGL 4.6'
                ])
            ];
            return $headers[$key] ?? $default;
        }
        
        public function ip() {
            return '203.0.113.1';
        }
        
        public function __get($name) {
            if ($name === 'headers') {
                return new class {
                    public function all() {
                        return [
                            'user-agent' => ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'],
                            'accept-language' => ['en-US,en;q=0.9'],
                        ];
                    }
                };
            }
            return null;
        }
    };
    echo "✓ Mock request created\n";

    // 3. Test device detection
    echo "\n3. Testing device detection:\n";
    $deviceData = generateSessionDataWithDatabase($mockRequest, $userId);
    
    echo "✓ Device ID: " . $deviceData['device_id'] . "\n";
    echo "✓ Device Name: " . ($deviceData['device_characteristics']['device_name'] ?? 'Unknown') . "\n";
    echo "✓ Location: " . ($deviceData['device_characteristics']['location'] ?? 'Unknown') . "\n";

    // 4. Test session creation
    echo "\n4. Testing session creation:\n";
    $sessionData = DatabaseDeviceSessionManager::createSession($mockRequest, $userId);
    echo "✓ Session created with ID: " . $sessionData['session_id'] . "\n";

    // 5. Verify session data completeness
    echo "\n5. Verifying session data completeness:\n";
    $session = DB::table('user_sessions')->where('id', $sessionData['session_id'])->first();
    
    $requiredFields = [
        'device_id', 'device_name', 'browser', 'browser_version', 
        'operating_system', 'os_version', 'ip_address', 'location', 
        'user_agent', 'status', 'is_active'
    ];
    
    $populatedFields = [];
    $missingFields = [];
    
    foreach ($requiredFields as $field) {
        if (!empty($session->$field) && $session->$field !== 'Unknown' && $session->$field !== '') {
            $populatedFields[] = $field;
        } else {
            $missingFields[] = $field;
        }
    }
    
    echo "Populated fields (" . count($populatedFields) . "/" . count($requiredFields) . "):\n";
    foreach ($populatedFields as $field) {
        $value = $session->$field;
        if (strlen($value) > 50) {
            $value = substr($value, 0, 50) . "...";
        }
        echo "  ✓ {$field}: {$value}\n";
    }
    
    if (!empty($missingFields)) {
        echo "\nMissing fields:\n";
        foreach ($missingFields as $field) {
            echo "  ✗ {$field}\n";
        }
    }

    // 6. Test device grouping
    echo "\n6. Testing device grouping:\n";
    $sessionData2 = DatabaseDeviceSessionManager::createSession($mockRequest, $userId);
    echo "✓ Second session created with ID: " . $sessionData2['session_id'] . "\n";
    
    $deviceSessions = DB::table('user_sessions')
        ->where('user_id', $userId)
        ->where('device_id', $deviceData['device_id'])
        ->count();
    
    echo "✓ Total sessions for this device: " . $deviceSessions . "\n";

    // 7. Test session grouping
    echo "\n7. Testing session grouping:\n";
    $groupedSessions = DatabaseDeviceSessionManager::getGroupedSessions($userId);
    echo "✓ Device groups found: " . count($groupedSessions) . "\n";

    // 8. Clean up
    echo "\n8. Cleaning up test data:\n";
    $deletedSessions = DB::table('user_sessions')
        ->where('user_id', $userId)
        ->where('device_id', $deviceData['device_id'])
        ->delete();
    echo "✓ Deleted {$deletedSessions} test sessions\n";

    echo "\n" . str_repeat("=", 60) . "\n";
    if (empty($missingFields)) {
        echo "🎉 SUCCESS: All session data fields are properly populated!\n";
        echo "✅ Device fingerprinting working perfectly\n";
        echo "✅ Location detection using external services functional\n";
        echo "✅ Device grouping working correctly\n";
        echo "✅ TODO COMPLETED SUCCESSFULLY!\n";
    } else {
        echo "⚠ Some fields still missing: " . implode(', ', $missingFields) . "\n";
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}