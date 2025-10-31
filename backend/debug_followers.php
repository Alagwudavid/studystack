<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Follower;

echo "=== Debugging Followers Count Issue ===\n\n";

// Get a user to test with
$user = User::first();
if (!$user) {
    echo "No users found in database.\n";
    exit;
}

echo "Testing with user: {$user->name} (ID: {$user->id})\n";
echo "Current followers_count in DB: {$user->followers_count}\n";

// Check followers relationship
echo "\n--- Checking followers relationship ---\n";
$followersFromRelation = $user->followers()->count();
echo "Followers from relationship: {$followersFromRelation}\n";

// Check direct query
$followersFromDirectQuery = Follower::where('user_id', $user->id)
    ->where('is_active', true)
    ->count();
echo "Followers from direct query: {$followersFromDirectQuery}\n";

// Show actual follower records
echo "\n--- Actual follower records ---\n";
$followers = Follower::where('user_id', $user->id)->get();
foreach ($followers as $follower) {
    $followerUser = User::find($follower->follower_id);
    echo "Follower: {$followerUser->name} | Active: " . ($follower->is_active ? 'Yes' : 'No') . " | Date: {$follower->date_followed}\n";
}

// Try updating the count
echo "\n--- Updating followers count ---\n";
$newCount = $user->updateFollowersCount();
echo "Updated count: {$newCount}\n";

// Check the stored value
$user->refresh();
echo "Stored followers_count after update: {$user->followers_count}\n";

// Test with all users
echo "\n--- Testing all users ---\n";
$users = User::limit(5)->get();
foreach ($users as $u) {
    $oldCount = $u->followers_count;
    $newCount = $u->updateFollowersCount();
    $u->refresh();
    echo "User {$u->name}: Old={$oldCount}, Calculated={$newCount}, Stored={$u->followers_count}\n";
}

echo "\nDone!\n";
