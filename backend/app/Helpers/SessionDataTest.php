<?php

/**
 * Test the enhanced device fingerprinting system
 */

// Include the necessary files
require_once __DIR__ . '/EnhancedDeviceDetection.php';
require_once __DIR__ . '/DatabaseDeviceSessionManager.php';

class SessionDataTest
{
    public static function testSessionCreation()
    {
        echo "Testing Enhanced Device Fingerprinting Session Creation...\n\n";

        // Create a mock request with comprehensive headers
        $mockRequest = new class {
            private $headersData = [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'X-Device-Fingerprint' => 'canvas:abcd1234,audio:efgh5678',
                'X-Graphics-Info' => 'vendor:NVIDIA Corporation,renderer:NVIDIA GeForce RTX 3080,version:OpenGL 4.6',
                'X-Hardware-Info' => 'cores:8,memory:16,gpu-memory:10240',
                'X-Screen-Info' => 'resolution:2560x1440,depth:24,ratio:1.5',
                'Accept-Language' => 'en-US,en;q=0.9',
                'Accept-Timezone' => 'America/New_York',
            ];

            public $headers;

            public function __construct() {
                $headersData = $this->headersData;
                $this->headers = new class($headersData) {
                    private $headers;
                    public function __construct($headers) { $this->headers = $headers; }
                    public function all() { return $this->headers; }
                };
            }

            public function header($name) {
                return $this->headersData[$name] ?? null;
            }

            public function ip() {
                return '8.8.8.8'; // Use a real IP for location testing
            }

            public function input($key, $default = null) {
                return $default;
            }
        };

        // Test the enhanced device detection
        echo "1. Testing generateSessionDataWithDatabase function...\n";
        $sessionData = generateSessionDataWithDatabase($mockRequest, 1);

        echo "Session Data Generated:\n";
        echo "Device ID: " . $sessionData['device_id'] . "\n";
        echo "Session Token: " . $sessionData['session_token'] . "\n";
        echo "IP Address: " . $sessionData['ip_address'] . "\n";

        echo "\nDevice Characteristics:\n";
        $characteristics = $sessionData['device_characteristics'];

        $importantFields = [
            'device_name', 'device_type', 'browser', 'browser_version',
            'operating_system', 'os_version', 'location', 'gpu_vendor',
            'gpu_model', 'screen_resolution', 'canvas_fingerprint'
        ];

        foreach ($importantFields as $field) {
            $value = $characteristics[$field] ?? 'NOT SET';
            echo "  {$field}: {$value}\n";
        }

        echo "\n2. Testing DatabaseDeviceSessionManager::createSession...\n";
        try {
            $sessionResult = DatabaseDeviceSessionManager::createSession($mockRequest, 1);

            echo "Session created successfully!\n";
            echo "Session ID: " . $sessionResult['session_id'] . "\n";
            echo "Device Management: " . print_r($sessionResult['device_management'], true) . "\n";

            // Check if all required fields are present in the session record
            $sessionRecord = $sessionResult['session_record'];
            $requiredFields = [
                'device_name', 'browser', 'browser_version', 'operating_system',
                'os_version', 'location', 'ip_address', 'user_agent'
            ];

            echo "Checking session record completeness:\n";
            foreach ($requiredFields as $field) {
                $value = $sessionRecord[$field] ?? 'MISSING';
                $status = ($value && $value !== 'MISSING') ? '✓' : '✗';
                echo "  {$status} {$field}: {$value}\n";
            }

        } catch (Exception $e) {
            echo "ERROR: " . $e->getMessage() . "\n";
            echo "Stack trace: " . $e->getTraceAsString() . "\n";
        }

        return $sessionData;
    }

    public static function testLocationDetection()
    {
        echo "\n3. Testing Location Detection with different IPs...\n";

        $testIPs = [
            '8.8.8.8' => 'Google DNS',
            '1.1.1.1' => 'Cloudflare DNS',
            '208.67.222.222' => 'OpenDNS',
            '127.0.0.1' => 'Localhost'
        ];

        foreach ($testIPs as $ip => $description) {
            echo "Testing {$description} ({$ip}): ";

            // Simulate the location detection
            $location = 'Unknown Location'; // Default

            if ($ip === '127.0.0.1' || $ip === 'localhost') {
                $location = 'Local/Unknown Location';
            } else {
                // Test with ipapi.co (location service)
                try {
                    $response = @file_get_contents("https://ipapi.co/{$ip}/json/");
                    if ($response) {
                        $data = json_decode($response, true);
                        if ($data && !isset($data['error'])) {
                            $city = $data['city'] ?? '';
                            $region = $data['region'] ?? '';
                            $country = $data['country_name'] ?? '';

                            if ($city && $region && $country) {
                                $location = "{$city}, {$region}, {$country}";
                            } elseif ($region && $country) {
                                $location = "{$region}, {$country}";
                            } elseif ($country) {
                                $location = $country;
                            }
                        }
                    }
                } catch (Exception $e) {
                    $location = "Error: " . $e->getMessage();
                }
            }

            echo $location . "\n";
        }
    }

    public static function runAllTests()
    {
        echo "Enhanced Device Fingerprinting - Data Completeness Test\n";
        echo str_repeat("=", 60) . "\n\n";

        // Test session creation
        $sessionData = self::testSessionCreation();

        // Test location detection
        self::testLocationDetection();

        echo "\n" . str_repeat("=", 60) . "\n";
        echo "Test completed. Check the output above for any missing fields.\n\n";

        echo "Expected improvements:\n";
        echo "• All device characteristics should be populated\n";
        echo "• Location should be detected using external IP services\n";
        echo "• Browser and OS versions should be extracted\n";
        echo "• Device names should be generated properly\n";
        echo "• Session records should have all required fields\n\n";
    }
}

// Run the test
if (php_sapi_name() === 'cli') {
    SessionDataTest::runAllTests();
}
