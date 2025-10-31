<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing users' profile completion status based on their current profile data
        DB::statement("
            UPDATE users
            SET profile_completion_status = CASE
                WHEN username IS NOT NULL
                     AND username != ''
                     AND (
                         CASE WHEN profile_image IS NOT NULL AND profile_image != '' THEN 1 ELSE 0 END +
                         CASE WHEN bio IS NOT NULL AND bio != '' THEN 1 ELSE 0 END +
                         CASE WHEN date_of_birth IS NOT NULL THEN 1 ELSE 0 END +
                         CASE WHEN location IS NOT NULL AND location != '' THEN 1 ELSE 0 END
                     ) >= 2
                THEN 'completed'
                ELSE 'incomplete'
            END
            WHERE profile_completion_status = 'incomplete'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reset all profile completion statuses to 'incomplete'
        DB::table('users')->update(['profile_completion_status' => 'incomplete']);
    }
};
