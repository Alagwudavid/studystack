<?php

namespace App\Services;

use App\Models\UserSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SessionService
{
    /**
     * Create a new login session for a user
     */
    public function createLoginSession(User $user, Request $request): UserSession
    {
        // Extract device information
        $userAgent = $request->userAgent() ?? '';
        $deviceInfo = $this->parseUserAgent($userAgent);

        return UserSession::createSession($user->id, [
            'device_type' => $deviceInfo['device_type'],
            'device_name' => $deviceInfo['device_name'],
            'browser' => $deviceInfo['browser'],
            'operating_system' => $deviceInfo['operating_system'],
            'ip_address' => $request->ip(),
            'user_agent' => $userAgent,
            'location_data' => $this->getLocationData($request->ip()),
        ]);
    }

    /**
     * Update session activity
     */
    public function updateSessionActivity(string $sessionToken): void
    {
        $session = UserSession::where('session_token', $sessionToken)
            ->where('is_active', true)
            ->first();

        if ($session) {
            $session->updateActivity();
        }
    }

    /**
     * Handle user logout
     */
    public function handleLogout(string $sessionToken): void
    {
        $session = UserSession::where('session_token', $sessionToken)
            ->where('is_active', true)
            ->first();

        if ($session) {
            $session->markOffline();
        }
    }

    /**
     * Update session status
     */
    public function updateSessionStatus(string $sessionToken, string $status): void
    {
        $session = UserSession::where('session_token', $sessionToken)
            ->where('is_active', true)
            ->first();

        if ($session) {
            if ($status === 'online') {
                $session->updateActivity();
            } elseif ($status === 'away') {
                $session->markAway();
            } elseif ($status === 'offline') {
                $session->markOffline();
            }
        }
    }

    /**
     * Terminate a specific session
     */
    public function terminateSession(int $sessionId, int $userId): bool
    {
        $session = UserSession::where('id', $sessionId)
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->first();

        if ($session) {
            $session->deactivate();
            return true;
        }

        return false;
    }

    /**
     * Terminate all other sessions except current
     */
    public function terminateOtherSessions(int $userId, string $currentSessionToken): int
    {
        $otherSessions = UserSession::where('user_id', $userId)
            ->where('session_token', '!=', $currentSessionToken)
            ->where('is_active', true)
            ->get();

        foreach ($otherSessions as $session) {
            $session->deactivate();
        }

        return $otherSessions->count();
    }

    /**
     * Clean up expired sessions
     */
    public function cleanupExpiredSessions(int $expiryMinutes = 60): int
    {
        return UserSession::cleanupExpiredSessions($expiryMinutes);
    }

    /**
     * Parse user agent string to extract device information
     */
    private function parseUserAgent(string $userAgent): array
    {
        $deviceType = 'desktop';
        $deviceName = null;
        $browser = 'Unknown';
        $operatingSystem = 'Unknown';

        // Detect mobile devices
        if (preg_match('/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile/', $userAgent)) {
            if (preg_match('/iPad/', $userAgent)) {
                $deviceType = 'tablet';
                $deviceName = 'iPad';
                $operatingSystem = 'iOS';
            } elseif (preg_match('/iPhone|iPod/', $userAgent)) {
                $deviceType = 'mobile';
                $deviceName = 'iPhone';
                $operatingSystem = 'iOS';
            } elseif (preg_match('/Android/', $userAgent)) {
                $deviceType = preg_match('/Mobile/', $userAgent) ? 'mobile' : 'tablet';
                $operatingSystem = 'Android';
            }
        }

        // Detect browser
        if (preg_match('/Chrome\/([0-9.]+)/', $userAgent, $matches)) {
            $browser = 'Chrome';
        } elseif (preg_match('/Firefox\/([0-9.]+)/', $userAgent, $matches)) {
            $browser = 'Firefox';
        } elseif (preg_match('/Safari\/([0-9.]+)/', $userAgent, $matches)) {
            $browser = 'Safari';
        } elseif (preg_match('/Edge\/([0-9.]+)/', $userAgent, $matches)) {
            $browser = 'Edge';
        }

        // Detect operating system
        if (preg_match('/Windows NT ([0-9.]+)/', $userAgent, $matches)) {
            $operatingSystem = 'Windows';
        } elseif (preg_match('/Mac OS X ([0-9_.]+)/', $userAgent, $matches)) {
            $operatingSystem = 'macOS';
        } elseif (preg_match('/Linux/', $userAgent)) {
            $operatingSystem = 'Linux';
        }

        return [
            'device_type' => $deviceType,
            'device_name' => $deviceName,
            'browser' => $browser,
            'operating_system' => $operatingSystem,
        ];
    }

    /**
     * Get location data from IP address
     */
    private function getLocationData(string $ipAddress): ?array
    {
        // Skip for local/private IPs
        if (filter_var($ipAddress, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return null;
        }

        // This would typically use a geolocation service
        // For now, return null to avoid external dependencies
        return null;
    }
}
