<?php

namespace App\Models;

use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SessionService
{
    /**
     * Create a new session for user login
     */
    public function createLoginSession(User $user, Request $request): UserSession
    {
        $sessionData = $this->extractSessionData($request);
        
        // Deactivate any existing sessions for this device/browser combination
        $this->deactivateExistingSessions($user->id, $sessionData);
        
        $session = UserSession::createSession($user->id, $sessionData);
        
        Log::info('User session created', [
            'user_id' => $user->id,
            'session_id' => $session->id,
            'ip_address' => $sessionData['ip_address'],
        ]);
        
        return $session;
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
            
            Log::info('User session ended', [
                'user_id' => $session->user_id,
                'session_id' => $session->id,
                'duration' => $session->session_duration,
            ]);
        }
    }

    /**
     * Handle user going offline/away
     */
    public function markUserAway(string $sessionToken): void
    {
        $session = UserSession::where('session_token', $sessionToken)
            ->where('is_active', true)
            ->first();
            
        if ($session) {
            $session->markAway();
        }
    }

    /**
     * Mark user as back online
     */
    public function markUserOnline(string $sessionToken): void
    {
        $session = UserSession::where('session_token', $sessionToken)
            ->where('is_active', true)
            ->first();
            
        if ($session) {
            $session->updateActivity();
        }
    }

    /**
     * Get session by token
     */
    public function getSessionByToken(string $sessionToken): ?UserSession
    {
        return UserSession::where('session_token', $sessionToken)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get all active sessions for a user
     */
    public function getUserActiveSessions(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return UserSession::getActiveSessions($userId);
    }

    /**
     * Terminate all sessions for a user except current
     */
    public function terminateOtherSessions(int $userId, string $currentSessionToken): int
    {
        $sessions = UserSession::where('user_id', $userId)
            ->where('session_token', '!=', $currentSessionToken)
            ->where('is_active', true)
            ->get();
            
        foreach ($sessions as $session) {
            $session->deactivate();
        }
        
        return $sessions->count();
    }

    /**
     * Clean up expired sessions
     */
    public function cleanupExpiredSessions(int $expiryMinutes = 60): int
    {
        return UserSession::cleanupExpiredSessions($expiryMinutes);
    }

    /**
     * Get session statistics for a user
     */
    public function getUserSessionStatistics(int $userId): array
    {
        return UserSession::getUserSessionStats($userId);
    }

    /**
     * Extract session data from request
     */
    private function extractSessionData(Request $request): array
    {
        $userAgent = $request->userAgent();
        
        return [
            'ip_address' => $request->ip(),
            'user_agent' => $userAgent,
            'device_type' => $this->detectDeviceType($userAgent),
            'browser' => $this->detectBrowser($userAgent),
            'operating_system' => $this->detectOperatingSystem($userAgent),
            'device_name' => $request->header('X-Device-Name'),
        ];
    }

    /**
     * Detect device type from user agent
     */
    private function detectDeviceType(string $userAgent): string
    {
        $userAgent = strtolower($userAgent);
        
        if (strpos($userAgent, 'mobile') !== false || strpos($userAgent, 'android') !== false || strpos($userAgent, 'iphone') !== false) {
            return 'mobile';
        } elseif (strpos($userAgent, 'tablet') !== false || strpos($userAgent, 'ipad') !== false) {
            return 'tablet';
        }
        
        return 'desktop';
    }

    /**
     * Detect browser from user agent
     */
    private function detectBrowser(string $userAgent): string
    {
        $userAgent = strtolower($userAgent);
        
        if (strpos($userAgent, 'chrome') !== false) {
            return 'Chrome';
        } elseif (strpos($userAgent, 'firefox') !== false) {
            return 'Firefox';
        } elseif (strpos($userAgent, 'safari') !== false) {
            return 'Safari';
        } elseif (strpos($userAgent, 'edge') !== false) {
            return 'Edge';
        } elseif (strpos($userAgent, 'opera') !== false) {
            return 'Opera';
        }
        
        return 'Unknown';
    }

    /**
     * Detect operating system from user agent
     */
    private function detectOperatingSystem(string $userAgent): string
    {
        $userAgent = strtolower($userAgent);
        
        if (strpos($userAgent, 'windows') !== false) {
            return 'Windows';
        } elseif (strpos($userAgent, 'macintosh') !== false || strpos($userAgent, 'mac os') !== false) {
            return 'macOS';
        } elseif (strpos($userAgent, 'linux') !== false) {
            return 'Linux';
        } elseif (strpos($userAgent, 'android') !== false) {
            return 'Android';
        } elseif (strpos($userAgent, 'iphone') !== false || strpos($userAgent, 'ipad') !== false) {
            return 'iOS';
        }
        
        return 'Unknown';
    }

    /**
     * Deactivate existing sessions for the same device/browser
     */
    private function deactivateExistingSessions(int $userId, array $sessionData): void
    {
        $existingSessions = UserSession::where('user_id', $userId)
            ->where('is_active', true)
            ->where('ip_address', $sessionData['ip_address'])
            ->where('user_agent', $sessionData['user_agent'])
            ->get();
            
        foreach ($existingSessions as $session) {
            $session->deactivate();
        }
    }
}
