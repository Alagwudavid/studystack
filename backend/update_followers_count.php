<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

echo "Updating followers count for all users...\n";

$users = User::all();
echo "Found " . $users->count() . " users\n";

foreach ($users as $user) {
    $oldCount = $user->followers_count ?? 0;
    $user->updateFollowersCount();
    $newCount = $user->fresh()->followers_count;
    echo "User {$user->username}: {$oldCount} -> {$newCount}\n";
}

echo "Done!\n";
