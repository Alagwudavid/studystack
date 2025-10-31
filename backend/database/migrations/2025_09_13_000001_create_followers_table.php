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
        Schema::create('followers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('follower_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('date_followed')->useCurrent();
            $table->timestamp('date_unfollowed')->nullable();
            $table->enum('follower_action', ['default', 'mute', 'block'])->default('default');
            $table->boolean('is_active')->default(true); // true = following, false = unfollowed
            $table->timestamps();
            
            // Ensure a user can't follow the same person multiple times
            $table->unique(['user_id', 'follower_id']);
            
            // Add indexes for better query performance
            $table->index(['user_id', 'is_active']);
            $table->index(['follower_id', 'is_active']);
            $table->index('date_followed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('followers');
    }
};