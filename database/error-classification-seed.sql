-- Starter data for automatic mistake classification. Run in the Supabase SQL Editor AFTER
-- error-classification-schema.sql (and after rules-schema.sql / rules-seed.sql).
-- Safe to run more than once: every insert is guarded against duplicates.

-- 1. The 22 error patterns (7 technical + 15 learning).
insert into public.error_patterns (slug, tier, label, description) values
  ('missing_letter', 'technical', 'Missing letter', 'A letter of the correct word was left out.'),
  ('extra_letter', 'technical', 'Extra letter', 'A letter was added that is not in the correct word.'),
  ('letter_substitution', 'technical', 'Letter substitution', 'One letter was written instead of another.'),
  ('letter_transposition', 'technical', 'Letter transposition', 'Two neighbouring letters were swapped.'),
  ('multiple_edits', 'technical', 'Multiple edits', 'More than one letter-level change was needed.'),
  ('wrong_word', 'technical', 'Wrong word', 'The answer is a different word (or phrase) altogether.'),
  ('blank_answer', 'technical', 'Blank answer', 'No answer was given.'),
  ('missing_double_consonant', 'learning', 'Missing double consonant', 'A doubled consonant was written as a single letter (tomorow → tomorrow).'),
  ('extra_double_consonant', 'learning', 'Extra double consonant', 'A consonant was doubled where it should be single (reccommend → recommend).'),
  ('missing_vowel', 'learning', 'Missing vowel', 'A vowel was left out.'),
  ('extra_vowel', 'learning', 'Extra vowel', 'An extra vowel was added.'),
  ('vowel_substitution', 'learning', 'Vowel substitution', 'One vowel was written instead of another (definately → definitely).'),
  ('vowel_order', 'learning', 'Vowel order', 'Two vowels were written in the wrong order (recieve → receive).'),
  ('silent_letter', 'learning', 'Silent letter', 'A letter that is written but not pronounced was left out (nowledge → knowledge).'),
  ('suffix_error', 'learning', 'Suffix error', 'The mistake is inside a word ending such as -tion, -able, -ment.'),
  ('prefix_error', 'learning', 'Prefix error', 'The mistake is inside a word beginning such as un-, dis-, inter-.'),
  ('verb_ending_error', 'learning', 'Verb ending error', 'The mistake is in -ing, -ed, -s, -es or -ies on a verb.'),
  ('plural_ending_error', 'learning', 'Plural ending error', 'The mistake is in a plural ending (companys → companies).'),
  ('grammar_rule_error', 'learning', 'Grammar rule error', 'A sentence-level grammar mistake, not a spelling one.'),
  ('confusing_words_error', 'learning', 'Confusing words', 'A real word was used in place of a similar one (their / there).'),
  ('phonetic_spelling', 'learning', 'Phonetic spelling', 'The word was spelled the way it sounds (a weak, low-confidence guess).'),
  ('unclassified', 'learning', 'Unclassified', 'No confident learning pattern was found; can be linked to a rule by hand.')
on conflict (slug) do nothing;

-- 2. Confusing-word rules. The words that are mixed up live on the rule itself
--    (metadata.confusable_words), so adding a pair later is a data change, not a code change.
update public.rules
set metadata = metadata || '{"confusable_words": ["lose", "loose"]}'::jsonb
where slug = 'lose-vs-loose' and not (metadata ? 'confusable_words');

insert into public.rules (slug, title, category, rule_type, short_explanation, tts_text, mnemonic, source, visibility, is_active, metadata) values
  ('there-vs-their', 'There vs their vs they''re', 'confusing_words', 'confusing_words',
   'There points to a place or starts a sentence (there is). Their shows that something belongs to them. They''re is short for they are.',
   'There, their, and they are', 'Their has "heir" in it: it belongs to someone.', 'built-in', 'public', true,
   '{"confusable_words": ["there", "their", "they''re"]}'::jsonb),
  ('its-vs-its-contraction', 'Its vs it''s', 'confusing_words', 'confusing_words',
   'Its (no apostrophe) shows that something belongs to it. It''s is short for it is or it has.',
   'Its versus it is', 'If you can say "it is", use it''s.', 'built-in', 'public', true,
   '{"confusable_words": ["its", "it''s"]}'::jsonb),
  ('your-vs-youre', 'Your vs you''re', 'confusing_words', 'confusing_words',
   'Your shows that something belongs to you. You''re is short for you are.',
   'Your versus you are', 'If you can say "you are", use you''re.', 'built-in', 'public', true,
   '{"confusable_words": ["your", "you''re"]}'::jsonb),
  ('affect-vs-effect', 'Affect vs effect', 'confusing_words', 'confusing_words',
   'Affect is usually a verb meaning to influence something. Effect is usually a noun meaning the result.',
   'Affect versus effect', 'Affect = Action, Effect = End result.', 'built-in', 'public', true,
   '{"confusable_words": ["affect", "effect"]}'::jsonb)
on conflict (slug) do nothing;

insert into public.rule_examples (rule_id, example_type, text, correction, note)
select r.id, v.example_type, v.text, v.correction, v.note
from (values
  ('there-vs-their', 'incorrect', 'Their is a meeting at noon.', 'There is a meeting at noon.', 'their used instead of there'),
  ('there-vs-their', 'correct', 'Their truck arrived late.', null, 'their = belonging to them'),
  ('its-vs-its-contraction', 'incorrect', 'The company changed it''s name.', 'The company changed its name.', 'it''s means it is'),
  ('its-vs-its-contraction', 'correct', 'It''s a large warehouse.', null, 'it''s = it is'),
  ('your-vs-youre', 'incorrect', 'Your welcome.', 'You''re welcome.', 'you''re = you are'),
  ('your-vs-youre', 'correct', 'Your invoice is ready.', null, 'your = belonging to you'),
  ('affect-vs-effect', 'incorrect', 'The delay will effect the delivery.', 'The delay will affect the delivery.', 'verb needed: affect'),
  ('affect-vs-effect', 'correct', 'The delay had a big effect.', null, 'noun: effect')
) as v(slug, example_type, text, correction, note)
join public.rules r on r.slug = v.slug
where not exists (select 1 from public.rule_examples e where e.rule_id = r.id and e.text = v.text and e.example_type = v.example_type);

insert into public.rule_exercises (rule_id, exercise_type, prompt, answer)
select r.id, v.exercise_type, v.prompt, v.answer
from (values
  ('there-vs-their', 'fill_gap', '___ truck arrived late.', 'their'),
  ('its-vs-its-contraction', 'fill_gap', 'The company changed ___ name.', 'its'),
  ('your-vs-youre', 'fill_gap', '___ welcome.', 'you''re'),
  ('affect-vs-effect', 'fill_gap', 'The delay will ___ the delivery.', 'affect')
) as v(slug, exercise_type, prompt, answer)
join public.rules r on r.slug = v.slug
where not exists (select 1 from public.rule_exercises e where e.rule_id = r.id and e.prompt = v.prompt);

-- 3. Initial pattern -> rule links. Add more rows here as you write more rules.
insert into public.error_pattern_rule_links (error_pattern_id, rule_id, note)
select p.id, r.id, v.note
from (values
  ('missing_double_consonant', 'double-consonants', 'Doubled consonants'),
  ('extra_double_consonant', 'double-consonants', 'Doubled consonants'),
  ('vowel_order', 'vowel-order-ei-ie', 'i / e order'),
  ('plural_ending_error', 'plural-y-to-ies', 'Only the y → ies case is confident enough to link')
) as v(pattern_slug, rule_slug, note)
join public.error_patterns p on p.slug = v.pattern_slug
join public.rules r on r.slug = v.rule_slug
on conflict (error_pattern_id, rule_id) do nothing;
