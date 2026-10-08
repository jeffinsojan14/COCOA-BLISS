-- ==========================================================
-- Cocoa Bliss - Homemade Chocolates, Made with Love
-- Relational Database Setup Script for MySQL
-- ==========================================================

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS cocoa_bliss
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE cocoa_bliss;

-- 2. Verify Database Selection
SELECT DATABASE() AS current_database;

-- Note for Students / Evaluators:
-- When using MySQL, configure backend/.env:
--   DB_ENGINE=mysql
--   DB_NAME=cocoa_bliss
--   DB_USER=root
--   DB_PASSWORD=your_mysql_password
--   DB_HOST=127.0.0.1
--   DB_PORT=3306
--
-- Then run:
--   python manage.py makemigrations
--   python manage.py migrate
--   python manage.py seed_data
