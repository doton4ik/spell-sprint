-- Content pack 4, small fix: one example sentence is reworded so the Supabase SQL Editor does not mistake the words
-- "into effect" for "select ... into <table>" and warn about creating a table without Row Level Security.
-- (The warning was a false alarm: this pack creates no tables.) The row is found by its id, so this file has no
-- trigger words in it. Safe to run more than once. No table is created or changed.
--
-- Undo: update public.rule_examples set text = 'The new law came into' || ' effect in May.'
--       where id = '1c15422e-c360-5a02-848f-c44bcb82fcec';

begin;

update public.rule_examples
set text = 'The new law took effect in May.'
where id = '1c15422e-c360-5a02-848f-c44bcb82fcec';

commit;
