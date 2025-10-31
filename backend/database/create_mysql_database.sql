-- Create the bitroot_web database
CREATE DATABASE IF NOT EXISTS bitroot_web;

-- Use the database
USE bitroot_web;

-- Grant all privileges to the root user (for development only)
GRANT ALL PRIVILEGES ON bitroot_web.* TO 'root'@'localhost';

-- Optional: Create a dedicated user for the application (recommended for production)
-- CREATE USER 'bitroot_user'@'localhost' IDENTIFIED BY 'your_password_here';
-- GRANT ALL PRIVILEGES ON bitroot_web.* TO 'bitroot_user'@'localhost';

-- Flush privileges to ensure all changes take effect
FLUSH PRIVILEGES;

-- Show that the database was created successfully
SHOW DATABASES LIKE 'bitroot_web';
