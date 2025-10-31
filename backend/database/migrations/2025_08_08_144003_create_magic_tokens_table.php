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
        Schema::create('magic_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('token', 255)->index(); // SHA256 hash of the JWT token
            $table->string('email', 255)->index();
            $table->string('code', 6);
            $table->timestamp('used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();

            // Index for cleanup queries
            $table->index(['expires_at', 'used_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('magic_tokens');
    }
};
