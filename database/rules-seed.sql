-- Seeds the starter rules from database/rules-import/*.csv directly via SQL,
-- so rule_examples / rule_word_links link to rules.id by slug (no CSV uuid mismatch).
-- Run this in the Supabase SQL Editor AFTER rules-schema.sql.
-- Safe to run more than once: every insert is guarded so it never creates duplicates.

-- 1. Rules themselves (unique on slug, so this line alone is already safe to re-run).
insert into public.rules (slug, title, category, rule_type, short_explanation, tts_text, mnemonic, source, visibility, is_active)
values
  ('double-consonants', 'Double consonants', 'double_consonants', 'language_rule', 'Some common words need doubled letters. Learn the whole visual pattern instead of relying only on sound.', 'Double consonants', 'Tomorrow has a double r; useful has one l.', 'built-in', 'public', true),
  ('vowel-order-ei-ie', 'Vowel order: i and e', 'vowels_and_letter_patterns', 'exception', 'The order of i and e changes the spelling of a word. After c, most words use ei.', 'Vowel order i and e', 'After c, use ei: receive.', 'built-in', 'public', true),
  ('lose-vs-loose', 'Lose vs loose', 'confusing_words', 'confusing_words', 'Lose is a verb meaning to not have something anymore. Loose is an adjective meaning not tight.', 'Lose versus loose', 'One O in lose, like losing one letter.', 'built-in', 'public', true),
  ('plural-y-to-ies', 'Plural: y becomes ies', 'plural_forms', 'language_rule', 'When a noun ends in a consonant plus y, change y to i and add es to form the plural.', 'Plural y to ies', 'Company to companies; one lonely y turns into two i''s.', 'built-in', 'public', true),
  ('irregular-past-go', 'Irregular past: go / went', 'irregular_forms_and_exceptions', 'exception', 'Go does not take -ed in the past tense. Its past form is the irregular word went.', 'Irregular past of go', 'Go, went, gone — learn the whole set together.', 'built-in', 'public', true)
on conflict (slug) do nothing;

-- 2. Examples, matched to the rule above by slug.
insert into public.rule_examples (rule_id, example_type, text, correction, note)
select r.id, v.example_type, v.text, v.correction, v.note
from (values
  ('double-consonants', 'incorrect', 'tomorow', 'tomorrow', 'Missing the second r'),
  ('double-consonants', 'correct', 'beginning', null, 'Double n before -ing'),
  ('double-consonants', 'correct', 'recommended', null, 'Double m'),
  ('vowel-order-ei-ie', 'incorrect', 'recieve', 'receive', 'ei after c'),
  ('vowel-order-ei-ie', 'correct', 'believe', null, 'ie after b, not after c'),
  ('vowel-order-ei-ie', 'exception', 'seize', null, 'Common exception: ei even though not after c'),
  ('lose-vs-loose', 'incorrect', 'I don''t want to loose my keys.', 'I don''t want to lose my keys.', 'loose used instead of lose'),
  ('lose-vs-loose', 'correct', 'These jeans are too loose.', null, 'loose is the adjective'),
  ('plural-y-to-ies', 'incorrect', 'companys', 'companies', 'y kept instead of changing to ies'),
  ('plural-y-to-ies', 'correct', 'delivery -> deliveries', null, 'Standard pattern'),
  ('irregular-past-go', 'incorrect', 'We goed to the warehouse.', 'We went to the warehouse.', 'Regular -ed added to an irregular verb'),
  ('irregular-past-go', 'correct', 'She went to the meeting.', null, 'Correct irregular past form')
) as v(slug, example_type, text, correction, note)
join public.rules r on r.slug = v.slug
where not exists (
  select 1 from public.rule_examples e where e.rule_id = r.id and e.text = v.text and e.example_type = v.example_type
);

-- 3. Word links, matched to the rule above by slug.
-- word_id values must be real, stable LibraryWord.wordId values from this app's word libraries —
-- adjust them if these exact ids do not exist in your library before relying on auto-matching.
insert into public.rule_word_links (rule_id, word_id, relation, note)
select r.id, v.word_id, v.relation, v.note
from (values
  ('vowel-order-ei-ie', 'general-english-active-vocabulary-receive', 'primary', 'Core example word for this rule'),
  ('double-consonants', 'general-english-active-vocabulary-recommended', 'primary', 'Contains the doubled consonant pattern'),
  ('plural-y-to-ies', 'warehouse-operations-inventory-control-company', 'primary', 'Plural pattern example'),
  ('irregular-past-go', 'general-english-active-vocabulary-go', 'primary', 'Irregular verb itself'),
  ('lose-vs-loose', 'general-english-active-vocabulary-lose', 'primary', 'One of the two confusable words'),
  ('lose-vs-loose', 'general-english-active-vocabulary-loose', 'related', 'The other confusable word')
) as v(slug, word_id, relation, note)
join public.rules r on r.slug = v.slug
where not exists (
  select 1 from public.rule_word_links w where w.rule_id = r.id and w.word_id = v.word_id
);
