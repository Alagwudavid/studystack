<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceSessionEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'device_id',
        'session_id',
        'event_type',
        'severity',
        'event_data',
        'ip_address',
        'location',
        'user_notified',
        'resolved_at',
        'resolution_notes',
    ];

    protected $casts = [
        'event_data' => 'array',
        'user_notified' => 'boolean',
        'resolved_at' => 'datetime',
    ];

    // Event types
    const EVENT_NEW_DEVICE = 'new_device';
    const EVENT_SUSPICIOUS_CHANGE = 'suspicious_change';
    const EVENT_LOCATION_CHANGE = 'location_change';
    const EVENT_DEVICE_TRUSTED = 'device_trusted';
    const EVENT_DEVICE_UNTRUSTED = 'device_untrusted';
    const EVENT_MULTIPLE_LOCATIONS = 'multiple_locations';
    const EVENT_HIGH_RISK_LOGIN = 'high_risk_login';
    const EVENT_FINGERPRINT_MISMATCH = 'fingerprint_mismatch';

    // Severity levels
    const SEVERITY_INFO = 'info';
    const SEVERITY_WARNING = 'warning';
    const SEVERITY_CRITICAL = 'critical';

    /**
     * Get the user that owns this event
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the device this event relates to
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(UserDevice::class, 'device_id', 'device_id');
    }

    /**
     * Get the session this event relates to
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(UserSession::class, 'session_id');
    }

    /**
     * Create a new device detected event
     */
    public static function createNewDeviceEvent(
        int $userId,
        string $deviceId,
        ?int $sessionId = null,
        array $deviceData = []
    ): self {
        return self::create([
            'user_id' => $userId,
            'device_id' => $deviceId,
            'session_id' => $sessionId,
            'event_type' => self::EVENT_NEW_DEVICE,
            'severity' => self::SEVERITY_INFO,
            'event_data' => [
                'device_name' => $deviceData['device_name'] ?? 'Unknown Device',
                'device_type' => $deviceData['device_type'] ?? 'desktop',
                'browser' => $deviceData['browser'] ?? 'Unknown',
                'operating_system' => $deviceData['operating_system'] ?? 'Unknown',
                'risk_score' => $deviceData['risk_score'] ?? 0,
            ],
            'ip_address' => $deviceData['ip_address'] ?? null,
            'location' => $deviceData['location'] ?? null,
        ]);
    }

    /**
     * Create a suspicious change event
     */
    public static function createSuspiciousChangeEvent(
        int $userId,
        string $deviceId,
        ?int $sessionId = null,
        array $changes = [],
        float $similarityScore = 0.0
    ): self {
        $severity = self::SEVERITY_INFO;
        if ($similarityScore < 0.5) {
            $severity = self::SEVERITY_CRITICAL;
        } elseif ($similarityScore < 0.8) {
            $severity = self::SEVERITY_WARNING;
        }

        return self::create([
            'user_id' => $userId,
            'device_id' => $deviceId,
            'session_id' => $sessionId,
            'event_type' => self::EVENT_SUSPICIOUS_CHANGE,
            'severity' => $severity,
            'event_data' => [
                'changes' => $changes,
                'similarity_score' => $similarityScore,
                'threshold' => 0.85,
            ],
        ]);
    }

    /**
     * Create a location change event
     */
    public static function createLocationChangeEvent(
        int $userId,
        string $deviceId,
        string $previousLocation,
        string $newLocation,
        ?int $sessionId = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'device_id' => $deviceId,
            'session_id' => $sessionId,
            'event_type' => self::EVENT_LOCATION_CHANGE,
            'severity' => self::SEVERITY_WARNING,
            'event_data' => [
                'previous_location' => $previousLocation,
                'new_location' => $newLocation,
            ],
            'location' => $newLocation,
        ]);
    }

    /**
     * Create a high risk login event
     */
    public static function createHighRiskLoginEvent(
        int $userId,
        string $deviceId,
        float $riskScore,
        ?int $sessionId = null,
        array $riskFactors = []
    ): self {
        return self::create([
            'user_id' => $userId,
            'device_id' => $deviceId,
            'session_id' => $sessionId,
            'event_type' => self::EVENT_HIGH_RISK_LOGIN,
            'severity' => self::SEVERITY_CRITICAL,
            'event_data' => [
                'risk_score' => $riskScore,
                'risk_factors' => $riskFactors,
                'threshold' => 0.7,
            ],
        ]);
    }

    /**
     * Mark event as resolved
     */
    public function markAsResolved(string $notes = null): void
    {
        $this->update([
            'resolved_at' => now(),
            'resolution_notes' => $notes,
        ]);
    }

    /**
     * Mark user as notified
     */
    public function markUserNotified(): void
    {
        $this->update(['user_notified' => true]);
    }

    /**
     * Get human-readable event message
     */
    public function getEventMessage(): string
    {
        switch ($this->event_type) {
            case self::EVENT_NEW_DEVICE:
                $deviceName = $this->event_data['device_name'] ?? 'Unknown Device';
                return "New device detected: {$deviceName}";

            case self::EVENT_SUSPICIOUS_CHANGE:
                $score = $this->event_data['similarity_score'] ?? 0;
                $percentage = round($score * 100);
                return "Device characteristics changed (similarity: {$percentage}%)";

            case self::EVENT_LOCATION_CHANGE:
                $from = $this->event_data['previous_location'] ?? 'Unknown';
                $to = $this->event_data['new_location'] ?? 'Unknown';
                return "Location changed from {$from} to {$to}";

            case self::EVENT_HIGH_RISK_LOGIN:
                $score = $this->event_data['risk_score'] ?? 0;
                $percentage = round($score * 100);
                return "High-risk login detected (risk score: {$percentage}%)";

            case self::EVENT_DEVICE_TRUSTED:
                return "Device marked as trusted";

            case self::EVENT_DEVICE_UNTRUSTED:
                return "Device trust revoked";

            default:
                return ucwords(str_replace('_', ' ', $this->event_type));
        }
    }

    /**
     * Get severity color class
     */
    public function getSeverityColor(): string
    {
        switch ($this->severity) {
            case self::SEVERITY_CRITICAL:
                return 'red';
            case self::SEVERITY_WARNING:
                return 'yellow';
            case self::SEVERITY_INFO:
            default:
                return 'blue';
        }
    }

    /**
     * Check if event requires user attention
     */
    public function requiresAttention(): bool
    {
        return in_array($this->severity, [self::SEVERITY_WARNING, self::SEVERITY_CRITICAL]) &&
               !$this->resolved_at;
    }

    /**
     * Scope for unresolved events
     */
    public function scopeUnresolved($query)
    {
        return $query->whereNull('resolved_at');
    }

    /**
     * Scope for critical events
     */
    public function scopeCritical($query)
    {
        return $query->where('severity', self::SEVERITY_CRITICAL);
    }

    /**
     * Scope for events requiring attention
     */
    public function scopeRequiringAttention($query)
    {
        return $query->whereIn('severity', [self::SEVERITY_WARNING, self::SEVERITY_CRITICAL])
                    ->whereNull('resolved_at');
    }

    /**
     * Scope for recent events
     */
    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope for specific event type
     */
    public function scopeOfType($query, string $eventType)
    {
        return $query->where('event_type', $eventType);
    }
}