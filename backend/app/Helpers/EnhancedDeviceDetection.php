<?php

if (!function_exists('getLocationFromIP')) {
    /**
     * Get location information from IP address using ipify.org and ipapi.co
     */
    function getLocationFromIP(?string $ip): string {
        if (!$ip || $ip === '127.0.0.1' || $ip === 'localhost' || filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return 'Local/Unknown Location';
        }

        // Get IP using ipify.org and location using ipapi.co
        try {
            // If IP is not provided or is local, get public IP using ipify.org
            $publicIp = $ip;
            if (!$ip || $ip === '127.0.0.1' || $ip === 'localhost' || filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
                $context = stream_context_create([
                    'http' => [
                        'timeout' => 5,
                        'user_agent' => 'Bitroot-Backend/1.0 (IP Detection)',
                        'header' => 'Accept: application/json',
                    ],
                ]);

                $ipifyResponse = @file_get_contents('https://api.ipify.org?format=json', false, $context);
                if ($ipifyResponse) {
                    $ipifyData = json_decode($ipifyResponse, true);
                    if ($ipifyData && isset($ipifyData['ip'])) {
                        $publicIp = $ipifyData['ip'];
                    }
                }
            }

            // Get location data using ipapi.co
            if ($publicIp && $publicIp !== '127.0.0.1' && $publicIp !== 'localhost') {
                $context = stream_context_create([
                    'http' => [
                        'timeout' => 5,
                        'user_agent' => 'Bitroot-Backend/1.0 (Location Service)',
                        'header' => 'Accept: application/json',
                    ],
                ]);

                $locationResponse = @file_get_contents("https://ipapi.co/{$publicIp}/json/", false, $context);
                if ($locationResponse) {
                    $locationData = json_decode($locationResponse, true);
                    if ($locationData && !isset($locationData['error'])) {
                        $parts = array_filter([
                            $locationData['city'] ?? null,
                            $locationData['region'] ?? null,
                            $locationData['country_name'] ?? null,
                        ]);
                        if (!empty($parts)) {
                            return implode(', ', $parts);
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            // Log error but continue with fallback
            error_log("Location detection failed: " . $e->getMessage());
        }

        // Fallback to basic IP display
        return "Unknown Location ({$ip})";
    }
}

if (!function_exists('enhancedDeviceDetection')) {
    /**
     * Enhanced device detection with better accuracy
     */
    function enhancedDeviceDetection(string $userAgent, string $ip = null): array {
        $ua = strtolower($userAgent);

        // Enhanced device type detection
        $deviceType = 'desktop';
        if (preg_match('/ipad/', $ua) ||
            (preg_match('/android/', $ua) && !preg_match('/mobile/', $ua)) ||
            preg_match('/tablet/', $ua) ||
            preg_match('/kindle/', $ua) ||
            (preg_match('/windows/', $ua) && preg_match('/touch/', $ua) && !preg_match('/phone/', $ua))) {
            $deviceType = 'tablet';
        } elseif (preg_match('/mobile|iphone|ipod|android.*mobile|blackberry|windows phone|nokia|opera mini|samsung|huawei|xiaomi/', $ua)) {
            $deviceType = 'mobile';
        }

        // Enhanced browser detection with versions
        $browser = 'Unknown';
        $browserVersion = 'Unknown';

        $browserPatterns = [
            'Edge' => '/edg(?:e|ios|a)?\/([\d\.]+)/',
            'Chrome' => '/chrome\/([\d\.]+)/',
            'Firefox' => '/firefox\/([\d\.]+)/',
            'Safari' => '/version\/([\d\.]+).*safari/',
            'Opera' => '/(?:opera|opr)\/([\d\.]+)/',
            'Samsung Internet' => '/samsungbrowser\/([\d\.]+)/',
            'Internet Explorer' => '/(?:msie |trident.*rv:)([\d\.]+)/',
        ];

        foreach ($browserPatterns as $name => $pattern) {
            if (preg_match($pattern, $ua, $matches)) {
                $browser = $name;
                $browserVersion = $matches[1] ?? 'Unknown';
                break;
            }
        }

        // Enhanced OS detection with versions
        $os = 'Unknown';
        $osVersion = 'Unknown';

        if (preg_match('/windows nt ([\d\.]+)/', $ua, $matches)) {
            $os = 'Windows';
            $winVersions = [
                '10.0' => '10/11',
                '6.3' => '8.1',
                '6.2' => '8',
                '6.1' => '7',
                '6.0' => 'Vista',
                '5.1' => 'XP',
            ];
            $osVersion = $winVersions[$matches[1]] ?? $matches[1];
        } elseif (preg_match('/mac os x ([\d_]+)/', $ua, $matches)) {
            $os = 'macOS';
            $osVersion = str_replace('_', '.', $matches[1]);
        } elseif (preg_match('/android ([\d\.]+)/', $ua, $matches)) {
            $os = 'Android';
            $osVersion = $matches[1];
        } elseif (preg_match('/os ([\d_]+)/', $ua, $matches)) {
            $os = 'iOS';
            $osVersion = str_replace('_', '.', $matches[1]);
        } elseif (preg_match('/linux/', $ua)) {
            $os = 'Linux';
        }

        // Enhanced device name generation
        $deviceName = generateEnhancedDeviceName($ua, $deviceType, $os, $browser);

        // Get location information
        $location = $ip ? getLocationFromIP($ip) : 'Unknown Location';

        return [
            'device_type' => $deviceType,
            'browser' => $browser,
            'browser_version' => $browserVersion,
            'operating_system' => $os,
            'os_version' => $osVersion,
            'device_name' => $deviceName,
            'location' => $location,
            'user_agent' => $userAgent,
        ];
    }
}

if (!function_exists('generateEnhancedDeviceName')) {
    /**
     * Generate a more descriptive device name
     */
    function generateEnhancedDeviceName(string $ua, string $deviceType, string $os, string $browser): string {
        // Specific device model extraction
        if (preg_match('/iphone/', $ua)) {
            return 'iPhone';
        }

        if (preg_match('/ipad/', $ua)) {
            return 'iPad';
        }

        if (preg_match('/android/', $ua)) {
            // Try to extract Android device model
            $androidDevices = [
                '/samsung ([^;]+)/' => 'Samsung',
                '/huawei ([^;]+)/' => 'Huawei',
                '/xiaomi ([^;]+)/' => 'Xiaomi',
                '/oneplus ([^;]+)/' => 'OnePlus',
                '/(pixel [^;]+)/' => 'Google',
                '/(lg-[^;]+)/' => 'LG',
                '/sony ([^;]+)/' => 'Sony',
            ];

            foreach ($androidDevices as $pattern => $brand) {
                if (preg_match($pattern, $ua, $matches)) {
                    $model = trim($matches[1]);
                    return "{$brand} {$model}";
                }
            }

            return 'Android Device';
        }

        // Generic naming for other devices
        $deviceTypeCapitalized = ucfirst($deviceType);

        switch ($os) {
            case 'Windows':
                return "Windows {$deviceTypeCapitalized}";
            case 'macOS':
                return $deviceType === 'desktop' ? 'Mac' : "Mac {$deviceTypeCapitalized}";
            case 'Linux':
                return "Linux {$deviceTypeCapitalized}";
            default:
                return "{$os} {$deviceTypeCapitalized}";
        }
    }
}

if (!function_exists('detectGraphicsCapabilities')) {
    /**
     * Detect graphics capabilities from client headers and user agent
     */
    function detectGraphicsCapabilities(array $headers, string $userAgent): array {
        $graphics = [
            'gpu_vendor' => 'Unknown',
            'gpu_model' => 'Unknown',
            'webgl_supported' => false,
            'webgl_version' => 'Unknown',
            'gpu_renderer' => 'Unknown',
            'hardware_acceleration' => 'Unknown',
            'max_texture_size' => 'Unknown',
            'graphics_memory' => 'Unknown',
        ];

        // Check for GPU information in custom headers (sent by client-side detection)
        if (isset($headers['X-GPU-Vendor'])) {
            $graphics['gpu_vendor'] = $headers['X-GPU-Vendor'];
        }

        if (isset($headers['X-GPU-Model'])) {
            $graphics['gpu_model'] = $headers['X-GPU-Model'];
        }

        if (isset($headers['X-GPU-Renderer'])) {
            $graphics['gpu_renderer'] = $headers['X-GPU-Renderer'];
        }

        if (isset($headers['X-WebGL-Version'])) {
            $graphics['webgl_version'] = $headers['X-WebGL-Version'];
            $graphics['webgl_supported'] = true;
        }

        if (isset($headers['X-Hardware-Acceleration'])) {
            $graphics['hardware_acceleration'] = $headers['X-Hardware-Acceleration'];
        }

        if (isset($headers['X-Max-Texture-Size'])) {
            $graphics['max_texture_size'] = $headers['X-Max-Texture-Size'];
        }

        if (isset($headers['X-Graphics-Memory'])) {
            $graphics['graphics_memory'] = $headers['X-Graphics-Memory'];
        }

        // Detect common GPU vendors from user agent
        $ua = strtolower($userAgent);
        if (strpos($ua, 'intel') !== false) {
            $graphics['gpu_vendor'] = $graphics['gpu_vendor'] === 'Unknown' ? 'Intel' : $graphics['gpu_vendor'];
        } elseif (strpos($ua, 'nvidia') !== false || strpos($ua, 'geforce') !== false) {
            $graphics['gpu_vendor'] = $graphics['gpu_vendor'] === 'Unknown' ? 'NVIDIA' : $graphics['gpu_vendor'];
        } elseif (strpos($ua, 'amd') !== false || strpos($ua, 'radeon') !== false) {
            $graphics['gpu_vendor'] = $graphics['gpu_vendor'] === 'Unknown' ? 'AMD' : $graphics['gpu_vendor'];
        }

        return $graphics;
    }
}

if (!function_exists('generateDeviceFingerprint')) {
    /**
     * Generate a comprehensive device fingerprint
     */
    function generateDeviceFingerprint(array $deviceInfo, array $headers): array {
        $fingerprint = [
            'screen_resolution' => 'Unknown',
            'color_depth' => 'Unknown',
            'pixel_ratio' => 'Unknown',
            'timezone_offset' => 'Unknown',
            'canvas_fingerprint' => 'Unknown',
            'audio_fingerprint' => 'Unknown',
            'platform_details' => 'Unknown',
            'cpu_cores' => 'Unknown',
            'memory_gb' => 'Unknown',
            'touch_support' => false,
            'webrtc_support' => false,
        ];

        // Screen and display information
        if (isset($headers['X-Screen-Resolution'])) {
            $fingerprint['screen_resolution'] = $headers['X-Screen-Resolution'];
        }

        if (isset($headers['X-Color-Depth'])) {
            $fingerprint['color_depth'] = $headers['X-Color-Depth'];
        }

        if (isset($headers['X-Pixel-Ratio'])) {
            $fingerprint['pixel_ratio'] = $headers['X-Pixel-Ratio'];
        }

        if (isset($headers['X-Timezone-Offset'])) {
            $fingerprint['timezone_offset'] = $headers['X-Timezone-Offset'];
        }

        // Canvas and audio fingerprinting
        if (isset($headers['X-Canvas-Fingerprint'])) {
            $fingerprint['canvas_fingerprint'] = $headers['X-Canvas-Fingerprint'];
        }

        if (isset($headers['X-Audio-Fingerprint'])) {
            $fingerprint['audio_fingerprint'] = $headers['X-Audio-Fingerprint'];
        }

        // Hardware specifications
        if (isset($headers['X-CPU-Cores'])) {
            $fingerprint['cpu_cores'] = $headers['X-CPU-Cores'];
        }

        if (isset($headers['X-Memory-GB'])) {
            $fingerprint['memory_gb'] = $headers['X-Memory-GB'];
        }

        // Platform and capability detection
        if (isset($headers['X-Platform-Details'])) {
            $fingerprint['platform_details'] = $headers['X-Platform-Details'];
        }

        if (isset($headers['X-Touch-Support'])) {
            $fingerprint['touch_support'] = filter_var($headers['X-Touch-Support'], FILTER_VALIDATE_BOOLEAN);
        }

        if (isset($headers['X-WebRTC-Support'])) {
            $fingerprint['webrtc_support'] = filter_var($headers['X-WebRTC-Support'], FILTER_VALIDATE_BOOLEAN);
        }

        return $fingerprint;
    }
}

if (!function_exists('generateUniqueDeviceId')) {
    /**
     * Generate a unique device ID based on multiple factors
     */
    function generateUniqueDeviceId(array $deviceInfo, array $graphics, array $fingerprint): string {
        // Combine stable device characteristics
        $deviceSignature = [
            'os' => $deviceInfo['operating_system'] ?? 'unknown',
            'os_version' => $deviceInfo['os_version'] ?? 'unknown',
            'browser' => $deviceInfo['browser'] ?? 'unknown',
            'device_type' => $deviceInfo['device_type'] ?? 'unknown',
            'screen_res' => $fingerprint['screen_resolution'] ?? 'unknown',
            'timezone_offset' => $fingerprint['timezone_offset'] ?? 'unknown',
            'gpu_vendor' => $graphics['gpu_vendor'] ?? 'unknown',
            'gpu_model' => $graphics['gpu_model'] ?? 'unknown',
            'cpu_cores' => $fingerprint['cpu_cores'] ?? 'unknown',
            'memory' => $fingerprint['memory_gb'] ?? 'unknown',
            'color_depth' => $fingerprint['color_depth'] ?? 'unknown',
            'pixel_ratio' => $fingerprint['pixel_ratio'] ?? 'unknown',
            'canvas' => substr($fingerprint['canvas_fingerprint'] ?? 'unknown', 0, 10), // First 10 chars
            'webgl_version' => $graphics['webgl_version'] ?? 'unknown',
        ];

        // Create a stable hash
        $signatureString = implode('|', $deviceSignature);
        $deviceHash = hash('sha256', $signatureString);

        // Create a human-readable device ID
        $deviceId = 'device_' . substr($deviceHash, 0, 16);

        return $deviceId;
    }
}

if (!function_exists('compareDeviceCharacteristics')) {
    /**
     * Compare device characteristics to determine if it's the same device
     */
    function compareDeviceCharacteristics(array $newDevice, array $existingDevice): float {
        $weights = [
            'operating_system' => 0.25,
            'browser' => 0.15,
            'screen_resolution' => 0.20,
            'gpu_vendor' => 0.15,
            'gpu_model' => 0.10,
            'timezone_offset' => 0.05,
            'cpu_cores' => 0.05,
            'canvas_fingerprint' => 0.05,
        ];

        $similarity = 0.0;
        $totalWeight = 0.0;

        foreach ($weights as $characteristic => $weight) {
            if (isset($newDevice[$characteristic]) && isset($existingDevice[$characteristic])) {
                if ($newDevice[$characteristic] === $existingDevice[$characteristic]) {
                    $similarity += $weight;
                }
                $totalWeight += $weight;
            }
        }

        return $totalWeight > 0 ? ($similarity / $totalWeight) : 0.0;
    }
}

if (!function_exists('detectUserPreferences')) {
    /**
     * Detect user preferences from headers
     */
    function detectUserPreferences(array $headers): array {
        $preferences = [
            'language' => 'en-US',
            'timezone' => 'UTC',
            'theme' => 'auto',
        ];

        // Language detection
        if (isset($headers['Accept-Language'])) {
            $langs = explode(',', $headers['Accept-Language']);
            if (!empty($langs)) {
                $preferences['language'] = trim(explode(';', $langs[0])[0]);
            }
        }

        // Timezone detection (if sent by client)
        if (isset($headers['X-Timezone'])) {
            $preferences['timezone'] = $headers['X-Timezone'];
        }

        // Theme preference (if sent by client)
        if (isset($headers['X-Theme-Preference'])) {
            $preferences['theme'] = $headers['X-Theme-Preference'];
        }

        return $preferences;
    }
}

if (!function_exists('generateSessionDataWithDatabase')) {
    /**
     * Generate comprehensive session data with enhanced detection and database storage
     */
    function generateSessionDataWithDatabase($request, int $userId = null): array {
        $userAgent = $request->header('User-Agent') ?? '';
        $ip = $request->ip() ?? '127.0.0.1';
        $headers = $request->headers->all();

        // Enhanced device detection
        $deviceInfo = enhancedDeviceDetection($userAgent, $ip);

        // Graphics capabilities detection
        $graphics = detectGraphicsCapabilities($headers, $userAgent);

        // Device fingerprinting
        $fingerprint = generateDeviceFingerprint($deviceInfo, $headers);

        // Generate unique device ID
        $deviceId = generateUniqueDeviceId($deviceInfo, $graphics, $fingerprint);

        // User preferences
        $preferences = detectUserPreferences($headers);

        // Session token
        $sessionToken = 'session_' . uniqid() . '_' . time();

        // Combine all device characteristics for storage
        $deviceCharacteristics = array_merge($deviceInfo, $graphics, $fingerprint);

        // Add location information
        $location = getLocationFromIP($ip);
        $deviceCharacteristics['location'] = $location;

        // Add raw headers for forensic analysis
        $deviceCharacteristics['raw_headers'] = $headers;

        // Ensure user_agent is included
        $deviceCharacteristics['user_agent'] = $userAgent;

        $sessionData = [
            'session_token' => $sessionToken,
            'device_id' => $deviceId,
            'device_characteristics' => $deviceCharacteristics,
            'ip_address' => $ip,
            'user_preferences' => $preferences,
            'logged_in_at' => now(),
            'last_activity_at' => now(),
            'status' => 'online',
            'is_active' => true,
            'raw_headers' => $headers,

            // Legacy fields for backward compatibility
            'device_type' => $deviceInfo['device_type'],
            'browser' => $deviceInfo['browser'],
            'browser_version' => $deviceInfo['browser_version'] ?? null,
            'operating_system' => $deviceInfo['operating_system'],
            'os_version' => $deviceInfo['os_version'] ?? null,
            'device_name' => $deviceInfo['device_name'],
            'location' => $deviceInfo['location'],
            'user_agent' => $userAgent,
        ];

        // If user ID is provided, handle device management
        if ($userId) {
            $deviceResult = handleDeviceManagement($userId, $deviceId, $sessionData);
            $sessionData['device_management'] = $deviceResult;

            // Update the device ID in session data if it changed due to conflicts
            if (isset($deviceResult['device_id']) && $deviceResult['device_id'] !== $deviceId) {
                $sessionData['device_id'] = $deviceResult['device_id'];
            }
        }

        return $sessionData;
    }
}

if (!function_exists('handleDeviceManagement')) {
    /**
     * Handle device management - find existing device or create new one
     */
    function handleDeviceManagement(int $userId, string $deviceId, array $sessionData): array {
        // Check if device already exists for this user
        $existingDevice = \Illuminate\Support\Facades\DB::table('user_devices')
            ->where('user_id', $userId)
            ->where('device_id', $deviceId)
            ->first();

        if ($existingDevice) {
            // Device exists - update activity
            \Illuminate\Support\Facades\DB::table('user_devices')
                ->where('id', $existingDevice->id)
                ->update([
                    'last_seen' => now(),
                    'session_count' => $existingDevice->session_count + 1,
                    'updated_at' => now(),
                ]);

            // Check for characteristic changes and create fingerprint record
            $characteristics = json_decode($existingDevice->characteristics, true);
            $newCharacteristics = $sessionData['device_characteristics'];

            $similarity = compareDeviceCharacteristics($newCharacteristics, $characteristics);

            // Create new fingerprint record
            createDeviceFingerprintRecord($userId, $deviceId, $sessionData);

            // Check for suspicious changes
            if ($similarity < 0.85) {
                createDeviceSecurityEvent($userId, $deviceId, 'suspicious_change', [
                    'similarity_score' => $similarity,
                    'changes' => identifyCharacteristicChanges($characteristics, $newCharacteristics),
                ]);
            }

            return [
                'device_id' => $deviceId,
                'is_new_device' => false,
                'existing_device' => $existingDevice,
                'similarity_score' => $similarity,
            ];
        }

        // Check if device ID exists for any other user (global device ID check)
        $deviceExistsForOtherUser = \Illuminate\Support\Facades\DB::table('user_devices')
            ->where('device_id', $deviceId)
            ->where('user_id', '!=', $userId)
            ->exists();

        if ($deviceExistsForOtherUser) {
            // Device ID exists for another user - need to generate a unique device ID
            $originalDeviceId = $deviceId;
            $deviceId = generateUniqueDeviceId($sessionData['device_characteristics'], [], []);
            $counter = 1;

            // Keep trying until we get a unique device ID
            while (\Illuminate\Support\Facades\DB::table('user_devices')->where('device_id', $deviceId)->exists()) {
                $deviceId = generateUniqueDeviceId($sessionData['device_characteristics'], [], []) . '_' . $counter;
                $counter++;

                // Prevent infinite loops
                if ($counter > 100) {
                    $deviceId = 'device_' . uniqid() . '_' . time();
                    break;
                }
            }

            // Create security event about device ID conflict
            createDeviceSecurityEvent($userId, $deviceId, 'device_id_conflict', [
                'original_device_id' => $originalDeviceId,
                'new_device_id' => $deviceId,
                'conflict_type' => 'cross_user_conflict',
            ]);
        }

        // Check for similar devices (same user, high similarity)
        $existingDevices = \Illuminate\Support\Facades\DB::table('user_devices')
            ->where('user_id', $userId)
            ->get();

        $bestMatch = null;
        $highestSimilarity = 0.0;
        $similarityThreshold = 0.85;

        foreach ($existingDevices as $device) {
            $characteristics = json_decode($device->characteristics, true);
            $similarity = compareDeviceCharacteristics(
                $sessionData['device_characteristics'],
                $characteristics
            );

            if ($similarity > $highestSimilarity) {
                $highestSimilarity = $similarity;
                $bestMatch = $device;
            }
        }

        // If highly similar device found, use that device ID instead
        if ($bestMatch && $highestSimilarity >= $similarityThreshold) {
            // Update the existing device
            \Illuminate\Support\Facades\DB::table('user_devices')
                ->where('id', $bestMatch->id)
                ->update([
                    'last_seen' => now(),
                    'session_count' => $bestMatch->session_count + 1,
                    'updated_at' => now(),
                ]);

            // Create fingerprint record for the existing device
            createDeviceFingerprintRecord($userId, $bestMatch->device_id, $sessionData);

            return [
                'device_id' => $bestMatch->device_id,
                'is_new_device' => false,
                'existing_device' => $bestMatch,
                'similarity_score' => $highestSimilarity,
                'merged_from' => $deviceId,
            ];
        }

        // Create new device
        $deviceRecord = createNewDeviceRecord($userId, $deviceId, $sessionData);

        // Get the actual device ID (might have changed due to conflicts)
        $actualDeviceId = $deviceRecord['device_id'];

        // Create security event for new device
        createDeviceSecurityEvent($userId, $actualDeviceId, 'new_device', [
            'device_name' => $sessionData['device_characteristics']['device_name'],
            'device_type' => $sessionData['device_characteristics']['device_type'],
            'risk_score' => $deviceRecord['risk_score'],
        ]);

        return [
            'device_id' => $actualDeviceId,
            'is_new_device' => true,
            'existing_device' => null,
            'similarity_score' => 0.0,
            'device_record' => $deviceRecord,
        ];
    }
}

if (!function_exists('createNewDeviceRecord')) {
    /**
     * Create a new device record in the database
     */
    function createNewDeviceRecord(int $userId, string $deviceId, array $sessionData): array {
        $characteristics = $sessionData['device_characteristics'];
        $riskScore = calculateDeviceRiskScore($characteristics);

        $deviceRecord = [
            'user_id' => $userId,
            'device_id' => $deviceId,
            'device_name' => $characteristics['device_name'] ?? 'Unknown Device',
            'characteristics' => json_encode($characteristics),
            'first_seen' => now(),
            'last_seen' => now(),
            'session_count' => 1,
            'locations' => json_encode([$characteristics['location'] ?? 'Unknown']),
            'is_trusted' => false,
            'risk_score' => $riskScore,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        // Check if device already exists before attempting insert (better approach)
        $existingDevice = \Illuminate\Support\Facades\DB::table('user_devices')
            ->where('device_id', $deviceId)
            ->first();

        if ($existingDevice) {
            if ($existingDevice->user_id == $userId) {
                // Same user, same device - update the existing record
                \Illuminate\Support\Facades\DB::table('user_devices')
                    ->where('device_id', $deviceId)
                    ->update([
                        'last_seen' => now(),
                        'session_count' => $existingDevice->session_count + 1,
                        'updated_at' => now(),
                    ]);

                // Return the existing device data with updated values
                $existingDeviceArray = json_decode(json_encode($existingDevice), true);
                $existingDeviceArray['last_seen'] = now()->toDateTimeString();
                $existingDeviceArray['session_count'] = $existingDevice->session_count + 1;
                $existingDeviceArray['updated_at'] = now()->toDateTimeString();
                return $existingDeviceArray;
            } else {
                // Different user with same device ID - generate a new unique device ID
                $newDeviceId = generateUniqueDeviceId($characteristics, [], []);
                $counter = 1;

                // Keep trying until we get a unique device ID
                while (\Illuminate\Support\Facades\DB::table('user_devices')->where('device_id', $newDeviceId)->exists()) {
                    $newDeviceId = generateUniqueDeviceId($characteristics, [], []) . '_' . $counter;
                    $counter++;

                    // Prevent infinite loops
                    if ($counter > 100) {
                        $newDeviceId = 'device_' . uniqid() . '_' . time();
                        break;
                    }
                }

                // Update the record with the new device ID
                $deviceRecord['device_id'] = $newDeviceId;
            }
        }

        try {
            // Try to insert the device record
            \Illuminate\Support\Facades\DB::table('user_devices')->insert($deviceRecord);
        } catch (\Illuminate\Database\QueryException $e) {
            // Check if this is a duplicate key error (support both MySQL and PostgreSQL)
            $isDuplicateError = false;

            // MySQL: Error code 23000 with "Duplicate entry"
            if ($e->getCode() == 23000 && strpos($e->getMessage(), 'Duplicate entry') !== false) {
                $isDuplicateError = true;
            }

            // PostgreSQL: SQLSTATE 23505 (unique constraint violation)
            if ($e->getCode() == 23505 || strpos($e->getMessage(), 'SQLSTATE[23505]') !== false) {
                $isDuplicateError = true;
            }

            // Also check for unique constraint violation in the message
            if (strpos($e->getMessage(), 'unique constraint') !== false ||
                strpos($e->getMessage(), 'duplicate key value') !== false) {
                $isDuplicateError = true;
            }

            if ($isDuplicateError) {
                // Device ID already exists - check if it belongs to this user
                $existingDevice = \Illuminate\Support\Facades\DB::table('user_devices')
                    ->where('device_id', $deviceId)
                    ->first();

                if ($existingDevice) {
                    if ($existingDevice->user_id == $userId) {
                        // Same user, same device - update the existing record
                        \Illuminate\Support\Facades\DB::table('user_devices')
                            ->where('device_id', $deviceId)
                            ->update([
                                'last_seen' => now(),
                                'session_count' => $existingDevice->session_count + 1,
                                'updated_at' => now(),
                            ]);

                        // Return the existing device data
                        return json_decode(json_encode($existingDevice), true);
                    } else {
                        // Different user with same device ID - generate a new unique device ID
                        $newDeviceId = generateUniqueDeviceId($characteristics, [], []);
                        $counter = 1;

                        // Keep trying until we get a unique device ID
                        while (\Illuminate\Support\Facades\DB::table('user_devices')->where('device_id', $newDeviceId)->exists()) {
                            $newDeviceId = generateUniqueDeviceId($characteristics, [], []) . '_' . $counter;
                            $counter++;

                            // Prevent infinite loops
                            if ($counter > 100) {
                                $newDeviceId = 'device_' . uniqid() . '_' . time();
                                break;
                            }
                        }

                        // Update the record with the new device ID and try again
                        $deviceRecord['device_id'] = $newDeviceId;
                        \Illuminate\Support\Facades\DB::table('user_devices')->insert($deviceRecord);

                        // Update the session data to reflect the new device ID
                        $deviceRecord['device_id'] = $newDeviceId;
                    }
                }
            } else {
                // Re-throw if it's not a duplicate key error
                throw $e;
            }
        }

        // Create initial fingerprint record
        createDeviceFingerprintRecord($userId, $deviceRecord['device_id'], $sessionData);

        return $deviceRecord;
    }
}

if (!function_exists('createDeviceFingerprintRecord')) {
    /**
     * Create a device fingerprint record
     */
    function createDeviceFingerprintRecord(int $userId, string $deviceId, array $sessionData): void {
        $characteristics = $sessionData['device_characteristics'];

        $fingerprintData = [
            'device_id' => $deviceId,
            'user_id' => $userId,
            'device_type' => $characteristics['device_type'] ?? 'desktop',
            'browser' => $characteristics['browser'] ?? 'Unknown',
            'browser_version' => $characteristics['browser_version'] ?? null,
            'operating_system' => $characteristics['operating_system'] ?? 'Unknown',
            'os_version' => $characteristics['os_version'] ?? null,
            'gpu_vendor' => $characteristics['gpu_vendor'] ?? null,
            'gpu_model' => $characteristics['gpu_model'] ?? null,
            'gpu_renderer' => $characteristics['gpu_renderer'] ?? null,
            'webgl_supported' => $characteristics['webgl_supported'] ?? false,
            'webgl_version' => $characteristics['webgl_version'] ?? null,
            'hardware_acceleration' => $characteristics['hardware_acceleration'] ?? null,
            'max_texture_size' => $characteristics['max_texture_size'] ?? null,
            'graphics_memory' => $characteristics['graphics_memory'] ?? null,
            'screen_resolution' => $characteristics['screen_resolution'] ?? null,
            'color_depth' => $characteristics['color_depth'] ?? null,
            'pixel_ratio' => $characteristics['pixel_ratio'] ?? null,
            'cpu_cores' => $characteristics['cpu_cores'] ?? null,
            'memory_gb' => $characteristics['memory_gb'] ?? null,
            'platform_details' => $characteristics['platform_details'] ?? null,
            'touch_support' => $characteristics['touch_support'] ?? false,
            'webrtc_support' => $characteristics['webrtc_support'] ?? false,
            'canvas_fingerprint' => $characteristics['canvas_fingerprint'] ?? null,
            'audio_fingerprint' => $characteristics['audio_fingerprint'] ?? null,
            'timezone_offset' => $characteristics['timezone_offset'] ?? null,
            'timezone' => $sessionData['user_preferences']['timezone'] ?? null,
            'language' => $sessionData['user_preferences']['language'] ?? null,
            'user_agent' => $characteristics['user_agent'] ?? null,
            'raw_headers' => json_encode($sessionData['raw_headers'] ?? []),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        try {
            \Illuminate\Support\Facades\DB::table('device_fingerprints')->insert($fingerprintData);
        } catch (\Exception $e) {
            // Log the error but don't fail the session creation
            \Illuminate\Support\Facades\Log::warning('Failed to create device fingerprint record', [
                'user_id' => $userId,
                'device_id' => $deviceId,
                'error' => $e->getMessage()
            ]);
        }
    }
}

if (!function_exists('createDeviceSecurityEvent')) {
    /**
     * Create a device security event
     */
    function createDeviceSecurityEvent(
        int $userId,
        string $deviceId,
        string $eventType,
        array $eventData = [],
        ?int $sessionId = null
    ): void {
        $severity = 'info';

        // Determine severity based on event type
        switch ($eventType) {
            case 'suspicious_change':
                $similarity = $eventData['similarity_score'] ?? 1.0;
                if ($similarity < 0.5) {
                    $severity = 'critical';
                } elseif ($similarity < 0.8) {
                    $severity = 'warning';
                }
                break;
            case 'new_device':
                $riskScore = $eventData['risk_score'] ?? 0.0;
                if ($riskScore > 0.7) {
                    $severity = 'critical';
                } elseif ($riskScore > 0.4) {
                    $severity = 'warning';
                }
                break;
            case 'high_risk_login':
                $severity = 'critical';
                break;
            case 'location_change':
                $severity = 'warning';
                break;
        }

        $securityEvent = [
            'user_id' => $userId,
            'device_id' => $deviceId,
            'session_id' => $sessionId,
            'event_type' => $eventType,
            'severity' => $severity,
            'event_data' => json_encode($eventData),
            'ip_address' => $eventData['ip_address'] ?? null,
            'location' => $eventData['location'] ?? null,
            'user_notified' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        \Illuminate\Support\Facades\DB::table('device_session_events')->insert($securityEvent);
    }
}

if (!function_exists('calculateDeviceRiskScore')) {
    /**
     * Calculate risk score for a device based on its characteristics
     */
    function calculateDeviceRiskScore(array $characteristics): float {
        $riskFactors = [];

        // Location-based risk
        $location = $characteristics['location'] ?? 'Unknown';
        if ($location === 'Unknown' || $location === 'Private') {
            $riskFactors['location'] = 0.3;
        }

        // Browser/OS combination risk
        $browser = strtolower($characteristics['browser'] ?? '');
        $os = strtolower($characteristics['operating_system'] ?? '');

        // Check for unusual combinations
        if (str_contains($browser, 'tor') || str_contains($browser, 'phantom')) {
            $riskFactors['browser'] = 0.8;
        }

        // Screen resolution risk (very unusual resolutions)
        $resolution = $characteristics['screen_resolution'] ?? '';
        if (!empty($resolution)) {
            preg_match('/(\d+)x(\d+)/', $resolution, $matches);
            if (count($matches) === 3) {
                $width = (int)$matches[1];
                $height = (int)$matches[2];

                // Very small or very large screens might be suspicious
                if ($width < 800 || $height < 600 || $width > 7680 || $height > 4320) {
                    $riskFactors['screen'] = 0.4;
                }
            }
        }

        // Hardware fingerprint risk
        $hasHardwareInfo = !empty($characteristics['gpu_vendor'] ?? '');
        if (!$hasHardwareInfo) {
            $riskFactors['hardware'] = 0.2;
        }

        // Missing fingerprints risk
        $hasCanvasFingerprint = !empty($characteristics['canvas_fingerprint'] ?? '');
        $hasAudioFingerprint = !empty($characteristics['audio_fingerprint'] ?? '');

        if (!$hasCanvasFingerprint || !$hasAudioFingerprint) {
            $riskFactors['fingerprint'] = 0.3;
        }

        // Calculate weighted average
        $totalRisk = array_sum($riskFactors);
        $maxRisk = count($riskFactors) * 1.0;

        return $maxRisk > 0 ? min(1.0, $totalRisk / $maxRisk) : 0.0;
    }
}

if (!function_exists('identifyCharacteristicChanges')) {
    /**
     * Identify specific changes between device characteristics
     */
    function identifyCharacteristicChanges(array $oldCharacteristics, array $newCharacteristics): array {
        $changes = [];
        $importantFields = [
            'location', 'browser', 'browser_version', 'operating_system', 'os_version',
            'screen_resolution', 'gpu_vendor', 'gpu_model', 'timezone_offset',
            'hardware_acceleration', 'webgl_version'
        ];

        foreach ($importantFields as $field) {
            $oldValue = $oldCharacteristics[$field] ?? null;
            $newValue = $newCharacteristics[$field] ?? null;

            if ($oldValue !== $newValue) {
                $changes[$field] = [
                    'old' => $oldValue,
                    'new' => $newValue,
                ];
            }
        }

        return $changes;
    }
}

if (!function_exists('findOrCreateDevice')) {
    /**
     * Find existing device or create new one based on device characteristics
     */
    function findOrCreateDevice(array $sessionData, $existingDevices = []): array {
        $deviceId = $sessionData['device_id'];
        $newCharacteristics = $sessionData['device_characteristics'];

        // Check if we already have this exact device ID
        if (isset($existingDevices[$deviceId])) {
            return [
                'device_id' => $deviceId,
                'is_new_device' => false,
                'existing_device' => $existingDevices[$deviceId],
                'similarity_score' => 1.0,
            ];
        }

        // Compare with existing devices to find potential matches
        $bestMatch = null;
        $highestSimilarity = 0.0;
        $similarityThreshold = 0.85; // 85% similarity threshold

        foreach ($existingDevices as $existingDeviceId => $existingDevice) {
            $similarity = compareDeviceCharacteristics(
                $newCharacteristics,
                $existingDevice['characteristics'] ?? []
            );

            if ($similarity > $highestSimilarity) {
                $highestSimilarity = $similarity;
                $bestMatch = [
                    'device_id' => $existingDeviceId,
                    'device_data' => $existingDevice,
                ];
            }
        }

        // If we found a highly similar device, consider it the same device
        if ($bestMatch && $highestSimilarity >= $similarityThreshold) {
            return [
                'device_id' => $bestMatch['device_id'],
                'is_new_device' => false,
                'existing_device' => $bestMatch['device_data'],
                'similarity_score' => $highestSimilarity,
                'merged_from' => $deviceId, // Original device ID for reference
            ];
        }

        // Create new device
        return [
            'device_id' => $deviceId,
            'is_new_device' => true,
            'existing_device' => null,
            'similarity_score' => 0.0,
        ];
    }
}

if (!function_exists('createDeviceRecord')) {
    /**
     * Create a comprehensive device record for storage
     */
    function createDeviceRecord(array $sessionData): array {
        $characteristics = $sessionData['device_characteristics'];

        return [
            'device_id' => $sessionData['device_id'],
            'characteristics' => $characteristics,
            'device_name' => generateEnhancedDeviceName(
                $sessionData['user_agent'] ?? '',
                $characteristics['device_type'] ?? 'desktop',
                $characteristics['operating_system'] ?? 'Unknown',
                $characteristics['browser'] ?? 'Unknown'
            ),
            'first_seen' => now(),
            'last_seen' => now(),
            'session_count' => 1,
            'locations' => [$characteristics['location'] ?? 'Unknown'],
            'is_trusted' => false,
            'risk_score' => calculateDeviceRiskScore($characteristics),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

if (!function_exists('calculateDeviceRiskScore')) {
    /**
     * Calculate risk score based on device characteristics
     */
    function calculateDeviceRiskScore(array $characteristics): float {
        $riskFactors = [
            'unknown_location' => ($characteristics['location'] ?? '') === 'Unknown Location' ? 0.2 : 0.0,
            'proxy_detected' => (strpos($characteristics['location'] ?? '', 'Proxy') !== false) ? 0.4 : 0.0,
            'tor_detected' => (strpos($characteristics['location'] ?? '', 'Tor') !== false) ? 0.6 : 0.0,
            'unknown_gpu' => ($characteristics['gpu_vendor'] ?? 'Unknown') === 'Unknown' ? 0.1 : 0.0,
            'webgl_disabled' => !($characteristics['webgl_supported'] ?? false) ? 0.1 : 0.0,
            'unusual_screen' => in_array($characteristics['screen_resolution'] ?? '', ['Unknown', '800x600', '1024x768']) ? 0.1 : 0.0,
        ];

        return min(1.0, array_sum($riskFactors));
    }
}
