#!/bin/bash

# Vercel build script for Laravel backend

echo "Starting Laravel build process..."

# Install Composer dependencies
composer install --no-dev --optimize-autoloader

# Create storage symlink if it doesn't exist
if [ ! -L public/storage ]; then
    php artisan storage:link
fi

# Create SQLite database file if it doesn't exist
touch database/database.sqlite

# Run migrations
php artisan migrate --force

# Clear and cache config for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel build completed successfully!"
