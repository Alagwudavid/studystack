<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Onboarding extends Model
{
    use HasFactory;

    protected $table = 'onboarding';

    protected $fillable = [
        'user_id',
        'account_type',
        'profile_image',
        'banner_image',
        'selected_interests',
        'organization',
        'website',
        'credentials',
        'professional_category',
        'bio',
        'location',
        'date_of_birth',
        'is_completed',
        'completed_at',
        'completion_step',
    ];

    protected $casts = [
        'selected_interests' => 'array',
        'date_of_birth' => 'date',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the users that reference this onboarding.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'onboarding_id');
    }

    /**
     * Mark onboarding as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'is_completed' => true,
            'completed_at' => now(),
            'completion_step' => 'completed',
        ]);
    }

    /**
     * Check if user has completed onboarding.
     */
    public function isCompleted(): bool
    {
        return $this->is_completed;
    }

    /**
     * Get completion progress percentage.
     */
    public function getCompletionPercentage(): int
    {
        $steps = [
            'account_type' => 14,      // 1/7
            'profile_images' => 28,    // 2/7
            'personal_interests' => 43, // 3/7 (only for personal)
            'business_details' => 43,   // 3/7 (only for business)
            'profile_info' => 57,      // 4/7
            'location_birth' => 71,    // 5/7
            'completed' => 100,        // 7/7
        ];

        return $steps[$this->completion_step] ?? 0;
    }
}