<?php
require_once 'bootstrap/app.php';

use Illuminate\Support\Facades\DB;

$users = DB::table('users')
    ->select('id', 'email', 'uuid', 'username')
    ->get();

echo "Updated Users:\n";
echo str_repeat("-", 80) . "\n";
printf("%-4s %-35s %-38s %-20s\n", "ID", "Email", "UUID", "Username");
echo str_repeat("-", 80) . "\n";

foreach ($users as $user) {
    printf("%-4s %-35s %-38s %-20s\n", 
        $user->id, 
        $user->email, 
        $user->uuid, 
        $user->username
    );
}

echo "\nTotal users: " . $users->count() . "\n";
