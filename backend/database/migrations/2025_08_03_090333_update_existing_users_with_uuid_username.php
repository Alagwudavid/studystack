<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Load helper functions
        require_once app_path('Helpers/UserProfileHelper.php');
        
        // Get all users that need updates
        $users = DB::table('users')
            ->where(function ($query) {
                $query->whereNull('uuid')
                      ->orWhereNull('username')
                      ->orWhere('uuid', '')
                      ->orWhere('username', '');
            })
            ->get();

        foreach ($users as $user) {
            $updates = [];
            
            // Generate UUID if missing
            if (empty($user->uuid)) {
                $updates['uuid'] = generateUniqueUserUUID();
            }
            
            // Generate username if missing
            if (empty($user->username)) {
                $updates['username'] = generateUniqueUsername($user->email, $user->name);
            }

            if (!empty($updates)) {
                $updates['updated_at'] = now();
                DB::table('users')
                    ->where('id', $user->id)
                    ->update($updates);
                    
                echo "Updated user ID {$user->id} ({$user->email})\n";
                if (isset($updates['uuid'])) {
                    echo "  UUID: {$updates['uuid']}\n";
                }
                if (isset($updates['username'])) {
                    echo "  Username: {$updates['username']}\n";
                }
            }
        }
        
        echo "Migration completed. Updated " . count($users) . " users.\n";
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration doesn't need to be reversed
        // The UUID and username fields will remain
    }
};
