$users = \DB::table('users')->select('id', 'email', 'uuid', 'username')->get();
foreach ($users as $user) {
    echo "ID: {$user->id}, Email: {$user->email}, UUID: {$user->uuid}, Username: {$user->username}\n";
}
echo "Total users: " . $users->count() . "\n";
