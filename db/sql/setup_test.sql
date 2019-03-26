CREATE DATABASE IF NOT EXISTS rv2projTest;
CREATE USER IF NOT EXISTS 'travis'@'localhost';
GRANT ALL ON rv2projTest.* to 'travis'@'localhost';
