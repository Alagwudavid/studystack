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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'profile_image')) {
                $table->string('profile_image')->nullable();
            }
            if (!Schema::hasColumn('users', 'bio')) {
                $table->text('bio')->nullable();
            }
            if (!Schema::hasColumn('users', 'points')) {
                $table->integer('points')->default(0);
            }
            if (!Schema::hasColumn('users', 'level')) {
                $table->integer('level')->default(1);
            }
            if (!Schema::hasColumn('users', 'streak_count')) {
                $table->integer('streak_count')->default(0);
            }
            if (!Schema::hasColumn('users', 'last_activity_date')) {
                $table->date('last_activity_date')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'profile_image',
                'bio',
                'points',
                'level',
                'streak_count',
                'last_activity_date'
            ]);
        });
    }
};
