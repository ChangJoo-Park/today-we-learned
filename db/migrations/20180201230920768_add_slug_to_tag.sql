-- +micrate Up
ALTER TABLE tags ADD COLUMN slug VARCHAR;
-- SQL in section 'Up' is executed when this migration is applied

-- +micrate Down
ALTER TABLE tags DROP COLUMN slug;
-- SQL section 'Down' is executed when this migration is rolled back
