<?php

/**
 * Test session creation to identify missing database columns
 */

// Set up basic includes for Laravel
$basePath = __DIR__ . '/../..';
require_once $basePath . '/vendor/autoload.php';

// Load Laravel app
$app = require_once $basePath . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Testing Session Creation - Database Column Check\n";
echo str_repeat("=", 50) . "\n\n";

try {
    // First, get or create a test user
    echo "0. Ensuring test user exists:\n";
    $testUser = DB::table('users')->where('email', 'test@example.com')->first();
    if (!$testUser) {
        $userId = DB::table('users')->insertGetId([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "✓ Created test user with ID: {$userId}\n";
    } else {
        $userId = $testUser->id;
        echo "✓ Using existing test user with ID: {$userId}\n";
    }

    // First, let's check what columns exist in user_sessions
    echo "1. Checking user_sessions table structure:\n";
    $columns = DB::select("SELECT column_name as field, data_type as type FROM information_schema.columns WHERE table_name = 'user_sessions' AND table_schema = 'public'");

    echo "Existing columns:\n";
    foreach ($columns as $column) {
        echo "   {$column->field} ({$column->type})\n";
    }

    echo "\n2. Attempting to create a test session record:\n";

    // Try to insert a basic session record with all the fields we expect
    $sessionData = [
        'user_id' => $userId,
        'device_id' => 'test_device_123',
        'session_token' => 'test_session_token',
        'device_name' => 'Test Device',
        'device_type' => 'desktop',
        'browser' => 'Chrome',
        'browser_version' => '120.0.0.0',
        'operating_system' => 'Windows',
        'os_version' => '10',
        'ip_address' => '8.8.8.8',
        'location' => 'Test Location',
        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'user_preferences' => json_encode(['language' => 'en-US']),
        'status' => 'online',
        'is_active' => true,
        'logged_in_at' => now(),
        'last_activity_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ];

    // Check which fields don't exist
    $existingColumns = array_column($columns, 'field');
    $missingColumns = [];

    foreach (array_keys($sessionData) as $field) {
        if (!in_array($field, $existingColumns)) {
            $missingColumns[] = $field;
        }
    }

    if (!empty($missingColumns)) {
        echo "Missing columns that need to be added:\n";
        foreach ($missingColumns as $column) {
            echo "   - {$column}\n";
        }

        // Try to insert only with existing columns
        $validSessionData = [];
        foreach ($sessionData as $key => $value) {
            if (in_array($key, $existingColumns)) {
                $validSessionData[$key] = $value;
            }
        }

        echo "\nAttempting insertion with existing columns only:\n";
        $sessionId = DB::table('user_sessions')->insertGetId($validSessionData);
        echo "✓ Session created with ID: {$sessionId}\n";

        // Clean up the test session
        DB::table('user_sessions')->where('id', $sessionId)->delete();
        echo "✓ Test session cleaned up\n";

    } else {
        echo "All required columns exist, attempting full insertion:\n";
        $sessionId = DB::table('user_sessions')->insertGetId($sessionData);
        echo "✓ Session created with ID: {$sessionId}\n";

        // Clean up the test session
        DB::table('user_sessions')->where('id', $sessionId)->delete();
        echo "✓ Test session cleaned up\n";
    }

    echo "\n3. Checking device fingerprinting tables:\n";

    // Check if our new tables exist
    $tables = ['user_devices', 'device_fingerprints', 'device_session_events'];
    foreach ($tables as $table) {
        try {
            $count = DB::table($table)->count();
            echo "✓ {$table} exists (has {$count} records)\n";
        } catch (Exception $e) {
            echo "✗ {$table} does not exist: " . $e->getMessage() . "\n";
        }
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "Database structure check completed!\n";
