-- Migration: Add salary column to jobs table
-- Description: Replaces hardcoded random salaries in the UI with a real database column

ALTER TABLE jobs
ADD COLUMN salary TEXT DEFAULT 'NOT DISCLOSED';

-- Optional: If you want to update existing rows with some random or default values, 
-- you can do so here. Otherwise, they will all default to 'NOT DISCLOSED'.
-- Example update for existing data:
-- UPDATE jobs SET salary = '5 LPA - 7 LPA' WHERE id % 2 = 0;
-- UPDATE jobs SET salary = '8 LPA - 12 LPA' WHERE id % 2 != 0;
