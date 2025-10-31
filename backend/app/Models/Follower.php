<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Follower extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'follower_id',
        'date_followed',
        'date_unfollowed',
        'follower_action',
        'is_active',
    ];

    protected $casts = [
        'date_followed' => 'datetime',
        'date_unfollowed' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user being followed
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the follower
     */
    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    /**
     * Scope to get active followers
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get followers by action
     */
    public function scopeByAction($query, $action)
    {
        return $query->where('follower_action', $action);
    }
}