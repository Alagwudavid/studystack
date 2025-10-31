<?php

require_once __DIR__ . '/vendor/autoload.php';

// Load Laravel application
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    // Count existing notifications
    $count = DB::table('notifications')->count();
    echo "Found {$count} notifications in the database.\n";
    
    if ($count > 0) {
        // Show all notifications
        $notifications = DB::table('notifications')
            ->select('id', 'type', 'title', 'message', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
            
        echo "\nAll notifications:\n";
        echo str_repeat('-', 80) . "\n";
        foreach ($notifications as $notification) {
            echo "ID: {$notification->id}\n";
            echo "Type: {$notification->type}\n";
            echo "Title: {$notification->title}\n";
            echo "Message: " . substr($notification->message, 0, 50) . "...\n";
            echo "Created: {$notification->created_at}\n";
            echo str_repeat('-', 80) . "\n";
        }
        
        // Delete all notifications
        echo "\nDeleting all notifications...\n";
        $deleted = DB::table('notifications')->delete();
        echo "Successfully deleted {$deleted} notifications.\n";
        
        // Verify deletion
        $remaining = DB::table('notifications')->count();
        echo "Notifications remaining: {$remaining}\n";
        
    } else {
        echo "No notifications found in the database.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
