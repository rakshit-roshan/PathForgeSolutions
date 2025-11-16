-- PostgreSQL Database Setup Script
-- Run this script to create the database and user for the application
-- Usage: psql -U postgres -f setup-database.sql

-- Create database
CREATE DATABASE mainfolder_db;

-- Connect to the new database
\c mainfolder_db

-- Create application user (optional - you can use postgres user instead)
-- Uncomment the following lines if you want a dedicated user:
-- CREATE USER mainfolder_user WITH PASSWORD 'change_this_password';
-- GRANT ALL PRIVILEGES ON DATABASE mainfolder_db TO mainfolder_user;
-- GRANT ALL PRIVILEGES ON SCHEMA public TO mainfolder_user;

-- Verify database creation
SELECT datname FROM pg_database WHERE datname = 'mainfolder_db';

-- Display success message
\echo 'Database mainfolder_db created successfully!'
\echo 'You can now run the Spring Boot application.'

