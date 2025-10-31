<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create user_devices table for device fingerprinting and grouping
        Schema::create('user_devices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('device_id', 32)->unique(); // Unique device identifier (device_[16char])
            $table->string('device_name'); // Human-readable device name
            $table->json('characteristics'); // All device characteristics as JSON
            $table->timestamp('first_seen')->useCurrent();
            $table->timestamp('last_seen')->useCurrent();
            $table->integer('session_count')->default(1);
            $table->json('locations')->nullable(); // Array of locations seen from this device
            $table->boolean('is_trusted')->default(false);
            $table->decimal('risk_score', 3, 2)->default(0.00); // 0.00 to 1.00
            $table->text('notes')->nullable(); // Admin or user notes about this device
            $table->timestamps();

            // Indexes
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'device_id']);
            $table->index(['user_id', 'last_seen']);
            $table->index(['device_id']);
            $table->index(['is_trusted']);
            $table->index(['risk_score']);
        });

        // Create device_fingerprints table for detailed fingerprinting data
        Schema::create('device_fingerprints', function (Blueprint $table) {
            $table->id();
            $table->string('device_id', 32); // References user_devices.device_id
            $table->unsignedBigInteger('user_id');
            
            // Basic device info
            $table->string('device_type', 20); // desktop, mobile, tablet
            $table->string('browser', 50)->nullable();
            $table->string('browser_version', 20)->nullable();
            $table->string('operating_system', 50)->nullable();
            $table->string('os_version', 20)->nullable();
            
            // Graphics fingerprinting
            $table->string('gpu_vendor', 50)->nullable();
            $table->string('gpu_model', 100)->nullable();
            $table->string('gpu_renderer', 200)->nullable();
            $table->boolean('webgl_supported')->default(false);
            $table->string('webgl_version', 50)->nullable();
            $table->string('hardware_acceleration', 20)->nullable();
            $table->string('max_texture_size', 20)->nullable();
            $table->string('graphics_memory', 20)->nullable();
            
            // Screen and display
            $table->string('screen_resolution', 20)->nullable();
            $table->string('color_depth', 10)->nullable();
            $table->string('pixel_ratio', 10)->nullable();
            
            // Hardware specifications
            $table->string('cpu_cores', 10)->nullable();
            $table->string('memory_gb', 10)->nullable();
            $table->string('platform_details', 100)->nullable();
            
            // Capability detection
            $table->boolean('touch_support')->default(false);
            $table->boolean('webrtc_support')->default(false);
            
            // Fingerprinting hashes
            $table->string('canvas_fingerprint', 50)->nullable();
            $table->string('audio_fingerprint', 50)->nullable();
            
            // Timezone and locale
            $table->string('timezone_offset', 10)->nullable();
            $table->string('timezone', 50)->nullable();
            $table->string('language', 10)->nullable();
            
            // Full user agent and original data
            $table->text('user_agent')->nullable();
            $table->json('raw_headers')->nullable(); // Store all fingerprinting headers
            
            $table->timestamps();

            // Indexes
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('device_id')->references('device_id')->on('user_devices')->onDelete('cascade');
            $table->index(['device_id']);
            $table->index(['user_id', 'device_id']);
            $table->index(['gpu_vendor']);
            $table->index(['browser', 'operating_system']);
            $table->index(['screen_resolution']);
            $table->index(['webgl_supported']);
        });

        // Add device_id column to user_sessions table if it doesn't exist
        Schema::table('user_sessions', function (Blueprint $table) {
            if (!Schema::hasColumn('user_sessions', 'device_id')) {
                $table->string('device_id', 32)->nullable()->after('user_id');
                $table->index(['device_id']);
                $table->index(['user_id', 'device_id']);
            }
        });

        // Create device_session_events table for tracking device-related security events
        Schema::create('device_session_events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('device_id', 32)->nullable();
            $table->unsignedBigInteger('session_id')->nullable();
            $table->string('event_type', 50); // new_device, suspicious_change, location_change, etc.
            $table->string('severity', 20)->default('info'); // info, warning, critical
            $table->json('event_data')->nullable(); // Additional event details
            $table->string('ip_address', 45)->nullable();
            $table->string('location', 200)->nullable();
            $table->boolean('user_notified')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamps();

            // Indexes
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('session_id')->references('id')->on('user_sessions')->onDelete('set null');
            $table->index(['user_id', 'event_type']);
            $table->index(['device_id', 'event_type']);
            $table->index(['severity']);
            $table->index(['user_notified']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_session_events');
        
        Schema::table('user_sessions', function (Blueprint $table) {
            if (Schema::hasColumn('user_sessions', 'device_id')) {
                $table->dropIndex(['device_id']);
                $table->dropIndex(['user_id', 'device_id']);
                $table->dropColumn('device_id');
            }
        });
        
        Schema::dropIfExists('device_fingerprints');
        Schema::dropIfExists('user_devices');
    }
};