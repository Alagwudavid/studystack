<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'profile_image',
        'banner_image',
        'bio',
        'date_of_birth',
        'location',
        'profile_completion_status',
        'points',
        'level',
        'streak_count',
        'last_activity_date',
        'onboarding_id',
        'is_onboarded_status',
        'is_professional',
        'followers_count',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'date_of_birth' => 'date',
            'last_activity_date' => 'datetime',
            'points' => 'integer',
            'level' => 'integer',
            'streak_count' => 'integer',
        ];
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Relationship with verification codes
     */
    public function verificationCodes()
    {
        return $this->hasMany(VerificationCode::class);
    }

    /**
     * Relationship with user sessions
     */
    public function userSessions()
    {
        return $this->hasMany(UserSession::class);
    }

    /**
     * Get active sessions for this user
     */
    public function activeSessions()
    {
        return $this->userSessions()->where('is_active', true);
    }

    /**
     * Get online sessions for this user
     */
    public function onlineSessions()
    {
        return $this->userSessions()->where('is_active', true)->where('status', 'online');
    }

    /**
     * Check if user is currently online
     */
    public function isOnline(): bool
    {
        return $this->onlineSessions()->exists();
    }

    /**
     * Get user's current session status
     */
    public function getSessionStatus(): string
    {
        $latestSession = $this->userSessions()
            ->where('is_active', true)
            ->latest('last_activity_at')
            ->first();

        if (!$latestSession) {
            return 'offline';
        }

        // Check if session is expired (inactive for more than 5 minutes)
        if ($latestSession->isExpired(5)) {
            return 'away';
        }

        return $latestSession->status;
    }

    /**
     * Get the user's onboarding data.
     */
    public function onboarding()
    {
        return $this->belongsTo(Onboarding::class);
    }

    /**
     * Complete onboarding for the user.
     */
    public function completeOnboarding($onboardingId = null, $isProfessional = false, $profileCompletionStatus = 'complete')
    {
        $this->update([
            'onboarding_id' => $onboardingId,
            'is_onboarded_status' => 'complete',
            'is_professional' => $isProfessional,
            'profile_completion_status' => $profileCompletionStatus,
        ]);
    }

    /**
     * Skip onboarding for the user.
     */
    public function skipOnboarding($onboardingId = null)
    {
        $this->update([
            'onboarding_id' => $onboardingId,
            'is_onboarded_status' => 'skipped',
        ]);
    }

    /**
     * Check if user has completed onboarding.
     */
    public function hasCompletedOnboarding(): bool
    {
        return $this->is_onboarded_status === 'complete';
    }

    /**
     * Check if user has skipped onboarding.
     */
    public function hasSkippedOnboarding(): bool
    {
        return $this->is_onboarded_status === 'skipped';
    }

    /**
     * Users that this user is following
     */
    public function following()
    {
        return $this->hasMany(Follower::class, 'follower_id')
            ->where('is_active', true);
    }

    /**
     * Users that are following this user
     */
    public function followers()
    {
        return $this->hasMany(Follower::class, 'user_id')
            ->where('is_active', true);
    }

    /**
     * Check if this user is following another user
     */
    public function isFollowing($userId): bool
    {
        return $this->following()
            ->where('user_id', $userId)
            ->exists();
    }

    /**
     * Follow a user
     */
    public function follow($userId)
    {
        if ($userId == $this->id) {
            return false; // Can't follow yourself
        }

        $result = Follower::updateOrCreate(
            [
                'user_id' => $userId,
                'follower_id' => $this->id,
            ],
            [
                'is_active' => true,
                'date_followed' => now(),
                'date_unfollowed' => null,
                'follower_action' => 'default',
            ]
        );

        // Update followers count for the user being followed
        if ($result) {
            $userToFollow = User::find($userId);
            if ($userToFollow) {
                // Force recalculation and update
                $count = $userToFollow->followers()->count();
                $userToFollow->forceFill(['followers_count' => $count])->save();
                \Log::info("Updated followers count for user {$userId}: {$count}");
            }
        }

        return $result;
    }

    /**
     * Unfollow a user
     */
    public function unfollow($userId)
    {
        $result = Follower::where('user_id', $userId)
            ->where('follower_id', $this->id)
            ->where('is_active', true)
            ->update([
                'is_active' => false,
                'date_unfollowed' => now(),
            ]);

        // Update followers count for the user being unfollowed
        if ($result > 0) {
            $userToUnfollow = User::find($userId);
            if ($userToUnfollow) {
                // Force recalculation and update
                $count = $userToUnfollow->followers()->count();
                $userToUnfollow->forceFill(['followers_count' => $count])->save();
                Log::info("Updated followers count for user {$userId}: {$count}");
            }
        }

        return $result;
    }

    /**
     * Update the followers count for this user
     */
    public function updateFollowersCount()
    {
        $count = $this->followers()->count();
        $this->forceFill(['followers_count' => $count])->save();
        Log::info("Manually updated followers count for user {$this->id}: {$count}");
        return $count;
    }

    /**
     * Get following count
     */
    public function getFollowingCountAttribute(): int
    {
        return $this->following()->count();
    }

    /**
     * Get followers count
     */
    public function getFollowersCountAttribute(): int
    {
        return $this->followers()->count();
    }

    /**
     * Get user's selected interests
     */
    public function interests()
    {
        return $this->belongsToMany(Interest::class, 'user_interests');
    }

    /**
     * Get interests that this user has added
     */
    public function addedInterests()
    {
        return $this->hasMany(Interest::class, 'user_id');
    }
}
