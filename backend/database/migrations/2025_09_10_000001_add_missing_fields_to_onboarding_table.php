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
        Schema::table('onboarding', function (Blueprint $table) {
            // Completion tracking fields
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->string('completion_step')->nullable();
            
            // Personal information fields
            $table->json('selected_interests')->nullable(); // For storing selected interests
            $table->date('date_of_birth')->nullable();
            $table->string('location')->nullable();
            
            // Professional/business fields
            $table->string('organization')->nullable();
            $table->string('website')->nullable();
            $table->string('credentials')->nullable();
            $table->string('professional_category')->nullable();
            
            // Image fields
            $table->string('profile_image')->nullable();
            $table->string('banner_image')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('onboarding', function (Blueprint $table) {
            $table->dropColumn([
                'is_completed',
                'completed_at',
                'completion_step',
                'selected_interests',
                'date_of_birth',
                'location',
                'organization',
                'website', 
                'credentials',
                'professional_category',
                'profile_image',
                'banner_image'
            ]);
        });
    }
};