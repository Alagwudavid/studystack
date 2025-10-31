<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UserSession extends Model
{
    protected $fillable = [
        'user_id',
        'device_id',
        'session_token',
        'device_type',
        'device_name',
        'browser',
        'browser_version',
        'operating_system',
        'os_version',
        'ip_address',
        'user_agent',
        'status',
        'last_activity_at',
        'logged_in_at',
        'logged_out_at',
        'is_active',
        'location',
        'location_data',
        'session_duration',
        'user_preferences',
    ];

    protected $casts = [
        'last_activity_at' => 'datetime',
        'logged_in_at' => 'datetime',
        'logged_out_at' => 'datetime',
        'is_active' => 'boolean',
        'location_data' => 'array',
        'user_preferences' => 'array',
        'session_duration' => 'integer',
    ];

    /**
     * Relationship with User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship with Device
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(UserDevice::class, 'device_id', 'device_id');
    }

    /**
     * Generate a unique session token
     */
    public static function generateSessionToken(): string
    {
        return Str::random(64);
    }

    /**
     * Create a new session for a user
     */
    public static function createSession(int $userId, array $sessionData = []): self
    {
        return self::create([
            'user_id' => $userId,
            'session_token' => self::generateSessionToken(),
            'device_type' => $sessionData['device_type'] ?? null,
            'device_name' => $sessionData['device_name'] ?? null,
            'browser' => $sessionData['browser'] ?? null,
            'operating_system' => $sessionData['operating_system'] ?? null,
            'ip_address' => $sessionData['ip_address'] ?? request()->ip(),
            'user_agent' => $sessionData['user_agent'] ?? request()->userAgent(),
            'status' => 'online',
            'last_activity_at' => now(),
            'logged_in_at' => now(),
            'is_active' => true,
            'location_data' => $sessionData['location_data'] ?? null,
        ]);
    }

    /**
     * Update session activity
     */
    public function updateActivity(): void
    {
        $this->update([
            'last_activity_at' => now(),
            'status' => 'online',
        ]);
    }

    /**
     * Mark session as offline
     */
    public function markOffline(): void
    {
        $this->update([
            'status' => 'offline',
            'logged_out_at' => now(),
            'session_duration' => $this->calculateSessionDuration(),
        ]);
    }

    /**
     * Mark session as away
     */
    public function markAway(): void
    {
        $this->update([
            'status' => 'away',
        ]);
    }

    /**
     * Deactivate session
     */
    public function deactivate(): void
    {
        $this->update([
            'is_active' => false,
            'status' => 'offline',
            'logged_out_at' => now(),
            'session_duration' => $this->calculateSessionDuration(),
        ]);
    }

    /**
     * Calculate session duration in seconds
     */
    public function calculateSessionDuration(): int
    {
        if (!$this->logged_in_at) {
            return 0;
        }

        $endTime = $this->logged_out_at ?? now();
        return $this->logged_in_at->diffInSeconds($endTime);
    }

    /**
     * Check if session is expired (inactive for more than specified minutes)
     */
    public function isExpired(int $minutes = 60): bool
    {
        if (!$this->last_activity_at) {
            return true;
        }

        return $this->last_activity_at->diffInMinutes(now()) > $minutes;
    }

    /**
     * Check if session is very old (for "keep signed in" sessions)
     */
    public function isVeryOld(int $days = 30): bool
    {
        if (!$this->last_activity_at) {
            return true;
        }

        return $this->last_activity_at->diffInDays(now()) > $days;
    }

    /**
     * Get active sessions for a user
     */
    public static function getActiveSessions(int $userId)
    {
        return self::where('user_id', $userId)
            ->where('is_active', true)
            ->where('status', '!=', 'offline')
            ->get();
    }

    /**
     * Get online sessions for a user
     */
    public static function getOnlineSessions(int $userId)
    {
        return self::where('user_id', $userId)
            ->where('is_active', true)
            ->where('status', 'online')
            ->get();
    }

    /**
     * Clean up expired sessions
     */
    public static function cleanupExpiredSessions(int $expiryMinutes = 60): int
    {
        $expiredSessions = self::where('is_active', true)
            ->where('last_activity_at', '<', now()->subMinutes($expiryMinutes))
            ->get();

        foreach ($expiredSessions as $session) {
            $session->deactivate();
        }

        return $expiredSessions->count();
    }

    /**
     * Clean up very old sessions (for "keep signed in" sessions)
     */
    public static function cleanupOldSessions(int $expiryDays = 30): int
    {
        $oldSessions = self::where('is_active', true)
            ->where('last_activity_at', '<', now()->subDays($expiryDays))
            ->get();

        foreach ($oldSessions as $session) {
            $session->deactivate();
        }

        return $oldSessions->count();
    }

    /**
     * Get session statistics for a user
     */
    public static function getUserSessionStats(int $userId): array
    {
        $sessions = self::where('user_id', $userId)->get();
        
        return [
            'total_sessions' => $sessions->count(),
            'active_sessions' => $sessions->where('is_active', true)->count(),
            'online_sessions' => $sessions->where('status', 'online')->count(),
            'total_session_time' => $sessions->sum('session_duration'),
            'average_session_time' => $sessions->where('session_duration', '>', 0)->avg('session_duration'),
            'last_activity' => $sessions->where('is_active', true)->max('last_activity_at'),
        ];
    }
}
