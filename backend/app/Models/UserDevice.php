<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class UserDevice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'device_id',
        'device_name',
        'characteristics',
        'first_seen',
        'last_seen',
        'session_count',
        'locations',
        'is_trusted',
        'risk_score',
        'notes',
    ];

    protected $casts = [
        'characteristics' => 'array',
        'locations' => 'array',
        'first_seen' => 'datetime',
        'last_seen' => 'datetime',
        'is_trusted' => 'boolean',
        'risk_score' => 'decimal:2',
    ];

    protected $appends = [
        'location_summary',
        'time_since_last_seen',
        'active_sessions_count',
    ];

    /**
     * Get the user that owns this device
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all fingerprints for this device
     */
    public function fingerprints(): HasMany
    {
        return $this->hasMany(DeviceFingerprint::class, 'device_id', 'device_id');
    }

    /**
     * Get all sessions for this device
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(UserSession::class, 'device_id', 'device_id');
    }

    /**
     * Get active sessions for this device
     */
    public function activeSessions(): HasMany
    {
        return $this->hasMany(UserSession::class, 'device_id', 'device_id')
                    ->where('is_active', true);
    }

    /**
     * Get device session events
     */
    public function sessionEvents(): HasMany
    {
        return $this->hasMany(DeviceSessionEvent::class, 'device_id', 'device_id');
    }

    /**
     * Get the latest fingerprint for this device
     */
    public function latestFingerprint()
    {
        return $this->fingerprints()->latest()->first();
    }

    /**
     * Get location summary
     */
    public function getLocationSummaryAttribute(): string
    {
        if (!$this->locations || empty($this->locations)) {
            return 'Unknown Location';
        }

        if (count($this->locations) === 1) {
            return $this->locations[0];
        }

        return $this->locations[0] . ' (and ' . (count($this->locations) - 1) . ' other' . 
               (count($this->locations) > 2 ? 's' : '') . ')';
    }

    /**
     * Get human-readable time since last seen
     */
    public function getTimeSinceLastSeenAttribute(): string
    {
        if (!$this->last_seen) {
            return 'Never';
        }

        return $this->last_seen->diffForHumans();
    }

    /**
     * Get active sessions count
     */
    public function getActiveSessionsCountAttribute(): int
    {
        return $this->activeSessions()->count();
    }

    /**
     * Update last seen timestamp and increment session count
     */
    public function updateActivity(?string $location = null): void
    {
        $updateData = [
            'last_seen' => now(),
            'session_count' => $this->session_count + 1,
        ];

        // Add location if provided and not already in the list
        if ($location && !in_array($location, $this->locations ?? [])) {
            $locations = $this->locations ?? [];
            $locations[] = $location;
            $updateData['locations'] = $locations;
        }

        $this->update($updateData);
    }

    /**
     * Mark device as trusted
     */
    public function markAsTrusted(): void
    {
        $this->update([
            'is_trusted' => true,
            'risk_score' => max(0, $this->risk_score - 0.3), // Reduce risk score
        ]);
    }

    /**
     * Update risk score based on new activity
     */
    public function updateRiskScore(array $newCharacteristics): void
    {
        $riskFactors = [
            'unknown_location' => ($newCharacteristics['location'] ?? '') === 'Unknown Location' ? 0.2 : 0.0,
            'proxy_detected' => (strpos($newCharacteristics['location'] ?? '', 'Proxy') !== false) ? 0.4 : 0.0,
            'tor_detected' => (strpos($newCharacteristics['location'] ?? '', 'Tor') !== false) ? 0.6 : 0.0,
            'unknown_gpu' => ($newCharacteristics['gpu_vendor'] ?? 'Unknown') === 'Unknown' ? 0.1 : 0.0,
            'webgl_disabled' => !($newCharacteristics['webgl_supported'] ?? false) ? 0.1 : 0.0,
            'unusual_screen' => in_array($newCharacteristics['screen_resolution'] ?? '', ['Unknown', '800x600', '1024x768']) ? 0.1 : 0.0,
        ];

        $newRiskScore = min(1.0, array_sum($riskFactors));
        
        // If device is trusted, reduce risk score impact
        if ($this->is_trusted) {
            $newRiskScore *= 0.5;
        }

        $this->update(['risk_score' => $newRiskScore]);
    }

    /**
     * Compare characteristics with another device
     */
    public function compareCharacteristics(array $otherCharacteristics): float
    {
        if (!function_exists('compareDeviceCharacteristics')) {
            require_once app_path('Helpers/EnhancedDeviceDetection.php');
        }

        return compareDeviceCharacteristics($this->characteristics, $otherCharacteristics);
    }

    /**
     * Get device risk level as human-readable string
     */
    public function getRiskLevel(): string
    {
        if ($this->risk_score >= 0.7) return 'High';
        if ($this->risk_score >= 0.4) return 'Medium';
        if ($this->risk_score >= 0.1) return 'Low';
        return 'Minimal';
    }

    /**
     * Scope for trusted devices
     */
    public function scopeTrusted($query)
    {
        return $query->where('is_trusted', true);
    }

    /**
     * Scope for high-risk devices
     */
    public function scopeHighRisk($query)
    {
        return $query->where('risk_score', '>=', 0.7);
    }

    /**
     * Scope for recently active devices
     */
    public function scopeRecentlyActive($query, int $days = 30)
    {
        return $query->where('last_seen', '>=', now()->subDays($days));
    }

    /**
     * Create a new device record with fingerprint
     */
    public static function createWithFingerprint(
        int $userId, 
        string $deviceId, 
        array $sessionData
    ): self {
        $characteristics = $sessionData['device_characteristics'];
        
        // Create device record
        $device = self::create([
            'user_id' => $userId,
            'device_id' => $deviceId,
            'device_name' => $characteristics['device_name'] ?? 'Unknown Device',
            'characteristics' => $characteristics,
            'first_seen' => now(),
            'last_seen' => now(),
            'session_count' => 1,
            'locations' => [$characteristics['location'] ?? 'Unknown Location'],
            'is_trusted' => false,
            'risk_score' => self::calculateInitialRiskScore($characteristics),
        ]);

        // Create initial fingerprint record
        DeviceFingerprint::createFromSessionData($userId, $deviceId, $sessionData);

        return $device;
    }

    /**
     * Calculate initial risk score for a new device
     */
    private static function calculateInitialRiskScore(array $characteristics): float
    {
        if (!function_exists('calculateDeviceRiskScore')) {
            require_once app_path('Helpers/EnhancedDeviceDetection.php');
        }

        return calculateDeviceRiskScore($characteristics);
    }
}