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
        Schema::create('onboarding', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->enum('account_type', ['personal', 'business'])->nullable();
            $table->json('tags')->nullable(); // For storing selected tags/interests
            $table->string('banner_url')->nullable(); // For business banner image
            $table->text('bio')->nullable(); // Additional bio/description
            $table->json('preferences')->nullable(); // For any additional preferences
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onboarding');
    }
};
