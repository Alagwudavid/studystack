<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Load Laravel application
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    // Count existing notifications
    $count = DB::table('notifications')->count();
    echo "Found {$count} notifications in the database.\n";
    
    if ($count > 0) {
        // Show some sample notifications
        $samples = DB::table('notifications')
            ->select('id', 'type', 'title', 'created_at')
            ->limit(5)
            ->get();
            
        echo "\nSample notifications:\n";
        foreach ($samples as $notification) {
            echo "ID: {$notification->id}, Type: {$notification->type}, Title: {$notification->title}, Created: {$notification->created_at}\n";
        }
        
        // Ask for confirmation
        echo "\nDo you want to delete ALL notifications? (y/N): ";
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        fclose($handle);
        
        if (trim(strtolower($line)) === 'y') {
            // Delete all notifications
            $deleted = DB::table('notifications')->delete();
            echo "Successfully deleted {$deleted} notifications.\n";
        } else {
            echo "Operation cancelled.\n";
        }
    } else {
        echo "No notifications to delete.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
