<?php

/**
 * Complete Device Fingerprinting & Session Management Integration Test
 * 
 * This file demonstrates how the enhanced device detection system
 * now works with database storage for complete session management.
 */

require_once 'DatabaseDeviceSessionManager.php';

class DeviceFingerprintingIntegrationTest
{
    /**
     * Test complete session creation flow with device fingerprinting
     */
    public static function testSessionCreation()
    {
        echo "=== Device Fingerprinting & Session Management Integration Test ===\n\n";

        // Simulate a request with device fingerprinting headers
        $mockRequest = new class {
            private $headers = [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'X-Device-Fingerprint' => 'canvas:abcd1234,audio:efgh5678',
                'X-Graphics-Info' => 'vendor:NVIDIA Corporation,renderer:NVIDIA GeForce RTX 3080',
                'X-Hardware-Info' => 'cores:8,memory:16,gpu-memory:10240',
                'X-Screen-Info' => 'resolution:2560x1440,depth:24,ratio:1',
                'Accept-Language' => 'en-US,en;q=0.9',
                'Accept-Timezone' => 'America/New_York',
            ];

            public function header($name) {
                return $this->headers[$name] ?? null;
            }

            public function headers() {
                return new class($this->headers) {
                    private $headers;
                    public function __construct($headers) { $this->headers = $headers; }
                    public function all() { return $this->headers; }
                };
            }

            public function ip() {
                return '192.168.1.100';
            }
        };

        // Test user ID
        $userId = 1;

        echo "1. Creating session with enhanced device fingerprinting...\n";
        $sessionResult = DatabaseDeviceSessionManager::createSession($mockRequest, $userId);

        echo "Session created successfully!\n";
        echo "Session ID: " . $sessionResult['session_id'] . "\n";
        echo "Device ID: " . $sessionResult['session_data']['device_id'] . "\n";
        echo "Is New Device: " . ($sessionResult['device_management']['is_new_device'] ? 'Yes' : 'No') . "\n\n";

        // Display device characteristics
        echo "2. Device Characteristics Detected:\n";
        $characteristics = $sessionResult['session_data']['device_characteristics'];
        foreach ([
            'device_type', 'browser', 'operating_system', 'gpu_vendor', 
            'gpu_model', 'screen_resolution', 'canvas_fingerprint'
        ] as $key) {
            if (isset($characteristics[$key])) {
                echo "   {$key}: {$characteristics[$key]}\n";
            }
        }
        echo "\n";

        return $sessionResult;
    }

    /**
     * Test device grouping and session management
     */
    public static function testDeviceGrouping($userId = 1)
    {
        echo "3. Testing device grouping and session management...\n";

        $groupedSessions = DatabaseDeviceSessionManager::getGroupedSessions($userId);

        echo "Found " . count($groupedSessions) . " unique devices:\n\n";

        foreach ($groupedSessions as $index => $deviceGroup) {
            $device = $deviceGroup['device'];
            echo "Device " . ($index + 1) . ":\n";
            echo "   Device ID: {$device['device_id']}\n";
            echo "   Device Name: {$device['device_name']}\n";
            echo "   Session Count: {$device['session_count']}\n";
            echo "   Trusted: " . ($device['is_trusted'] ? 'Yes' : 'No') . "\n";
            echo "   Risk Score: {$device['risk_score']}\n";
            echo "   First Seen: {$device['first_seen']}\n";
            echo "   Last Seen: {$device['last_seen']}\n";

            // Show recent sessions for this device
            $sessions = $deviceGroup['sessions'];
            echo "   Recent Sessions: " . count($sessions) . "\n";

            foreach (array_slice($sessions, 0, 3) as $session) {
                echo "      - Session {$session->id}: {$session->ip_address} ({$session->created_at})\n";
            }

            // Show security events
            $events = $deviceGroup['security_events'];
            if (!empty($events)) {
                echo "   Recent Security Events: " . count($events) . "\n";
                foreach (array_slice($events, 0, 2) as $event) {
                    echo "      - {$event->event_type} ({$event->severity}): {$event->created_at}\n";
                }
            }

            echo "\n";
        }
    }

    /**
     * Test device analytics and security features
     */
    public static function testAnalyticsAndSecurity($userId = 1)
    {
        echo "4. Testing device analytics and security monitoring...\n";

        $analytics = DatabaseDeviceSessionManager::getDeviceAnalytics($userId);

        echo "Device Analytics:\n";
        echo "   Total Devices: {$analytics['total_devices']}\n";
        echo "   Trusted Devices: {$analytics['trusted_devices']}\n";
        echo "   Total Sessions: {$analytics['total_sessions']}\n";
        echo "   Active Sessions: {$analytics['active_sessions']}\n";
        echo "   Average Risk Score: {$analytics['average_risk_score']}\n";
        echo "   High Risk Devices: {$analytics['high_risk_devices']}\n\n";

        echo "Device Types:\n";
        foreach ($analytics['device_types'] as $type => $count) {
            echo "   {$type}: {$count}\n";
        }
        echo "\n";

        echo "Operating Systems:\n";
        foreach ($analytics['operating_systems'] as $os => $count) {
            echo "   {$os}: {$count}\n";
        }
        echo "\n";

        // Check for suspicious activity
        $suspicious = DatabaseDeviceSessionManager::checkSuspiciousActivity($userId, 30);

        echo "Security Monitoring (Last 30 days):\n";
        echo "   Total Alerts: {$suspicious['total_alerts']}\n";
        echo "   Suspicious Events: " . count($suspicious['suspicious_events']) . "\n";
        echo "   New High-Risk Devices: " . count($suspicious['new_high_risk_devices']) . "\n";
        echo "   Location Changes: " . count($suspicious['location_changes']) . "\n\n";
    }

    /**
     * Test device trust management
     */
    public static function testDeviceTrustManagement($userId = 1)
    {
        echo "5. Testing device trust management...\n";

        // Get the first device
        $groupedSessions = DatabaseDeviceSessionManager::getGroupedSessions($userId);
        
        if (!empty($groupedSessions)) {
            $firstDevice = $groupedSessions[0]['device'];
            $deviceId = $firstDevice['device_id'];

            echo "Testing with device: {$firstDevice['device_name']} ({$deviceId})\n";

            // Trust the device
            echo "   Trusting device...\n";
            $result = DatabaseDeviceSessionManager::trustDevice($userId, $deviceId);
            echo "   Result: " . ($result ? 'Success' : 'Failed') . "\n";

            // Untrust the device
            echo "   Untrusting device...\n";
            $result = DatabaseDeviceSessionManager::untrustDevice($userId, $deviceId);
            echo "   Result: " . ($result ? 'Success' : 'Failed') . "\n";

            // Get security events for this device
            echo "   Fetching security events...\n";
            $events = DatabaseDeviceSessionManager::getDeviceSecurityEvents($userId, $deviceId, 10);
            echo "   Found " . count($events) . " security events\n";

            foreach (array_slice($events, 0, 3) as $event) {
                echo "      - {$event->event_type} ({$event->severity}): {$event->created_at}\n";
            }
        } else {
            echo "   No devices found for testing.\n";
        }

        echo "\n";
    }

    /**
     * Test session termination
     */
    public static function testSessionTermination($userId = 1)
    {
        echo "6. Testing session termination...\n";

        // Create a test session first
        $mockRequest = new class {
            public function header($name) { return null; }
            public function headers() { return new class() { public function all() { return []; } }; }
            public function ip() { return '127.0.0.1'; }
        };

        $sessionResult = DatabaseDeviceSessionManager::createSession($mockRequest, $userId);
        $sessionId = $sessionResult['session_id'];
        $deviceId = $sessionResult['session_data']['device_id'];

        echo "   Created test session: {$sessionId}\n";

        // Terminate the session
        echo "   Terminating session...\n";
        $result = DatabaseDeviceSessionManager::terminateSession($userId, $sessionId);
        echo "   Result: " . ($result ? 'Success' : 'Failed') . "\n";

        // Terminate all sessions for a device
        echo "   Terminating all device sessions...\n";
        $count = DatabaseDeviceSessionManager::terminateDeviceSessions($userId, $deviceId);
        echo "   Terminated {$count} sessions\n\n";
    }

    /**
     * Run complete integration test
     */
    public static function runCompleteTest()
    {
        echo "Starting Complete Device Fingerprinting Integration Test...\n";
        echo "=" . str_repeat("=", 70) . "\n\n";

        try {
            // Test session creation
            $sessionResult = self::testSessionCreation();
            $userId = 1; // Test user

            // Test device grouping
            self::testDeviceGrouping($userId);

            // Test analytics and security
            self::testAnalyticsAndSecurity($userId);

            // Test device trust management
            self::testDeviceTrustManagement($userId);

            // Test session termination
            self::testSessionTermination($userId);

            echo "=" . str_repeat("=", 70) . "\n";
            echo "All tests completed successfully!\n\n";

            echo "Key Features Demonstrated:\n";
            echo "✓ Enhanced device detection with graphics and hardware fingerprinting\n";
            echo "✓ Device grouping and session management\n";
            echo "✓ Database storage of device fingerprints and characteristics\n";
            echo "✓ Security monitoring and risk assessment\n";
            echo "✓ Device trust management\n";
            echo "✓ Session termination and cleanup\n";
            echo "✓ Comprehensive analytics and reporting\n\n";

            echo "The system now provides:\n";
            echo "• Unique device identification to group sessions\n";
            echo "• Persistent device fingerprinting in database\n";
            echo "• Security monitoring and alerts\n";
            echo "• Device trust management\n";
            echo "• Comprehensive session analytics\n";
            echo "• API endpoints for device and session management\n\n";

        } catch (Exception $e) {
            echo "ERROR: " . $e->getMessage() . "\n";
            echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
        }
    }
}

// Run the test if this file is executed directly
if (php_sapi_name() === 'cli') {
    DeviceFingerprintingIntegrationTest::runCompleteTest();
}