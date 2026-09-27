-- Spell Sprint content pack 2 — part 1 of 4: new rules.
-- Run the parts in order (1 → 4). Each part is safe to run again.
begin;

-- New built-in rules.
insert into public.rules (slug, title, category, rule_type, short_explanation, tts_text, mnemonic, source, visibility, is_active, metadata)
select v.slug, v.title, v.category, v.rule_type, v.short_explanation, v.tts_text, v.mnemonic, 'built-in', 'public', true, v.metadata::jsonb
from (values
  ('advice-vs-advise', 'Advice or advise', 'confusing_words', 'confusing_words', 'Advice is a noun for a suggestion. Advise is a verb meaning to give a suggestion.', 'Listen and choose the correct form.', 'Advice is a thing; advise is an action.', '{"confusable_words": ["advice", "advise"]}'),
  ('accept-vs-except', 'Accept or except', 'confusing_words', 'confusing_words', 'Accept means to agree to take something. Except means not including.', 'Listen and choose the correct form.', 'Accept an offer; except one item.', '{"confusable_words": ["accept", "except"]}'),
  ('then-vs-than', 'Then or than', 'confusing_words', 'confusing_words', 'Then refers to time or the next step. Than is used when comparing things.', 'Listen and choose the correct form.', 'Then is time; than compares.', '{"confusable_words": ["then", "than"]}'),
  ('quiet-vs-quite', 'Quiet or quite', 'confusing_words', 'confusing_words', 'Quiet means making little noise. Quite means fairly or rather.', 'Listen and choose the correct form.', 'Quiet sounds soft; quite means fairly.', '{"confusable_words": ["quiet", "quite"]}'),
  ('weather-vs-whether', 'Weather or whether', 'confusing_words', 'confusing_words', 'Weather is the condition outside. Whether introduces a question or a choice.', 'Listen and choose the correct form.', 'Weather is outside; whether is a choice.', '{"confusable_words": ["weather", "whether"]}'),
  ('principal-vs-principle', 'Principal or principle', 'confusing_words', 'confusing_words', 'Principal means main or a head teacher. Principle is a basic belief or rule.', 'Listen and choose the correct form.', 'Principal is main; principle is a rule.', '{"confusable_words": ["principal", "principle"]}'),
  ('stationary-vs-stationery', 'Stationary or stationery', 'confusing_words', 'confusing_words', 'Stationary means not moving. Stationery means paper and writing supplies.', 'Listen and choose the correct form.', 'Stationery has e for envelopes.', '{"confusable_words": ["stationary", "stationery"]}'),
  ('to-too-two', 'To, too or two', 'confusing_words', 'confusing_words', 'To shows direction or comes before a verb. Too means also or excessively; two means the number 2.', 'Listen and choose the correct form.', 'Two is a number; too is extra.', '{"confusable_words": ["to", "too", "two"]}'),
  ('were-where-wear', 'Were, where or wear', 'confusing_words', 'confusing_words', 'Were is a past form of be. Where asks about a place; wear means to have clothes on.', 'Listen and choose the correct form.', 'Where is a place; wear is clothes.', '{"confusable_words": ["were", "where", "wear"]}'),
  ('practice-vs-practise', 'Practice or practise', 'confusing_words', 'confusing_words', 'In British English, practice is a noun. Practise is a verb.', 'Listen and choose the correct form.', 'Practise with s is something you do.', '{"confusable_words": ["practice", "practise"]}'),
  ('plural-es', 'Plural nouns with -es', 'plural_forms', 'language_rule', 'Add -es to most nouns ending in s, x, z, ch or sh. Box becomes boxes.', 'Listen and choose the correct form.', 'A hissing ending needs an extra e.', '{}'),
  ('plural-f-to-ves', 'Plural nouns with -ves', 'plural_forms', 'language_rule', 'Some nouns ending in f or fe change that ending to -ves in the plural. Knife becomes knives.', 'Listen and choose the correct form.', 'A knife loses fe and gains ves.', '{}'),
  ('irregular-plurals', 'Common irregular plurals', 'irregular_forms_and_exceptions', 'exception', 'Some plural nouns do not use -s or -es. Child becomes children, mouse becomes mice and person becomes people.', 'Listen and choose the correct form.', 'Child becomes children; mouse becomes mice.', '{}'),
  ('irregular-past-common', 'Common irregular past verbs', 'irregular_forms_and_exceptions', 'exception', 'Many common verbs change spelling in the past. Buy becomes bought, teach becomes taught, and think becomes thought.', 'Listen and choose the correct form.', 'Bought, brought and thought share ought.', '{}'),
  ('comparatives-er-est', 'Comparatives with -er and -est', 'english_spelling', 'language_rule', 'Short adjectives often add -er or -est. Double a final consonant after a short vowel, change final y to i, or drop a final e.', 'Listen and choose the correct form.', 'Big doubles; happy changes y; nice drops e.', '{}'),
  ('tion-vs-sion', 'Nouns ending in -tion or -sion', 'prefixes_and_suffixes', 'language_rule', 'Some nouns end in -tion, like information. Others end in -sion, like decision and discussion. Learn the ending with each word.', 'Listen and choose the correct form.', 'Information takes tion; decision takes sion.', '{}'),
  ('ance-vs-ence', 'Nouns ending in -ance or -ence', 'prefixes_and_suffixes', 'language_rule', 'Some nouns end in -ance, like appearance. Others end in -ence, like difference and independence.', 'Listen and choose the correct form.', 'Appearance takes ance; difference takes ence.', '{}'),
  ('soft-c-and-g', 'Keep e after soft c and g', 'vowels_and_letter_patterns', 'language_rule', 'Keep e after soft c or g before a suffix beginning with a or o. Notice becomes noticeable, and courage becomes courageous.', 'Listen and choose the correct form.', 'Keep e so c and g stay soft.', '{}')
) as v(slug, title, category, rule_type, short_explanation, tts_text, mnemonic, metadata)

where not exists (select 1 from public.rules r where r.slug = v.slug);

-- Examples for new and existing rules.
-- Challenge exercises.
-- Exact identifiers from the supplied built-in CSV.
-- =====================================================================
-- Specific error patterns for the new spelling rules (added in review).
-- The app's classifier detects each of these precisely, so every pattern links to exactly one rule.
-- =====================================================================

commit;
