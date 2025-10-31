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
        Schema::create('user_interests', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id'); // User ID
            $table->unsignedBigInteger('interest_id'); // Interest ID
            $table->timestamps();

            // Unique constraint to prevent duplicate entries
            $table->unique(['user_id', 'interest_id']);

            // Add indexes for better performance
            $table->index('user_id');
            $table->index('interest_id');

            // Foreign key constraints
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            // $table->foreign('interest_id')->references('id')->on('interests')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_interests');
    }
};
