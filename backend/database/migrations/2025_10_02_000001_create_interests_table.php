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
        Schema::create('interests', function (Blueprint $table) {
            $table->id(); // Primary key auto-increment
            $table->string('real_id', 10)->unique(); // e.g., 'xYu427'
            $table->string('label', 100); // Interest label
            $table->uuid('user_id')->nullable(); // User who added it (null for default interests)
            $table->string('username', 50)->nullable(); // Username who added it (null for default interests)
            $table->boolean('is_added_by_user')->default(false); // true if added by user, false if default
            $table->timestamps();

            // Add indexes for better performance
            $table->index('real_id');
            $table->index('label');
            $table->index('user_id');
            $table->index('is_added_by_user');

            // Foreign key constraint (optional, depends on your setup)
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interests');
    }
};
