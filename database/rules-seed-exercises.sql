-- Adds a few starter mini-practice exercises so Phase 2 (rule practice logic) can be tested
-- end to end. Safe to run more than once — every insert is guarded against duplicates.
-- Run this in the Supabase SQL Editor after rules-schema.sql and rules-seed.sql.

insert into public.rule_exercises (rule_id, exercise_type, prompt, answer, choices)
select r.id, v.exercise_type, v.prompt, v.answer, v.choices::jsonb
from (values
  ('double-consonants', 'spell', 'Spell the word: the day after today.', 'tomorrow', null),
  ('double-consonants', 'correct_word', 'tomorow', 'tomorrow', null),
  ('vowel-order-ei-ie', 'spell', 'Spell the word: to get something that is sent to you.', 'receive', null),
  ('vowel-order-ei-ie', 'correct_word', 'recieve', 'receive', null),
  ('lose-vs-loose', 'fill_gap', 'These jeans are too ___ for me.', 'loose', null),
  ('lose-vs-loose', 'fill_gap', 'Please do not ___ your keys again.', 'lose', null),
  ('plural-y-to-ies', 'spell', 'Spell the plural of "company".', 'companies', null),
  ('irregular-past-go', 'fill_gap', 'Yesterday we ___ to the warehouse.', 'went', null)
) as v(slug, exercise_type, prompt, answer, choices)
join public.rules r on r.slug = v.slug
where not exists (
  select 1 from public.rule_exercises e where e.rule_id = r.id and e.prompt = v.prompt
);
