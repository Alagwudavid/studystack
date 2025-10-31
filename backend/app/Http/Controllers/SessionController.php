<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\UserSession;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Carbon\Carbon;

class SessionController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function __construct()
    {
        // Session management logic will be embedded directly in methods
    }

    /**
     * Create a new session for user login
     */
    private function createLoginSession(User $user, Request $request): UserSession
    {
        $sessionData = $this->extractSessionData($request);
        
        // Deactivate any existing sessions for this device/browser combination
        $this->deactivateExistingSessions($user->id, $sessionData);
        
        // Create new session
        $session = UserSession::create([
            'user_id' => $user->id,
            'session_token' => bin2hex(random_bytes(32)),
            'device_type' => $sessionData['device_type'],
            'device_name' => $sessionData['device_name'],
            'browser' => $sessionData['browser'],
            'operating_system' => $sessionData['operating_system'],
            'ip_address' => $request->ip(),
            'status' => 'online',
            'is_active' => true,
            'logged_in_at' => now(),
            'last_activity_at' => now(),
        ]);

        return $session;
    }

    /**
     * Extract session data from request
     */
    private function extractSessionData(Request $request): array
    {
        $userAgent = $request->userAgent();
        
        return [
            'device_type' => $this->detectDeviceType($userAgent),
            'device_name' => $this->extractDeviceName($userAgent),
            'browser' => $this->extractBrowser($userAgent),
            'operating_system' => $this->extractOperatingSystem($userAgent),
        ];
    }

    /**
     * Detect device type from user agent
     */
    private function detectDeviceType(string $userAgent): string
    {
        if (preg_match('/Mobile|Android|iPhone|iPad/', $userAgent)) {
            return 'mobile';
        } elseif (preg_match('/Tablet|iPad/', $userAgent)) {
            return 'tablet';
        }
        return 'desktop';
    }

    /**
     * Extract device name from user agent
     */
    private function extractDeviceName(string $userAgent): string
    {
        if (preg_match('/iPhone/', $userAgent)) {
            return 'iPhone';
        } elseif (preg_match('/iPad/', $userAgent)) {
            return 'iPad';
        } elseif (preg_match('/Android/', $userAgent)) {
            return 'Android Device';
        } elseif (preg_match('/Windows/', $userAgent)) {
            return 'Windows PC';
        } elseif (preg_match('/Macintosh/', $userAgent)) {
            return 'Mac';
        }
        return 'Unknown Device';
    }

    /**
     * Extract browser from user agent
     */
    private function extractBrowser(string $userAgent): string
    {
        if (preg_match('/Chrome/', $userAgent)) {
            return 'Chrome';
        } elseif (preg_match('/Firefox/', $userAgent)) {
            return 'Firefox';
        } elseif (preg_match('/Safari/', $userAgent)) {
            return 'Safari';
        } elseif (preg_match('/Edge/', $userAgent)) {
            return 'Edge';
        }
        return 'Unknown Browser';
    }

    /**
     * Extract operating system from user agent
     */
    private function extractOperatingSystem(string $userAgent): string
    {
        if (preg_match('/Windows NT 10/', $userAgent)) {
            return 'Windows 10';
        } elseif (preg_match('/Windows NT/', $userAgent)) {
            return 'Windows';
        } elseif (preg_match('/Mac OS X/', $userAgent)) {
            return 'macOS';
        } elseif (preg_match('/Android/', $userAgent)) {
            return 'Android';
        } elseif (preg_match('/iPhone OS/', $userAgent)) {
            return 'iOS';
        }
        return 'Unknown OS';
    }

    /**
     * Deactivate existing sessions for same device/browser
     */
    private function deactivateExistingSessions(int $userId, array $sessionData): void
    {
        UserSession::where('user_id', $userId)
            ->where('device_type', $sessionData['device_type'])
            ->where('browser', $sessionData['browser'])
            ->where('is_active', true)
            ->update([
                'is_active' => false,
                'logged_out_at' => now(),
            ]);
    }

    /**
     * Get current user's active sessions
     */
    public function getActiveSessions(): JsonResponse
    {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $sessions = UserSession::getActiveSessions($payload['user_id']);
        
        return response()->json([
            'success' => true,
            'data' => [
                'sessions' => $sessions->map(function ($session) use ($payload) {
                    return [
                        'id' => $session->id,
                        'device_type' => $session->device_type,
                        'device_name' => $session->device_name,
                        'browser' => $session->browser,
                        'operating_system' => $session->operating_system,
                        'ip_address' => $session->ip_address,
                        'status' => $session->status,
                        'last_activity_at' => $session->last_activity_at,
                        'logged_in_at' => $session->logged_in_at,
                        'is_current' => isset($payload['session_token']) && $session->session_token === $payload['session_token'],
                    ];
                }),
                'total_count' => $sessions->count(),
            ]
        ]);
    }

    /**
     * Get session statistics for current user
     */
    public function getSessionStatistics(): JsonResponse
    {
        // JWT Authentication
        $request = request();
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $stats = UserSession::getUserSessionStats($payload['user_id']);
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Update session status (online/away)
     */
    public function updateStatus(Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:online,away'
        ]);

            // JWT Authentication
            $authHeader = $request->header('Authorization');
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authorization header missing',
                ], 401);
            }

            $token = substr($authHeader, 7);
            $payload = validateJWTToken($token);

            if (!$payload || !isset($payload['session_token'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired token',
                ], 401);
            }

            $session = UserSession::where('session_token', $payload['session_token'])
                ->where('is_active', true)
                ->first();

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session not found'
                ], 404);
            }

            $session->status = $request->input('status');
            $session->save();

            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully'
            ]);
    }

    /**
     * Terminate a specific session
     */
    public function terminateSession(Request $request, $sessionId): JsonResponse
    {
        // JWT Authentication
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization header missing',
            ], 401);
        }

        $token = substr($authHeader, 7);
        $payload = validateJWTToken($token);

        if (!$payload) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token',
            ], 401);
        }

        $session = UserSession::where('id', $sessionId)
            ->where('user_id', $payload['user_id'])
            ->where('is_active', true)
            ->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }

        $session->deactivate();

        return response()->json([
            'success' => true,
            'message' => 'Session terminated successfully'
        ]);
    }

    /**
     * Terminate all other sessions except current
     */
    public function terminateOtherSessions(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $currentSessionToken = $request->bearerToken();
        
        if (!$currentSessionToken) {
            return response()->json([
                'success' => false,
                'message' => 'Current session token required'
            ], 400);
        }

        $sessions = UserSession::where('user_id', $user->id)
            ->where('session_token', '!=', $currentSessionToken)
            ->where('is_active', true)
            ->get();
            
        $terminatedCount = 0;
        foreach ($sessions as $session) {
            $session->deactivate();
            $terminatedCount++;
        }

        return response()->json([
            'success' => true,
            'message' => "Terminated {$terminatedCount} other sessions",
            'terminated_count' => $terminatedCount
        ]);
    }

    /**
     * Get current session info
     */
    public function getCurrentSession(Request $request): JsonResponse
    {
        $sessionToken = $request->bearerToken();
        
        if (!$sessionToken) {
            return response()->json([
                'success' => false,
                'message' => 'Session token required'
            ], 400);
        }

        $session = UserSession::where('session_token', $sessionToken)
            ->where('is_active', true)
            ->first();
        
        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $session->id,
                'device_type' => $session->device_type,
                'device_name' => $session->device_name,
                'browser' => $session->browser,
                'operating_system' => $session->operating_system,
                'ip_address' => $session->ip_address,
                'status' => $session->status,
                'last_activity_at' => $session->last_activity_at,
                'logged_in_at' => $session->logged_in_at,
                'session_duration' => $session->calculateSessionDuration(),
            ]
        ]);
    }

    /**
     * Handle user going offline (called on logout or window close)
     */
    public function goOffline(Request $request): JsonResponse
    {
        $sessionToken = $request->bearerToken();
        
        if ($sessionToken) {
            $session = UserSession::where('session_token', $sessionToken)
                ->where('is_active', true)
                ->first();
                
            if ($session) {
                $session->markOffline();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Session marked as offline'
        ]);
    }

    /**
     * Heartbeat endpoint to keep session alive
     */
    public function heartbeat(Request $request): JsonResponse
    {
        $sessionToken = $request->bearerToken();
        
        if ($sessionToken) {
            $session = UserSession::where('session_token', $sessionToken)
                ->where('is_active', true)
                ->first();
                
            if ($session) {
                $session->updateActivity();
            }
        }

        return response()->json([
            'success' => true,
            'timestamp' => now()
        ]);
    }
}
