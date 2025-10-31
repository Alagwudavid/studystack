<?php

require_once 'EnhancedDeviceDetection.php';

/**
 * Database-integrated device session manager
 * Handles session creation, device management, and security monitoring
 */
class DatabaseDeviceSessionManager
{
    /**
     * Create a new session with device fingerprinting and database storage
     */
    public static function createSession($request, int $userId): array
    {
        // Generate session data with database integration
        $sessionData = generateSessionDataWithDatabase($request, $userId);

        // Create the user session record with enhanced data
        $sessionRecord = [
            'user_id' => $userId,
            'device_id' => $sessionData['device_id'],
            'session_token' => $sessionData['session_token'],
            'device_name' => $sessionData['device_characteristics']['device_name'] ?? 'Unknown Device',
            'ip_address' => $sessionData['ip_address'],
            'location' => $sessionData['device_characteristics']['location'] ?? 'Unknown',
            'device_type' => $sessionData['device_characteristics']['device_type'],
            'browser' => $sessionData['device_characteristics']['browser'],
            'browser_version' => $sessionData['device_characteristics']['browser_version'] ?? null,
            'operating_system' => $sessionData['device_characteristics']['operating_system'],
            'os_version' => $sessionData['device_characteristics']['os_version'] ?? null,
            'user_agent' => $sessionData['user_agent'] ?? $sessionData['device_characteristics']['user_agent'] ?? null,
            'user_preferences' => json_encode($sessionData['user_preferences'] ?? []),
            'created_at' => now(),
            'updated_at' => now(),
            'last_activity_at' => now(),
        ];

        $sessionId = \Illuminate\Support\Facades\DB::table('user_sessions')
            ->insertGetId($sessionRecord);

        // Create session event
        createDeviceSecurityEvent(
            $userId,
            $sessionData['device_id'],
            'session_created',
            [
                'ip_address' => $sessionData['ip_address'],
                'location' => $sessionData['device_characteristics']['location'] ?? 'Unknown',
                'device_name' => $sessionData['device_characteristics']['device_name'],
                'is_new_device' => $sessionData['device_management']['is_new_device'] ?? false,
            ],
            $sessionId
        );

        return [
            'session_id' => $sessionId,
            'session_data' => $sessionData,
            'session_record' => $sessionRecord,
            'device_management' => $sessionData['device_management'] ?? null,
        ];
    }

    /**
     * Get grouped sessions by device for a user
     */
    public static function getGroupedSessions(int $userId): array
    {
        // Get user devices with session counts
        $devices = \Illuminate\Support\Facades\DB::table('user_devices')
            ->where('user_id', $userId)
            ->orderBy('last_seen', 'desc')
            ->get();

        $groupedSessions = [];

        foreach ($devices as $device) {
            // Get sessions for this device
            $sessions = \Illuminate\Support\Facades\DB::table('user_sessions')
                ->where('user_id', $userId)
                ->where('device_id', $device->device_id)
                ->orderBy('created_at', 'desc')
                ->get();

            // Get latest fingerprint for this device
            $latestFingerprint = \Illuminate\Support\Facades\DB::table('device_fingerprints')
                ->where('device_id', $device->device_id)
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->first();

            $groupedSessions[] = [
                'device' => [
                    'device_id' => $device->device_id,
                    'device_name' => $device->device_name,
                    'characteristics' => json_decode($device->characteristics, true),
                    'first_seen' => $device->first_seen,
                    'last_seen' => $device->last_seen,
                    'session_count' => $device->session_count,
                    'locations' => json_decode($device->locations, true),
                    'is_trusted' => $device->is_trusted,
                    'risk_score' => $device->risk_score,
                ],
                'sessions' => $sessions,
                'latest_fingerprint' => $latestFingerprint,
                'security_events' => self::getDeviceSecurityEvents($userId, $device->device_id),
            ];
        }

        return $groupedSessions;
    }

    /**
     * Get security events for a device
     */
    public static function getDeviceSecurityEvents(int $userId, string $deviceId, int $limit = 10): array
    {
        return \Illuminate\Support\Facades\DB::table('device_session_events')
            ->where('user_id', $userId)
            ->where('device_id', $deviceId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Terminate a specific session
     */
    public static function terminateSession(int $userId, int $sessionId): bool
    {
        // Get session details before termination
        $session = \Illuminate\Support\Facades\DB::table('user_sessions')
            ->where('id', $sessionId)
            ->where('user_id', $userId)
            ->first();

        if (!$session) {
            return false;
        }

        // Mark session as terminated
        $updated = \Illuminate\Support\Facades\DB::table('user_sessions')
            ->where('id', $sessionId)
            ->where('user_id', $userId)
            ->update([
                'updated_at' => now(),
                'terminated_at' => now(),
            ]);

        if ($updated) {
            // Create termination event
            createDeviceSecurityEvent(
                $userId,
                $session->device_id,
                'session_terminated',
                [
                    'session_id' => $sessionId,
                    'termination_method' => 'user_action',
                    'session_duration' => now()->diffInMinutes($session->created_at),
                ],
                $sessionId
            );
        }

        return $updated > 0;
    }

    /**
     * Terminate all sessions for a device
     */
    public static function terminateDeviceSessions(int $userId, string $deviceId): int
    {
        // Get all active sessions for the device
        $sessions = \Illuminate\Support\Facades\DB::table('user_sessions')
            ->where('user_id', $userId)
            ->where('device_id', $deviceId)
            ->whereNull('terminated_at')
            ->get();

        $terminatedCount = 0;

        foreach ($sessions as $session) {
            if (self::terminateSession($userId, $session->id)) {
                $terminatedCount++;
            }
        }

        return $terminatedCount;
    }

    /**
     * Trust a device
     */
    public static function trustDevice(int $userId, string $deviceId): bool
    {
        $updated = \Illuminate\Support\Facades\DB::table('user_devices')
            ->where('user_id', $userId)
            ->where('device_id', $deviceId)
            ->update([
                'is_trusted' => true,
                'updated_at' => now(),
            ]);

        if ($updated) {
            createDeviceSecurityEvent(
                $userId,
                $deviceId,
                'device_trusted',
                [
                    'action' => 'device_trusted_by_user',
                    'timestamp' => now(),
                ]
            );
        }

        return $updated > 0;
    }

    /**
     * Untrust a device
     */
    public static function untrustDevice(int $userId, string $deviceId): bool
    {
        $updated = \Illuminate\Support\Facades\DB::table('user_devices')
            ->where('user_id', $userId)
            ->where('device_id', $deviceId)
            ->update([
                'is_trusted' => false,
                'updated_at' => now(),
            ]);

        if ($updated) {
            createDeviceSecurityEvent(
                $userId,
                $deviceId,
                'device_untrusted',
                [
                    'action' => 'device_untrusted_by_user',
                    'timestamp' => now(),
                ]
            );
        }

        return $updated > 0;
    }

    /**
     * Get device analytics for a user
     */
    public static function getDeviceAnalytics(int $userId): array
    {
        $devices = \Illuminate\Support\Facades\DB::table('user_devices')
            ->where('user_id', $userId)
            ->get();

        $totalSessions = \Illuminate\Support\Facades\DB::table('user_sessions')
            ->where('user_id', $userId)
            ->count();

        $activeSessions = \Illuminate\Support\Facades\DB::table('user_sessions')
            ->where('user_id', $userId)
            ->whereNull('terminated_at')
            ->count();

        $securityEvents = \Illuminate\Support\Facades\DB::table('device_session_events')
            ->where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('severity, COUNT(*) as count')
            ->groupBy('severity')
            ->get()
            ->pluck('count', 'severity')
            ->toArray();

        $deviceTypes = $devices->groupBy(function ($device) {
            $characteristics = json_decode($device->characteristics, true);
            return $characteristics['device_type'] ?? 'unknown';
        })->map->count();

        $operatingSystems = $devices->groupBy(function ($device) {
            $characteristics = json_decode($device->characteristics, true);
            return $characteristics['operating_system'] ?? 'unknown';
        })->map->count();

        return [
            'total_devices' => $devices->count(),
            'trusted_devices' => $devices->where('is_trusted', true)->count(),
            'total_sessions' => $totalSessions,
            'active_sessions' => $activeSessions,
            'security_events' => $securityEvents,
            'device_types' => $deviceTypes,
            'operating_systems' => $operatingSystems,
            'average_risk_score' => round($devices->avg('risk_score'), 2),
            'high_risk_devices' => $devices->where('risk_score', '>', 0.7)->count(),
        ];
    }

    /**
     * Check for suspicious activity
     */
    public static function checkSuspiciousActivity(int $userId, int $days = 7): array
    {
        $suspiciousEvents = \Illuminate\Support\Facades\DB::table('device_session_events')
            ->where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays($days))
            ->whereIn('severity', ['warning', 'critical'])
            ->orderBy('created_at', 'desc')
            ->get();

        $recentNewDevices = \Illuminate\Support\Facades\DB::table('user_devices')
            ->where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays($days))
            ->where('risk_score', '>', 0.5)
            ->get();

        $locationChanges = \Illuminate\Support\Facades\DB::table('device_session_events')
            ->where('user_id', $userId)
            ->where('event_type', 'location_change')
            ->where('created_at', '>=', now()->subDays($days))
            ->get();

        return [
            'suspicious_events' => $suspiciousEvents,
            'new_high_risk_devices' => $recentNewDevices,
            'location_changes' => $locationChanges,
            'total_alerts' => $suspiciousEvents->count() + $recentNewDevices->count() + $locationChanges->count(),
        ];
    }
}