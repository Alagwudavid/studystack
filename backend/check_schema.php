<?php

// Check Database Schema
$host = '127.0.0.1';
$port = '5432';
$username = 'postgres';
$password = '';
$database = 'bitroot_web';

try {
    $pdo = new PDO("pgsql:host={$host};port={$port};dbname={$database}", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "🔍 Checking database schema for users table...\n\n";

    // Get table structure (PostgreSQL way)
    $stmt = $pdo->query("SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'public' ORDER BY ordinal_position");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "📋 Users table schema:\n";
    echo str_repeat("=", 80) . "\n";
    printf("%-20s %-20s %-8s %-10s %-15s %s\n", 'Field', 'Type', 'Null', 'Key', 'Default', 'Extra');
    echo str_repeat("-", 80) . "\n";

    foreach ($columns as $column) {
        printf("%-20s %-20s %-8s %-10s %-15s %s\n",
            $column['Field'],
            $column['Type'],
            $column['Null'],
            $column['Key'],
            $column['Default'] ?: '[NULL]',
            $column['Extra']
        );
    }

    echo str_repeat("=", 80) . "\n";

    // Check for any duplicate columns
    $bioColumns = array_filter($columns, function($col) {
        return $col['Field'] === 'bio';
    });

    if (count($bioColumns) > 1) {
        echo "⚠️  WARNING: Multiple 'bio' columns found!\n";
        foreach ($bioColumns as $col) {
            print_r($col);
        }
    } else {
        echo "✅ Single 'bio' column found with correct structure.\n";
        $bioCol = reset($bioColumns);
        echo "   Type: {$bioCol['Type']}, Null: {$bioCol['Null']}, Default: " . ($bioCol['Default'] ?: '[NULL]') . "\n";
    }

    // Show actual data with column info
    echo "\n📊 Sample data from users table:\n";
    $stmt = $pdo->query("SELECT id, name, email, bio, created_at, updated_at FROM users LIMIT 5");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($users as $user) {
        echo "\nUser ID: {$user['id']}\n";
        echo "  Name: {$user['name']}\n";
        echo "  Email: {$user['email']}\n";
        echo "  Bio: " . ($user['bio'] === null ? '[NULL]' : "'{$user['bio']}'") . "\n";
        echo "  Created: {$user['created_at']}\n";
        echo "  Updated: {$user['updated_at']}\n";
    }

} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
