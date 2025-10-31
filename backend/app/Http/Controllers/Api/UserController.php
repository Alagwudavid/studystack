<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Follower;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function show(string $username): JsonResponse
    {
        // adjust the column you use for username (e.g. `username` or `slug`)
        $user = User::where('username', $username)->first();

        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // you can use a resource or manually return only needed fields
        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'name' => $user->name,
            'bio' => $user->bio,
            'avatar_url' => $user->profile_image,
            'banner_image' => $user->banner_image ?? null,
            'location' => $user->location,
            'is_professional' => $user->is_professional ?? false,
            'professional_category' => $user->professional_category ?? null,
            'points' => $user->points ?? 0,
            'level' => $user->level ?? 1,
            'streak_count' => $user->streak_count ?? 0,
            'followers_count' => $user->followers_count ?? 0,
            'created_at' => $user->created_at,
            // other public fields
        ]);
    }

    /**
     * Follow a user
     */
    public function follow(Request $request, string $username): JsonResponse
    {
        try {
            // Get the authenticated user (assuming JWT auth is set up)
            $authUser = Auth::user();
            if (!$authUser) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $userToFollow = User::where('username', $username)->first();

            if (!$userToFollow) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Check if trying to follow self
            if ($userToFollow->id === $authUser->id) {
                return response()->json(['message' => 'You cannot follow yourself'], 400);
            }

            // Check if already following
            if ($authUser->isFollowing($userToFollow->id)) {
                return response()->json(['message' => 'Already following this user'], 400);
            }

            // Follow the user
            $authUser->follow($userToFollow->id);

            // Get updated followers count - refresh the model from database
            $userToFollow = $userToFollow->fresh();
            $updatedFollowersCount = $userToFollow->followers_count;

            return response()->json([
                'success' => true,
                'message' => "Successfully followed @{$username}",
                'user' => [
                    'id' => $userToFollow->id,
                    'username' => $userToFollow->username,
                    'name' => $userToFollow->name,
                    'is_following' => true,
                ],
                'followers_count' => $updatedFollowersCount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error following user'], 500);
        }
    }

    /**
     * Unfollow a user
     */
    public function unfollow(Request $request, string $username): JsonResponse
    {
        try {
            // Get the authenticated user
            $authUser = Auth::user();
            if (!$authUser) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $userToUnfollow = User::where('username', $username)->first();

            if (!$userToUnfollow) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Check if actually following
            if (!$authUser->isFollowing($userToUnfollow->id)) {
                return response()->json(['message' => 'You are not following this user'], 400);
            }

            // Unfollow the user
            $authUser->unfollow($userToUnfollow->id);

            // Get updated followers count - refresh the model from database
            $userToUnfollow = $userToUnfollow->fresh();
            $updatedFollowersCount = $userToUnfollow->followers_count;

            return response()->json([
                'success' => true,
                'message' => "Successfully unfollowed @{$username}",
                'user' => [
                    'id' => $userToUnfollow->id,
                    'username' => $userToUnfollow->username,
                    'name' => $userToUnfollow->name,
                    'is_following' => false,
                ],
                'followers_count' => $updatedFollowersCount,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error unfollowing user'], 500);
        }
    }

    /**
     * Get suggested/random users to follow
     */
    public function suggested(Request $request): JsonResponse
    {
        try {
            $authUser = Auth::user();
            $limit = min((int) $request->get('limit', 10), 50); // Cap at 50 users
            $filter = $request->get('filter'); // Get the filter parameter

            Log::info('Suggested users request', [
                'auth_user_id' => $authUser ? $authUser->id : null,
                'limit' => $limit,
                'filter' => $filter
            ]);

            $query = User::select(['id', 'username', 'name', 'profile_image', 'bio', 'is_professional'])
                ->whereNotNull('username')
                ->where('username', '!=', '');

            // Apply filter based on the filter parameter
            if ($filter === 'not_following' && $authUser) {
                try {
                    // Get following IDs safely - more explicit query
                    $followingIds = Follower::where('follower_id', $authUser->id)
                        ->where('is_active', true)
                        ->pluck('user_id')
                        ->toArray();

                    $followingIds[] = $authUser->id; // Also exclude self
                    $query->whereNotIn('id', $followingIds);

                    Log::info('Applied not_following filter', [
                        'following_ids' => $followingIds,
                        'excluded_count' => count($followingIds)
                    ]);
                } catch (\Exception $e) {
                    Log::warning('Error getting following relationships, proceeding without filtering', [
                        'error' => $e->getMessage()
                    ]);
                    // Just exclude self if following relationship fails
                    $query->where('id', '!=', $authUser->id);
                }
            } elseif ($authUser) {
                // If no specific filter but user is authenticated, at least exclude self
                $query->where('id', '!=', $authUser->id);
            }

            $users = $query->inRandomOrder()
                ->limit($limit)
                ->get()
                ->map(function ($user) use ($authUser) {
                    $isFollowing = false;
                    if ($authUser) {
                        try {
                            // More explicit check for following status
                            $isFollowing = Follower::where('user_id', $user->id)
                                ->where('follower_id', $authUser->id)
                                ->where('is_active', true)
                                ->exists();
                        } catch (\Exception $e) {
                            Log::warning('Error checking follow status', [
                                'error' => $e->getMessage(),
                                'user_id' => $user->id
                            ]);
                            $isFollowing = false;
                        }
                    }

                    // Use the stored followers_count from database
                    $followersCount = $user->followers_count ?? 0;

                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'name' => $user->name,
                        'avatar' => $user->profile_image ?? '/placeholder-user.jpg',
                        'bio' => $user->bio,
                        'is_professional' => $user->is_professional ?? false,
                        'is_following' => $isFollowing,
                        'followers_count' => $followersCount,
                    ];
                });

            Log::info('Suggested users fetched successfully', [
                'count' => $users->count()
            ]);

            return response()->json([
                'success' => true,
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching suggested users', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error fetching suggested users',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
