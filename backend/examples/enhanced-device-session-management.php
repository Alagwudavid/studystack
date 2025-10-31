<?php

/**
 * Example usage of Enhanced Device Detection with Device Grouping
 * This demonstrates how to implement session management with device fingerprinting
 */

require_once 'app/Helpers/EnhancedDeviceDetection.php';

class DeviceSessionManager {
    private $devices = []; // In real implementation, this would be a database
    private $sessions = []; // In real implementation, this would be a database

    /**
     * Handle user login with enhanced device detection
     */
    public function handleLogin($request, $userId) {
        // Generate session data with enhanced device detection
        $sessionData = generateSessionData($request);

        // Find or create device
        $existingDevices = $this->getUserDevices($userId);
        $deviceResult = findOrCreateDevice($sessionData, $existingDevices);

        $deviceId = $deviceResult['device_id'];
        $isNewDevice = $deviceResult['is_new_device'];

        if ($isNewDevice) {
            // Create new device record
            $deviceRecord = createDeviceRecord($sessionData);
            $this->saveDevice($userId, $deviceRecord);

            // Log new device detection
            $this->logSecurityEvent($userId, 'new_device_detected', [
                'device_id' => $deviceId,
                'device_name' => $deviceRecord['device_name'],
                'location' => $sessionData['device_characteristics']['location'],
                'risk_score' => $deviceRecord['risk_score'],
            ]);

            // If high risk, require additional verification
            if ($deviceRecord['risk_score'] > 0.5) {
                return $this->requireAdditionalVerification($userId, $deviceId, $sessionData);
            }
        } else {
            // Update existing device
            $this->updateDeviceLastSeen($userId, $deviceId);

            // Check for suspicious changes
            $this->checkForSuspiciousChanges($userId, $deviceId, $sessionData, $deviceResult);
        }

        // Create session under the device
        $sessionRecord = [
            'session_token' => $sessionData['session_token'],
            'device_id' => $deviceId,
            'user_id' => $userId,
            'ip_address' => $sessionData['ip_address'],
            'location' => $sessionData['device_characteristics']['location'],
            'user_agent' => $sessionData['device_characteristics']['user_agent'],
            'created_at' => now(),
            'last_activity_at' => now(),
            'is_active' => true,
        ];

        $this->saveSession($sessionRecord);

        return [
            'success' => true,
            'session_token' => $sessionData['session_token'],
            'device_id' => $deviceId,
            'is_new_device' => $isNewDevice,
            'requires_verification' => false,
        ];
    }

    /**
     * Get user's devices grouped by device ID
     */
    public function getUserDevicesGrouped($userId) {
        $devices = $this->getUserDevices($userId);
        $sessions = $this->getUserSessions($userId);

        $groupedData = [];

        foreach ($devices as $deviceId => $device) {
            $deviceSessions = array_filter($sessions, function($session) use ($deviceId) {
                return $session['device_id'] === $deviceId;
            });

            // Sort sessions by most recent first
            usort($deviceSessions, function($a, $b) {
                return strtotime($b['last_activity_at']) - strtotime($a['last_activity_at']);
            });

            $groupedData[] = [
                'device_id' => $deviceId,
                'device_name' => $device['device_name'],
                'device_type' => $device['characteristics']['device_type'],
                'browser' => $device['characteristics']['browser'],
                'operating_system' => $device['characteristics']['operating_system'],
                'location' => $device['locations'][0] ?? 'Unknown',
                'first_seen' => $device['first_seen'],
                'last_seen' => $device['last_seen'],
                'session_count' => count($deviceSessions),
                'active_sessions' => array_filter($deviceSessions, function($s) { return $s['is_active']; }),
                'is_trusted' => $device['is_trusted'],
                'risk_score' => $device['risk_score'],
                'sessions' => $deviceSessions,
            ];
        }

        // Sort devices by most recent activity
        usort($groupedData, function($a, $b) {
            return strtotime($b['last_seen']) - strtotime($a['last_seen']);
        });

        return $groupedData;
    }

    /**
     * Check for suspicious changes in device characteristics
     */
    private function checkForSuspiciousChanges($userId, $deviceId, $newSessionData, $deviceResult) {
        if (isset($deviceResult['similarity_score']) && $deviceResult['similarity_score'] < 0.95) {
            // Device characteristics have changed significantly
            $this->logSecurityEvent($userId, 'device_characteristics_changed', [
                'device_id' => $deviceId,
                'similarity_score' => $deviceResult['similarity_score'],
                'new_location' => $newSessionData['device_characteristics']['location'],
                'changes_detected' => $this->identifyChanges($deviceResult['existing_device'], $newSessionData),
            ]);
        }
    }

    /**
     * Identify specific changes between device characteristics
     */
    private function identifyChanges($existingDevice, $newSessionData) {
        $changes = [];
        $old = $existingDevice['characteristics'] ?? [];
        $new = $newSessionData['device_characteristics'];

        $importantFields = [
            'location', 'browser', 'operating_system', 'screen_resolution',
            'gpu_vendor', 'gpu_model', 'timezone_offset'
        ];

        foreach ($importantFields as $field) {
            if (isset($old[$field]) && isset($new[$field]) && $old[$field] !== $new[$field]) {
                $changes[$field] = [
                    'old' => $old[$field],
                    'new' => $new[$field],
                ];
            }
        }

        return $changes;
    }

    /**
     * Require additional verification for high-risk devices
     */
    private function requireAdditionalVerification($userId, $deviceId, $sessionData) {
        // Mark session as pending verification
        $this->markSessionPendingVerification($sessionData['session_token']);

        // Send notification to user
        $this->sendNewDeviceNotification($userId, $deviceId, $sessionData);

        return [
            'success' => false,
            'requires_verification' => true,
            'verification_method' => 'email_or_sms',
            'device_id' => $deviceId,
            'message' => 'New device detected. Please verify this login attempt.',
        ];
    }

    /**
     * Trust a device after verification
     */
    public function trustDevice($userId, $deviceId) {
        $devices = $this->getUserDevices($userId);
        if (isset($devices[$deviceId])) {
            $devices[$deviceId]['is_trusted'] = true;
            $devices[$deviceId]['risk_score'] = max(0, $devices[$deviceId]['risk_score'] - 0.3);
            $this->saveDevice($userId, $devices[$deviceId]);

            $this->logSecurityEvent($userId, 'device_trusted', ['device_id' => $deviceId]);
        }
    }

    /**
     * Revoke all sessions for a specific device
     */
    public function revokeDeviceSessions($userId, $deviceId) {
        $sessions = $this->getUserSessions($userId);
        $revokedCount = 0;

        foreach ($sessions as &$session) {
            if ($session['device_id'] === $deviceId && $session['is_active']) {
                $session['is_active'] = false;
                $session['revoked_at'] = now();
                $revokedCount++;
            }
        }

        $this->logSecurityEvent($userId, 'device_sessions_revoked', [
            'device_id' => $deviceId,
            'sessions_revoked' => $revokedCount,
        ]);

        return $revokedCount;
    }

    // Mock storage methods (implement with actual database in production)
    private function getUserDevices($userId) { return $this->devices[$userId] ?? []; }
    private function getUserSessions($userId) { return $this->sessions[$userId] ?? []; }
    private function saveDevice($userId, $device) { $this->devices[$userId][$device['device_id']] = $device; }
    private function saveSession($session) { $this->sessions[$session['user_id']][] = $session; }
    private function updateDeviceLastSeen($userId, $deviceId) {
        if (isset($this->devices[$userId][$deviceId])) {
            $this->devices[$userId][$deviceId]['last_seen'] = now();
            $this->devices[$userId][$deviceId]['session_count']++;
        }
    }
    private function markSessionPendingVerification($token) { /* Implementation */ }
    private function sendNewDeviceNotification($userId, $deviceId, $sessionData) { /* Implementation */ }
    private function logSecurityEvent($userId, $event, $data) {
        error_log("Security Event: {$event} for user {$userId} - " . json_encode($data));
    }
}

// Example usage
if (false) { // Set to true to run example
    $sessionManager = new DeviceSessionManager();

    // Mock request object
    $request = (object)[
        'headers' => (object)['all' => function() {
            return [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'X-Screen-Resolution' => '1920x1080',
                'X-GPU-Vendor' => 'NVIDIA',
                'X-GPU-Model' => 'GeForce RTX 3070',
                'X-Timezone-Offset' => '-480',
                'X-Canvas-Fingerprint' => 'abc123def456',
            ];
        }],
        'header' => function($name) {
            $headers = [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ];
            return $headers[$name] ?? null;
        },
        'ip' => function() { return '192.168.1.100'; }
    ];

    // Handle login
    $result = $sessionManager->handleLogin($request, 'user123');
    echo "Login Result: " . json_encode($result, JSON_PRETTY_PRINT) . "\n";

    // Get grouped devices
    $devices = $sessionManager->getUserDevicesGrouped('user123');
    echo "User Devices: " . json_encode($devices, JSON_PRETTY_PRINT) . "\n";
}
