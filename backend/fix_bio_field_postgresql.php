<?php

// Fix Bio Field Type
$host = '127.0.0.1';
$port = '5432';
$username = 'postgres';
$password = '';
$database = 'bitroot_web';

try {
    $pdo = new PDO("pgsql:host={$host};port={$port};dbname={$database}", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "🔍 Checking bio field issues...\n\n";

    // Check current bio values
    $stmt = $pdo->query("SELECT id, name, email, bio, created_at, updated_at FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "📋 Current user bio values:\n";
    echo str_repeat("=", 80) . "\n";

    $issuesFound = 0;
    foreach ($users as $user) {
        echo "ID: {$user['id']} | Name: {$user['name']} | Email: {$user['email']}\n";
        echo "Bio: " . ($user['bio'] ?: '[NULL]') . "\n";
        echo "Created: {$user['created_at']} | Updated: {$user['updated_at']}\n";

        // Check if bio contains timestamp-like data
        if ($user['bio'] && preg_match('/^\d{4}-\d{2}-\d{2}/', $user['bio'])) {
            echo "⚠️  ISSUE: Bio contains timestamp-like data!\n";
            $issuesFound++;
        }

        echo str_repeat("-", 80) . "\n";
    }

    if ($issuesFound > 0) {
        echo "\n❌ Found {$issuesFound} users with timestamp data in bio field.\n";
        echo "🔧 Would you like to clean this up? (y/n): ";

        $handle = fopen("php://stdin", "r");
        $choice = trim(fgets($handle));

        if (strtolower($choice) === 'y' || strtolower($choice) === 'yes') {
            // Clean up bio fields that contain timestamp-like data (PostgreSQL pattern matching)
            $stmt = $pdo->prepare("UPDATE users SET bio = NULL WHERE bio ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'");
            $result = $stmt->execute();

            if ($result) {
                echo "✅ Successfully cleaned bio fields!\n";

                // Show updated data
                echo "\n📋 Updated user bio values:\n";
                $stmt = $pdo->query("SELECT id, name, email, bio FROM users");
                $updatedUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($updatedUsers as $user) {
                    echo "ID: {$user['id']} | Bio: " . ($user['bio'] ?: '[NULL]') . "\n";
                }
            } else {
                echo "❌ Failed to clean bio fields.\n";
            }
        } else {
            echo "👍 Skipping cleanup.\n";
        }
    } else {
        echo "✅ No bio field issues found!\n";
    }

} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
