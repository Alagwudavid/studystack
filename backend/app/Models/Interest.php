<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interest extends Model
{
    use HasFactory;

    protected $fillable = [
        'real_id',
        'label',
        'user_id',
        'username',
        'is_added_by_user',
    ];

    protected $casts = [
        'is_added_by_user' => 'boolean',
    ];

    /**
     * Get the user who added this interest (if any)
     */
    public function addedByUser()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all users who have selected this interest
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_interests');
    }

    /**
     * Generate a unique real_id for the interest
     */
    public static function generateRealId(): string
    {
        do {
            $realId = strtoupper(substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 6));
        } while (self::where('real_id', $realId)->exists());

        return $realId;
    }

    /**
     * Scope for default interests (not added by users)
     */
    public function scopeDefault($query)
    {
        return $query->where('is_added_by_user', false);
    }

    /**
     * Scope for user-added interests
     */
    public function scopeUserAdded($query)
    {
        return $query->where('is_added_by_user', true);
    }

    /**
     * Scope for searching interests by label
     */
    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('label', 'ILIKE', '%' . $searchTerm . '%'); // Use ILIKE for case-insensitive search in PostgreSQL
    }

    /**
     * Scope for suggested interests (can be customized later)
     */
    public function scopeSuggested($query)
    {
        // For now, return default interests ordered by most popular (can be enhanced)
        return $query->default()->orderBy('created_at');
    }
}
