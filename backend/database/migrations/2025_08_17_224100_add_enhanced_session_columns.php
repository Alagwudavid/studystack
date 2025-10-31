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
        Schema::table('user_sessions', function (Blueprint $table) {
            // Add enhanced device detection columns
            $table->string('browser_version')->nullable()->after('browser');
            $table->string('os_version')->nullable()->after('operating_system');
            $table->string('location')->nullable()->after('ip_address'); // Human-readable location
            $table->json('user_preferences')->nullable()->after('user_agent'); // User preferences from headers

            // Add indexes for the new columns
            $table->index('browser');
            $table->index('operating_system');
            $table->index('device_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_sessions', function (Blueprint $table) {
            $table->dropColumn([
                'browser_version',
                'os_version',
                'location',
                'user_preferences'
            ]);

            // Drop the indexes
            $table->dropIndex(['browser']);
            $table->dropIndex(['operating_system']);
            $table->dropIndex(['device_type']);
        });
    }
};
