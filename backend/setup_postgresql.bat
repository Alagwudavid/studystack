@echo off
echo ================================
echo PostgreSQL Setup for Bitroot
echo ================================
echo.

echo Checking current PHP configuration...
php -v
echo.

echo Current PHP extensions:
php -m | findstr -i sql
echo.

echo ================================
echo PostgreSQL Installation Options:
echo ================================
echo.
echo 1. MANUAL INSTALLATION:
echo    - Download PostgreSQL from: https://www.postgresql.org/download/windows/
echo    - During installation, set password for 'postgres' user to 'password'
echo    - Ensure PostgreSQL service starts automatically
echo    - Default port should be 5432
echo.
echo 2. ENABLE PHP POSTGRESQL EXTENSION:
echo    - Locate your php.ini file
echo    - Uncomment or add: extension=pdo_pgsql
echo    - Restart your web server
echo.
echo 3. ALTERNATIVE - Use SQLite (simpler setup):
echo    - SQLite requires no server installation
echo    - Good for development environments
echo    - Files are stored locally
echo.

echo ================================
echo Quick Tests:
echo ================================

echo Testing PostgreSQL connection...
php backend/test_postgresql.php
echo.

echo Testing PHP PDO drivers...
php -r "print_r(PDO::getAvailableDrivers());"
echo.

echo ================================
echo Next Steps:
echo ================================
echo 1. If PostgreSQL connection failed, install PostgreSQL first
echo 2. Ensure php_pdo_pgsql.dll is enabled in php.ini
echo 3. Run: php artisan migrate
echo.

pause
