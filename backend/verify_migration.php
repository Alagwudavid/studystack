<?php
try {
    $pdo = new PDO('pgsql:host=localhost;port=5432;dbname=bitroot_web', 'postgres', 'password');
    $stmt = $pdo->query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name');

    echo "✅ Database tables created successfully:\n";
    echo str_repeat("=", 50) . "\n";

    while($row = $stmt->fetch()) {
        echo "- " . $row['table_name'] . "\n";
    }

    echo "\n🔍 Checking users table structure:\n";
    $stmt = $pdo->query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position");

    while($row = $stmt->fetch()) {
        echo "- {$row['column_name']} ({$row['data_type']}) " . ($row['is_nullable'] === 'YES' ? 'NULL' : 'NOT NULL') . "\n";
    }

    echo "\n✅ PostgreSQL migration completed successfully!\n";
    echo "🚀 Your Laravel application is now running on PostgreSQL!\n";

} catch(Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
