<?php

// Simple script to update followers count
// Run this once to initialize all users' followers_count

require_once 'vendor/autoload.php';

try {
    $app = require_once 'bootstrap/app.php';
    $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

    echo "Initializing followers count for all users...\n";

    // Use raw SQL to update followers count
    $pdo = \Illuminate\Support\Facades\DB::connection()->getPdo();

    // Update followers_count for all users
    $sql = "
        UPDATE users
        SET followers_count = (
            SELECT COUNT(*)
            FROM followers
            WHERE followers.user_id = users.id
            AND followers.is_active = 1
        )
    ";

    $result = $pdo->exec($sql);
    echo "Updated {$result} users' followers count.\n";

    // Show some sample results
    $users = $pdo->query("SELECT id, name, username, followers_count FROM users LIMIT 5")->fetchAll();
    echo "\nSample results:\n";
    foreach ($users as $user) {
        echo "User {$user['name']} (@{$user['username']}): {$user['followers_count']} followers\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "Done!\n";
