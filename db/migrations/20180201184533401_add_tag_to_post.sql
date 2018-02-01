-- +micrate Up
ALTER TABLE posts ADD COLUMN tag_id BIGINT;

CREATE INDEX post_tag_id_idx ON posts (tag_id);
-- SQL in section 'Up' is executed when this migration is applied

-- +micrate Down
ALTER TABLE posts DROP COLUMN tag_id;
-- SQL section 'Down' is executed when this migration is rolled back
