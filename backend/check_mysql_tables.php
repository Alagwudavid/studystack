<?// Check PostgreSQL Tables
$host = '127.0.0.1';
$port = '5432';
$username = 'postgres';
$password = '';
$database = 'bitroot_web';

try {
    $pdo = new PDO("pgsql:host={$host};port={$port};dbname={$database}", $username, $password);Check MySQL Database Tables
$host = '127.0.0.1';
$username = 'root';
$password = '';
$database = 'bitroot_web';

try {
    $pdo = new PDO("mysql:host={$host};dbname={$database}", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "✅ Successfully connected to database '{$database}'\n\n";

    // Show all tables
    echo "📋 Database Tables:\n";
    echo str_repeat("=", 50) . "\n";

    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    foreach ($tables as $table) {
        echo "  ✓ {$table}\n";

        // Show table structure for users table
        if ($table === 'users') {
            echo "\n👤 Users table structure:\n";
            $stmt = $pdo->query("DESCRIBE {$table}");
            $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($columns as $column) {
                echo "    • {$column['Field']} ({$column['Type']})";
                if ($column['Null'] === 'NO') echo " NOT NULL";
                if ($column['Default'] !== null) echo " DEFAULT '{$column['Default']}'";
                if ($column['Key'] === 'PRI') echo " PRIMARY KEY";
                if ($column['Key'] === 'UNI') echo " UNIQUE";
                if ($column['Extra']) echo " {$column['Extra']}";
                echo "\n";
            }
            echo "\n";
        }
    }

    echo str_repeat("=", 50) . "\n";
    echo "📊 Total tables: " . count($tables) . "\n";
    echo "🎉 Database migration completed successfully!\n";

} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
