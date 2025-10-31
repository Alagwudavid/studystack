<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceFingerprint extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'user_id',
        'device_type',
        'browser',
        'browser_version',
        'operating_system',
        'os_version',
        'gpu_vendor',
        'gpu_model',
        'gpu_renderer',
        'webgl_supported',
        'webgl_version',
        'hardware_acceleration',
        'max_texture_size',
        'graphics_memory',
        'screen_resolution',
        'color_depth',
        'pixel_ratio',
        'cpu_cores',
        'memory_gb',
        'platform_details',
        'touch_support',
        'webrtc_support',
        'canvas_fingerprint',
        'audio_fingerprint',
        'timezone_offset',
        'timezone',
        'language',
        'user_agent',
        'raw_headers',
    ];

    protected $casts = [
        'webgl_supported' => 'boolean',
        'touch_support' => 'boolean',
        'webrtc_support' => 'boolean',
        'raw_headers' => 'array',
    ];

    /**
     * Get the user that owns this fingerprint
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the device this fingerprint belongs to
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(UserDevice::class, 'device_id', 'device_id');
    }

    /**
     * Create a fingerprint record from session data
     */
    public static function createFromSessionData(
        int $userId, 
        string $deviceId, 
        array $sessionData
    ): self {
        $characteristics = $sessionData['device_characteristics'];
        
        return self::create([
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
            'raw_headers' => $sessionData['raw_headers'] ?? null,
        ]);
    }

    /**
     * Get GPU information summary
     */
    public function getGpuSummary(): string
    {
        if ($this->gpu_vendor && $this->gpu_model) {
            return "{$this->gpu_vendor} {$this->gpu_model}";
        } elseif ($this->gpu_vendor) {
            return $this->gpu_vendor;
        } elseif ($this->gpu_renderer) {
            return $this->gpu_renderer;
        }
        
        return 'Unknown GPU';
    }

    /**
     * Get browser information summary
     */
    public function getBrowserSummary(): string
    {
        if ($this->browser && $this->browser_version) {
            return "{$this->browser} {$this->browser_version}";
        } elseif ($this->browser) {
            return $this->browser;
        }
        
        return 'Unknown Browser';
    }

    /**
     * Get OS information summary
     */
    public function getOsSummary(): string
    {
        if ($this->operating_system && $this->os_version) {
            return "{$this->operating_system} {$this->os_version}";
        } elseif ($this->operating_system) {
            return $this->operating_system;
        }
        
        return 'Unknown OS';
    }

    /**
     * Get hardware summary
     */
    public function getHardwareSummary(): array
    {
        return [
            'cpu_cores' => $this->cpu_cores ?? 'Unknown',
            'memory' => $this->memory_gb ? "{$this->memory_gb}GB" : 'Unknown',
            'screen_resolution' => $this->screen_resolution ?? 'Unknown',
            'gpu' => $this->getGpuSummary(),
            'webgl_support' => $this->webgl_supported ? 'Yes' : 'No',
        ];
    }

    /**
     * Check if this fingerprint indicates a mobile device
     */
    public function isMobileDevice(): bool
    {
        return in_array($this->device_type, ['mobile', 'tablet']);
    }

    /**
     * Check if this fingerprint has high-quality graphics
     */
    public function hasHighQualityGraphics(): bool
    {
        return $this->webgl_supported && 
               $this->hardware_acceleration === 'enabled' &&
               !in_array($this->gpu_vendor, ['Unknown', null]);
    }

    /**
     * Get capability flags
     */
    public function getCapabilities(): array
    {
        return [
            'webgl' => $this->webgl_supported,
            'webrtc' => $this->webrtc_support,
            'touch' => $this->touch_support,
            'hardware_acceleration' => $this->hardware_acceleration === 'enabled',
            'canvas_fingerprinting' => !empty($this->canvas_fingerprint),
            'audio_fingerprinting' => !empty($this->audio_fingerprint),
        ];
    }

    /**
     * Scope for mobile devices
     */
    public function scopeMobile($query)
    {
        return $query->whereIn('device_type', ['mobile', 'tablet']);
    }

    /**
     * Scope for desktop devices
     */
    public function scopeDesktop($query)
    {
        return $query->where('device_type', 'desktop');
    }

    /**
     * Scope for devices with WebGL support
     */
    public function scopeWithWebGL($query)
    {
        return $query->where('webgl_supported', true);
    }

    /**
     * Scope for specific GPU vendor
     */
    public function scopeByGpuVendor($query, string $vendor)
    {
        return $query->where('gpu_vendor', $vendor);
    }

    /**
     * Scope for specific browser
     */
    public function scopeByBrowser($query, string $browser)
    {
        return $query->where('browser', $browser);
    }
}