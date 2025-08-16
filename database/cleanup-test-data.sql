-- Cleanup script to delete all data from the blog database
-- This script removes all data while preserving the table structure
-- Order matters due to foreign key constraints

-- Disable foreign key checks (if needed for your database)
-- For PostgreSQL, we'll delete in the correct order instead

-- Delete data from junction tables first
DELETE FROM article_tags;

-- Delete dependent data
DELETE FROM comments;

-- Delete main entities
DELETE FROM articles;
DELETE FROM tags;
DELETE FROM users;

-- Vacuum and analyze (PostgreSQL optimization)
VACUUM ANALYZE;

-- Confirm cleanup
SELECT 
    'users' as table_name, COUNT(*) as remaining_records FROM users
UNION ALL
SELECT 
    'articles' as table_name, COUNT(*) as remaining_records FROM articles
UNION ALL
SELECT 
    'comments' as table_name, COUNT(*) as remaining_records FROM comments
UNION ALL
SELECT 
    'tags' as table_name, COUNT(*) as remaining_records FROM tags
UNION ALL
SELECT 
    'article_tags' as table_name, COUNT(*) as remaining_records FROM article_tags;