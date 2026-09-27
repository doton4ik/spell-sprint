-- database/rules-seed-challenge.sql
-- Spell Sprint: "Rule challenge" seed data (reviewed: fixed exercises, Russian hints for open gaps,
-- one-rule-per-pattern links).
-- Safe to run multiple times: only INSERT ... SELECT ... WHERE NOT EXISTS
-- or INSERT ... ON CONFLICT DO NOTHING. No DELETE/UPDATE/DROP/TRUNCATE/ALTER,
-- no RLS/policy changes, no auth.* or user_*/mistake_*/rule_practice_attempts access.
-- All rows are built-in, public, non-personal reference data.

begin;

-- =====================================================================
-- PART B.1 — New rules (public.rules)
-- =====================================================================

insert into public.rules (slug, title, category, rule_type, short_explanation, tts_text, mnemonic, source, visibility, is_active, metadata)
select v.slug, v.title, v.category, v.rule_type, v.short_explanation, v.tts_text, v.mnemonic, 'built-in', 'public', true, v.metadata::jsonb
from (values
  ('silent-letters', 'Silent letters', 'silent_letters', 'language_rule',
    'Some English words contain letters that are written but not pronounced. Learning these silent letters helps you spell tricky words correctly.',
    'Some letters in English words are silent.',
    'The k in knife is silent, just like the w in write.',
    '{}'),
  ('drop-silent-e', 'Dropping the silent e', 'verb_endings', 'language_rule',
    'When a verb ends in a silent e, you usually drop the e before adding -ing or -ed. For example, make becomes making.',
    'Drop the silent e before ing or ed.',
    'The silent e steps aside to let -ing and -ed in.',
    '{}'),
  ('double-before-ing-ed', 'Doubling before -ing and -ed', 'verb_endings', 'language_rule',
    'Short verbs that end in one vowel and one consonant often double the final consonant before -ing or -ed, as in plan becoming planning.',
    'Double the final consonant before ing or ed.',
    'One vowel, one consonant, double before you go on.',
    '{}'),
  ('suffix-ful', 'The suffix -ful has one L', 'prefixes_and_suffixes', 'language_rule',
    'The suffix -ful always has a single l, as in useful and careful, even though the word full has two.',
    'The suffix ful has only one l.',
    'Ful is never full of extra Ls.',
    '{}'),
  ('adverbs-ly', 'Forming adverbs with -ly', 'prefixes_and_suffixes', 'language_rule',
    'Most adverbs are formed by adding -ly to an adjective, but adjectives ending in y usually change to i before -ly, as in happy becoming happily.',
    'Change y to i before adding ly.',
    'Happy waves goodbye to y and says hi to ily.',
    '{}'),
  ('able-vs-ible', '-able versus -ible endings', 'prefixes_and_suffixes', 'language_rule',
    'Some adjectives end in -able and others in -ible, and there is no simple rule, so these words are often best learned individually, like available and possible.',
    'Some words end in able, others end in ible.',
    'Able is common; ible likes to hide in short roots.',
    '{}')
) as v(slug, title, category, rule_type, short_explanation, tts_text, mnemonic, metadata)
on conflict (slug) do nothing;

-- =====================================================================
-- PART B.2 — Examples for the new rules (public.rule_examples)
-- =====================================================================

insert into public.rule_examples (rule_id, example_type, text, correction, note)
select r.id, v.example_type, v.text, v.correction, v.note
from (values
  ('silent-letters', 'incorrect', 'nife', 'knife', 'missing silent k'),
  ('silent-letters', 'incorrect', 'rite', 'write', 'missing silent w'),
  ('silent-letters', 'correct', 'The chef used a sharp knife to cut the bread.', null, 'silent k in knife'),
  ('silent-letters', 'correct', 'She decided to write a letter to her friend.', null, 'silent w in write'),

  ('drop-silent-e', 'incorrect', 'makeing', 'making', 'silent e kept by mistake'),
  ('drop-silent-e', 'incorrect', 'hopeed', 'hoped', 'silent e not dropped'),
  ('drop-silent-e', 'correct', 'She is writing a long letter to her cousin.', null, 'silent e dropped before ing'),
  ('drop-silent-e', 'correct', 'He danced all night at the party.', null, 'silent e dropped before ed'),
  ('drop-silent-e', 'exception', 'agreeing', null, 'keeps both e letters because it ends in -ee'),

  ('double-before-ing-ed', 'incorrect', 'planing', 'planning', 'missing doubled n'),
  ('double-before-ing-ed', 'incorrect', 'stoped', 'stopped', 'missing doubled p'),
  ('double-before-ing-ed', 'correct', 'They are shopping for groceries this afternoon.', null, 'doubled p before ing'),
  ('double-before-ing-ed', 'correct', 'She dropped her phone on the floor.', null, 'doubled p before ed'),
  ('double-before-ing-ed', 'exception', 'fixing', null, 'no doubling after x, so fix keeps one x'),

  ('suffix-ful', 'incorrect', 'usefull', 'useful', 'extra l added'),
  ('suffix-ful', 'incorrect', 'carefull', 'careful', 'extra l added'),
  ('suffix-ful', 'correct', 'It was a helpful suggestion from my colleague.', null, 'single l in helpful'),
  ('suffix-ful', 'correct', 'He gave a truthful answer to the question.', null, 'single l in truthful'),
  ('suffix-ful', 'exception', 'carefully', null, 'double l appears only when -ly is added to careful'),

  ('adverbs-ly', 'incorrect', 'happyly', 'happily', 'y not changed to i before ly'),
  ('adverbs-ly', 'incorrect', 'finaly', 'finally', 'missing double l'),
  ('adverbs-ly', 'correct', 'She spoke quietly during the meeting.', null, 'ly added directly'),
  ('adverbs-ly', 'correct', 'He easily finished the puzzle in ten minutes.', null, 'y changed to i before ly'),
  ('adverbs-ly', 'exception', 'simply', null, 'drop the final e before ly'),

  ('able-vs-ible', 'incorrect', 'availible', 'available', 'wrong ending used'),
  ('able-vs-ible', 'incorrect', 'responsable', 'responsible', 'wrong ending used'),
  ('able-vs-ible', 'correct', 'The tickets are still available online.', null, 'correct -able ending'),
  ('able-vs-ible', 'correct', 'It is possible to finish the project early.', null, 'correct -ible ending')
) as v(slug, example_type, text, correction, note)
join public.rules r on r.slug = v.slug
where not exists (
  select 1 from public.rule_examples e
  where e.rule_id = r.id and e.text = v.text and e.example_type = v.example_type
);

-- =====================================================================
-- PART A + PART B.3 — Exercises for all 15 rules (public.rule_exercises)
-- =====================================================================

insert into public.rule_exercises (rule_id, exercise_type, prompt, answer, choices, metadata)
select r.id, v.exercise_type, v.prompt, v.answer, v.choices::jsonb, v.metadata::jsonb
from (values
  -- ---------------------------------------------------------------
  -- Part A.1 — double-consonants (already used: tomorrow, beginning, recommended)
  -- ---------------------------------------------------------------
  ('double-consonants', 'correct_word', 'occured', 'occurred', null, '{"set": "challenge-v1", "word": "occurred"}'),
  ('double-consonants', 'correct_word', 'imediately', 'immediately', null, '{"set": "challenge-v1", "word": "immediately"}'),
  ('double-consonants', 'correct_word', 'posible', 'possible', null, '{"set": "challenge-v1", "word": "possible"}'),
  ('double-consonants', 'spell', 'Spell the word: needed or required (необходимый).', 'necessary', null, '{"set": "challenge-v1", "word": "necessary"}'),
  ('double-consonants', 'spell', 'Spell the word: the way in which two things are not the same.', 'difference', null, '{"set": "challenge-v1", "word": "difference"}'),
  ('double-consonants', 'fill_gap', 'I felt so ___ when I tripped in front of everyone. (смущённым)', 'embarrassed', null, '{"set": "challenge-v1", "word": "embarrassed"}'),
  ('double-consonants', 'fill_gap', 'She was ___ when her flight got cancelled. (разочарована)', 'disappointed', null, '{"set": "challenge-v1", "word": "disappointed"}'),
  ('double-consonants', 'multiple_choice', 'Choose the correct spelling.', 'accommodate', '["accommodate", "acommodate", "accomodate"]', '{"set": "challenge-v1", "word": "accommodate"}'),

  -- ---------------------------------------------------------------
  -- Part A.2 — vowel-order-ei-ie (already used: receive; exceptions weird/seize/science excluded)
  -- ---------------------------------------------------------------
  ('vowel-order-ei-ie', 'correct_word', 'beleive', 'believe', null, '{"set": "challenge-v1", "word": "believe"}'),
  ('vowel-order-ei-ie', 'correct_word', 'acheive', 'achieve', null, '{"set": "challenge-v1", "word": "achieve"}'),
  ('vowel-order-ei-ie', 'correct_word', 'peice', 'piece', null, '{"set": "challenge-v1", "word": "piece"}'),
  ('vowel-order-ei-ie', 'spell', 'Spell the word: a feeling of comfort after worry ends.', 'relief', null, '{"set": "challenge-v1", "word": "relief"}'),
  ('vowel-order-ei-ie', 'spell', 'Spell the word: the daughter of your brother or sister.', 'niece', null, '{"set": "challenge-v1", "word": "niece"}'),
  ('vowel-order-ei-ie', 'fill_gap', 'She is the ___ of the whole marketing department. (глава)', 'chief', null, '{"set": "challenge-v1", "word": "chief"}'),
  ('vowel-order-ei-ie', 'fill_gap', 'The negotiators refused to ___ to the demands. (уступить)', 'yield', null, '{"set": "challenge-v1", "word": "yield"}'),
  ('vowel-order-ei-ie', 'multiple_choice', 'Choose the correct spelling.', 'ceiling', '["ceiling", "cieling", "celing"]', '{"set": "challenge-v1", "word": "ceiling"}'),

  -- ---------------------------------------------------------------
  -- Part A.3 — lose-vs-loose (choice rule)
  -- ---------------------------------------------------------------
  ('lose-vs-loose', 'fill_gap', 'Please don''t ___ your keys again.', 'lose', null, '{"set": "challenge-v1", "word": "lose"}'),
  ('lose-vs-loose', 'fill_gap', 'These trousers are too ___ around the waist.', 'loose', null, '{"set": "challenge-v1", "word": "loose"}'),
  ('lose-vs-loose', 'fill_gap', 'If we don''t score soon, we might ___ the match.', 'lose', null, '{"set": "challenge-v1", "word": "lose"}'),
  ('lose-vs-loose', 'fill_gap', 'The dog ran off because its collar was ___.', 'loose', null, '{"set": "challenge-v1", "word": "loose"}'),
  ('lose-vs-loose', 'fill_gap', 'I always ___ my umbrella on rainy days.', 'lose', null, '{"set": "challenge-v1", "word": "lose"}'),
  ('lose-vs-loose', 'multiple_choice', 'Choose the correct word: I don''t want to ___ my temper.', 'lose', '["lose", "loose"]', '{"set": "challenge-v1", "word": "lose"}'),
  ('lose-vs-loose', 'multiple_choice', 'Choose the correct word: One of the buttons on my coat is ___.', 'loose', '["lose", "loose"]', '{"set": "challenge-v1", "word": "loose"}'),
  ('lose-vs-loose', 'multiple_choice', 'Choose the correct word: He tends to ___ interest quickly.', 'lose', '["lose", "loose"]', '{"set": "challenge-v1", "word": "lose"}'),

  -- ---------------------------------------------------------------
  -- Part A.4 — plural-y-to-ies (already used: company)
  -- ---------------------------------------------------------------
  ('plural-y-to-ies', 'correct_word', 'storys', 'stories', null, '{"set": "challenge-v1", "word": "stories"}'),
  ('plural-y-to-ies', 'correct_word', 'familys', 'families', null, '{"set": "challenge-v1", "word": "families"}'),
  ('plural-y-to-ies', 'correct_word', 'countrys', 'countries', null, '{"set": "challenge-v1", "word": "countries"}'),
  ('plural-y-to-ies', 'spell', 'Spell the plural word: large towns where many people live.', 'cities', null, '{"set": "challenge-v1", "word": "cities"}'),
  ('plural-y-to-ies', 'spell', 'Spell the plural word: social events with food and guests.', 'parties', null, '{"set": "challenge-v1", "word": "parties"}'),
  ('plural-y-to-ies', 'fill_gap', 'The two ___ greeted each other politely before the meeting. (дамы)', 'ladies', null, '{"set": "challenge-v1", "word": "ladies"}'),
  ('plural-y-to-ies', 'fill_gap', 'The nurses took good care of all the ___ in the hospital. (младенцев)', 'babies', null, '{"set": "challenge-v1", "word": "babies"}'),
  ('plural-y-to-ies', 'multiple_choice', 'Choose the correct plural form.', 'factories', '["factories", "factorys", "factoryes"]', '{"set": "challenge-v1", "word": "factories"}'),

  -- ---------------------------------------------------------------
  -- Part A.5 — irregular-past-go (choice rule)
  -- ---------------------------------------------------------------
  ('irregular-past-go', 'fill_gap', 'Yesterday, we ___ to the cinema after dinner.', 'went', null, '{"set": "challenge-v1", "word": "went"}'),
  ('irregular-past-go', 'fill_gap', 'She has already ___ home for the day.', 'gone', null, '{"set": "challenge-v1", "word": "gone"}'),
  ('irregular-past-go', 'fill_gap', 'They always ___ to the same restaurant on Fridays.', 'go', null, '{"set": "challenge-v1", "word": "go"}'),
  ('irregular-past-go', 'fill_gap', 'By the time I arrived, everyone had already ___.', 'gone', null, '{"set": "challenge-v1", "word": "gone"}'),
  ('irregular-past-go', 'fill_gap', 'Last summer, we ___ to the coast for a holiday.', 'went', null, '{"set": "challenge-v1", "word": "went"}'),
  ('irregular-past-go', 'multiple_choice', 'Choose the correct word: He has never ___ abroad before.', 'gone', '["go", "went", "gone"]', '{"set": "challenge-v1", "word": "gone"}'),
  ('irregular-past-go', 'multiple_choice', 'Choose the correct word: We usually ___ to work by bus.', 'go', '["go", "went", "gone"]', '{"set": "challenge-v1", "word": "go"}'),
  ('irregular-past-go', 'multiple_choice', 'Choose the correct word: She ___ to bed early last night.', 'went', '["go", "went", "gone"]', '{"set": "challenge-v1", "word": "went"}'),

  -- ---------------------------------------------------------------
  -- Part A.6 — there-vs-their (choice rule)
  -- ---------------------------------------------------------------
  ('there-vs-their', 'fill_gap', 'I heard that ___ planning a trip to Spain.', 'they''re', null, '{"set": "challenge-v1", "word": "they''re"}'),
  ('there-vs-their', 'fill_gap', 'Put the boxes over ___, next to the door.', 'there', null, '{"set": "challenge-v1", "word": "there"}'),
  ('there-vs-their', 'fill_gap', 'The students forgot ___ books at home.', 'their', null, '{"set": "challenge-v1", "word": "their"}'),
  ('there-vs-their', 'fill_gap', 'Is ___ any more coffee in the pot?', 'there', null, '{"set": "challenge-v1", "word": "there"}'),
  ('there-vs-their', 'fill_gap', 'My neighbours said ___ moving next month.', 'they''re', null, '{"set": "challenge-v1", "word": "they''re"}'),
  ('there-vs-their', 'multiple_choice', 'Choose the correct word: ___ car broke down on the motorway.', 'their', '["there", "their", "they''re"]', '{"set": "challenge-v1", "word": "their"}'),
  ('there-vs-their', 'multiple_choice', 'Choose the correct word: ___ is a strange noise coming from the engine.', 'there', '["there", "their", "they''re"]', '{"set": "challenge-v1", "word": "there"}'),
  ('there-vs-their', 'multiple_choice', 'Choose the correct word: I think ___ still waiting outside.', 'they''re', '["there", "their", "they''re"]', '{"set": "challenge-v1", "word": "they''re"}'),

  -- ---------------------------------------------------------------
  -- Part A.7 — its-vs-its-contraction (choice rule)
  -- ---------------------------------------------------------------
  ('its-vs-its-contraction', 'fill_gap', 'The cat licked ___ paw before falling asleep.', 'its', null, '{"set": "challenge-v1", "word": "its"}'),
  ('its-vs-its-contraction', 'fill_gap', 'I think ___ going to rain later today.', 'it''s', null, '{"set": "challenge-v1", "word": "it''s"}'),
  ('its-vs-its-contraction', 'fill_gap', 'The company changed ___ logo last year.', 'its', null, '{"set": "challenge-v1", "word": "its"}'),
  ('its-vs-its-contraction', 'fill_gap', '___ been a long time since we last met.', 'it''s', null, '{"set": "challenge-v1", "word": "it''s"}'),
  ('its-vs-its-contraction', 'fill_gap', 'The dog wagged ___ tail happily.', 'its', null, '{"set": "challenge-v1", "word": "its"}'),
  ('its-vs-its-contraction', 'multiple_choice', 'Choose the correct word: ___ obvious that the plan will not work.', 'it''s', '["its", "it''s"]', '{"set": "challenge-v1", "word": "it''s"}'),
  ('its-vs-its-contraction', 'multiple_choice', 'Choose the correct word: The bird built ___ nest in the old tree.', 'its', '["its", "it''s"]', '{"set": "challenge-v1", "word": "its"}'),
  ('its-vs-its-contraction', 'multiple_choice', 'Choose the correct word: ___ getting late, so we should leave now.', 'it''s', '["its", "it''s"]', '{"set": "challenge-v1", "word": "it''s"}'),

  -- ---------------------------------------------------------------
  -- Part A.8 — your-vs-youre (choice rule)
  -- ---------------------------------------------------------------
  ('your-vs-youre', 'fill_gap', 'Don''t forget to bring ___ passport to the airport.', 'your', null, '{"set": "challenge-v1", "word": "your"}'),
  ('your-vs-youre', 'fill_gap', 'I think ___ going to enjoy this film.', 'you''re', null, '{"set": "challenge-v1", "word": "you''re"}'),
  ('your-vs-youre', 'fill_gap', 'Is this ___ jacket on the chair?', 'your', null, '{"set": "challenge-v1", "word": "your"}'),
  ('your-vs-youre', 'fill_gap', '___ doing a great job on this project.', 'you''re', null, '{"set": "challenge-v1", "word": "you''re"}'),
  ('your-vs-youre', 'fill_gap', 'Please write ___ name at the top of the page.', 'your', null, '{"set": "challenge-v1", "word": "your"}'),
  ('your-vs-youre', 'multiple_choice', 'Choose the correct word: ___ welcome to join us for dinner.', 'you''re', '["your", "you''re"]', '{"set": "challenge-v1", "word": "you''re"}'),
  ('your-vs-youre', 'multiple_choice', 'Choose the correct word: What is ___ favourite colour?', 'your', '["your", "you''re"]', '{"set": "challenge-v1", "word": "your"}'),
  ('your-vs-youre', 'multiple_choice', 'Choose the correct word: ___ always late on Mondays.', 'you''re', '["your", "you''re"]', '{"set": "challenge-v1", "word": "you''re"}'),

  -- ---------------------------------------------------------------
  -- Part A.9 — affect-vs-effect (choice rule)
  -- ---------------------------------------------------------------
  ('affect-vs-effect', 'fill_gap', 'Loud noise can ___ your ability to concentrate.', 'affect', null, '{"set": "challenge-v1", "word": "affect"}'),
  ('affect-vs-effect', 'fill_gap', 'The new policy had a positive ___ on sales.', 'effect', null, '{"set": "challenge-v1", "word": "effect"}'),
  ('affect-vs-effect', 'fill_gap', 'Lack of sleep can seriously ___ your health.', 'affect', null, '{"set": "challenge-v1", "word": "affect"}'),
  ('affect-vs-effect', 'fill_gap', 'The medicine had an immediate ___ on her headache.', 'effect', null, '{"set": "challenge-v1", "word": "effect"}'),
  ('affect-vs-effect', 'fill_gap', 'Stress can ___ both your body and your mind.', 'affect', null, '{"set": "challenge-v1", "word": "affect"}'),
  ('affect-vs-effect', 'multiple_choice', 'Choose the correct word: The storm did not ___ our travel plans.', 'affect', '["affect", "effect"]', '{"set": "challenge-v1", "word": "affect"}'),
  ('affect-vs-effect', 'multiple_choice', 'Choose the correct word: One ___ of exercise is better sleep.', 'effect', '["affect", "effect"]', '{"set": "challenge-v1", "word": "effect"}'),
  ('affect-vs-effect', 'multiple_choice', 'Choose the correct word: Her speech had a strong ___ on the audience.', 'effect', '["affect", "effect"]', '{"set": "challenge-v1", "word": "effect"}'),

  -- ---------------------------------------------------------------
  -- Part B.3.1 — silent-letters
  -- ---------------------------------------------------------------
  ('silent-letters', 'correct_word', 'dout', 'doubt', null, '{"set": "challenge-v1", "word": "doubt"}'),
  ('silent-letters', 'correct_word', 'iland', 'island', null, '{"set": "challenge-v1", "word": "island"}'),
  ('silent-letters', 'correct_word', 'onest', 'honest', null, '{"set": "challenge-v1", "word": "honest"}'),
  ('silent-letters', 'spell', 'Spell the word: to move up using your hands and feet.', 'climb', null, '{"set": "challenge-v1", "word": "climb"}'),
  ('silent-letters', 'spell', 'Spell the word: the part of your arm near your hand.', 'wrist', null, '{"set": "challenge-v1", "word": "wrist"}'),
  ('silent-letters', 'fill_gap', 'The weather turns cooler in ___ before winter begins. (осенью)', 'autumn', null, '{"set": "challenge-v1", "word": "autumn"}'),
  ('silent-letters', 'fill_gap', 'She used a ___ to tidy her hair before the interview. (расчёску)', 'comb', null, '{"set": "challenge-v1", "word": "comb"}'),
  ('silent-letters', 'multiple_choice', 'Choose the correct spelling.', 'listen', '["listen", "liten", "lissen"]', '{"set": "challenge-v1", "word": "listen"}'),

  -- ---------------------------------------------------------------
  -- Part B.3.2 — drop-silent-e
  -- ---------------------------------------------------------------
  ('drop-silent-e', 'correct_word', 'danceing', 'dancing', null, '{"set": "challenge-v1", "word": "dancing"}'),
  ('drop-silent-e', 'correct_word', 'useing', 'using', null, '{"set": "challenge-v1", "word": "using"}'),
  ('drop-silent-e', 'correct_word', 'closeing', 'closing', null, '{"set": "challenge-v1", "word": "closing"}'),
  ('drop-silent-e', 'spell', 'Spell the word: the -ing form of ''decide''.', 'deciding', null, '{"set": "challenge-v1", "word": "deciding"}'),
  ('drop-silent-e', 'spell', 'Spell the word: the -ing form of ''believe''.', 'believing', null, '{"set": "challenge-v1", "word": "believing"}'),
  ('drop-silent-e', 'fill_gap', 'She is ___ every morning to stay fit. (тренируется)', 'exercising', null, '{"set": "challenge-v1", "word": "exercising"}'),
  ('drop-silent-e', 'fill_gap', 'They finally ___ at the airport after a long flight. (прилетели)', 'arrived', null, '{"set": "challenge-v1", "word": "arrived"}'),
  ('drop-silent-e', 'multiple_choice', 'Choose the correct spelling.', 'writing', '["writing", "writeing", "writting"]', '{"set": "challenge-v1", "word": "writing"}'),

  -- ---------------------------------------------------------------
  -- Part B.3.3 — double-before-ing-ed
  -- ---------------------------------------------------------------
  ('double-before-ing-ed', 'correct_word', 'huging', 'hugging', null, '{"set": "challenge-v1", "word": "hugging"}'),
  ('double-before-ing-ed', 'correct_word', 'grabing', 'grabbing', null, '{"set": "challenge-v1", "word": "grabbing"}'),
  ('double-before-ing-ed', 'correct_word', 'joging', 'jogging', null, '{"set": "challenge-v1", "word": "jogging"}'),
  ('double-before-ing-ed', 'spell', 'Spell the word: the -ed form of ''permit''.', 'permitted', null, '{"set": "challenge-v1", "word": "permitted"}'),
  ('double-before-ing-ed', 'spell', 'Spell the word: the British -ing form of ''travel''.', 'travelling', null, '{"set": "challenge-v1", "word": "travelling"}'),
  ('double-before-ing-ed', 'fill_gap', 'She carefully ___ the present in colourful paper. (завернула)', 'wrapped', null, '{"set": "challenge-v1", "word": "wrapped"}'),
  ('double-before-ing-ed', 'fill_gap', 'The children ___ over the puddles on the way to school. (перепрыгивали)', 'hopped', null, '{"set": "challenge-v1", "word": "hopped"}'),
  ('double-before-ing-ed', 'multiple_choice', 'Choose the correct spelling.', 'admitted', '["admitted", "admited", "admmitted"]', '{"set": "challenge-v1", "word": "admitted"}'),

  -- ---------------------------------------------------------------
  -- Part B.3.4 — suffix-ful
  -- ---------------------------------------------------------------
  ('suffix-ful', 'correct_word', 'powerfull', 'powerful', null, '{"set": "challenge-v1", "word": "powerful"}'),
  ('suffix-ful', 'correct_word', 'colourfull', 'colourful', null, '{"set": "challenge-v1", "word": "colourful"}'),
  ('suffix-ful', 'correct_word', 'thoughtfull', 'thoughtful', null, '{"set": "challenge-v1", "word": "thoughtful"}'),
  ('suffix-ful', 'spell', 'Spell the word: causing physical or emotional pain.', 'painful', null, '{"set": "challenge-v1", "word": "painful"}'),
  ('suffix-ful', 'spell', 'Spell the word: full of wonder and delight.', 'wonderful', null, '{"set": "challenge-v1", "word": "wonderful"}'),
  ('suffix-ful', 'fill_gap', 'My dog is very ___ and always waits for me at the door. (верный)', 'faithful', null, '{"set": "challenge-v1", "word": "faithful"}'),
  ('suffix-ful', 'fill_gap', 'I am truly ___ for all your help this year. (благодарен)', 'grateful', null, '{"set": "challenge-v1", "word": "grateful"}'),
  ('suffix-ful', 'multiple_choice', 'Choose the correct spelling.', 'forgetful', '["forgetful", "forgetfull", "forgettful"]', '{"set": "challenge-v1", "word": "forgetful"}'),

  -- ---------------------------------------------------------------
  -- Part B.3.5 — adverbs-ly
  -- ---------------------------------------------------------------
  ('adverbs-ly', 'correct_word', 'heavyly', 'heavily', null, '{"set": "challenge-v1", "word": "heavily"}'),
  ('adverbs-ly', 'correct_word', 'angryly', 'angrily', null, '{"set": "challenge-v1", "word": "angrily"}'),
  ('adverbs-ly', 'correct_word', 'luckyly', 'luckily', null, '{"set": "challenge-v1", "word": "luckily"}'),
  ('adverbs-ly', 'spell', 'Spell the adverb form of ''gentle''.', 'gently', null, '{"set": "challenge-v1", "word": "gently"}'),
  ('adverbs-ly', 'spell', 'Spell the adverb meaning ''most likely''.', 'probably', null, '{"set": "challenge-v1", "word": "probably"}'),
  ('adverbs-ly', 'fill_gap', 'Our team played ___ and lost five nil. (ужасно)', 'terribly', null, '{"set": "challenge-v1", "word": "terribly"}'),
  ('adverbs-ly', 'fill_gap', 'The children ate their breakfast ___ after the long hike. (жадно)', 'hungrily', null, '{"set": "challenge-v1", "word": "hungrily"}'),
  ('adverbs-ly', 'multiple_choice', 'Choose the correct spelling.', 'lazily', '["lazily", "lazyly", "laizly"]', '{"set": "challenge-v1", "word": "lazily"}'),

  -- ---------------------------------------------------------------
  -- Part B.3.6 — able-vs-ible
  -- ---------------------------------------------------------------
  ('able-vs-ible', 'correct_word', 'comfortible', 'comfortable', null, '{"set": "challenge-v1", "word": "comfortable"}'),
  ('able-vs-ible', 'correct_word', 'relyable', 'reliable', null, '{"set": "challenge-v1", "word": "reliable"}'),
  ('able-vs-ible', 'correct_word', 'visable', 'visible', null, '{"set": "challenge-v1", "word": "visible"}'),
  ('able-vs-ible', 'spell', 'Spell the word: able to bend or change easily.', 'flexible', null, '{"set": "challenge-v1", "word": "flexible"}'),
  ('able-vs-ible', 'spell', 'Spell the word: worth a lot of money or very useful.', 'valuable', null, '{"set": "challenge-v1", "word": "valuable"}'),
  ('able-vs-ible', 'fill_gap', 'The film was so ___ that we watched it twice. (увлекательным)', 'enjoyable', null, '{"set": "challenge-v1", "word": "enjoyable"}'),
  ('able-vs-ible', 'fill_gap', 'It would be more ___ to leave early and avoid traffic. (разумнее)', 'sensible', null, '{"set": "challenge-v1", "word": "sensible"}'),
  ('able-vs-ible', 'multiple_choice', 'Choose the correct spelling.', 'terrible', '["terrible", "terrable", "terribel"]', '{"set": "challenge-v1", "word": "terrible"}')
) as v(slug, exercise_type, prompt, answer, choices, metadata)
join public.rules r on r.slug = v.slug
where not exists (
  select 1 from public.rule_exercises e
  where e.rule_id = r.id and e.prompt = v.prompt and e.answer = v.answer
);

-- =====================================================================
-- PART B.4 — Specific error patterns and their links
-- The classifier now tells these ending mistakes apart (usefull is a -ful mistake, not -ly or
-- -ible), so every new rule is linked only to its own pattern. The broad tags suffix_error and
-- verb_ending_error stay unlinked on purpose: they would attach one mistake to several rules.
-- =====================================================================

insert into public.error_patterns (slug, tier, label, description) values
  ('silent_e_before_suffix', 'learning', 'Silent e before -ing/-ed', 'The silent e was kept before -ing or -ed (makeing instead of making).'),
  ('doubling_before_suffix', 'learning', 'Doubling before -ing/-ed', 'The final consonant was not doubled, or doubled by mistake, before -ing or -ed (planing, openning).'),
  ('ful_suffix', 'learning', 'Suffix -ful', 'The suffix -ful was written with two l (usefull).'),
  ('ly_suffix', 'learning', 'Adverb -ly', 'The adjective was changed wrongly before -ly (happyly, finaly, gentlely).'),
  ('able_ible', 'learning', '-able or -ible', 'The right word with the wrong ending: -able instead of -ible or the other way round.')
on conflict (slug) do nothing;

insert into public.error_pattern_rule_links (error_pattern_id, rule_id, note)
select p.id, r.id, v.note
from (values
  ('silent_letter', 'silent-letters', 'A silent letter was left out.'),
  ('silent_e_before_suffix', 'drop-silent-e', 'Silent e kept before -ing/-ed.'),
  ('doubling_before_suffix', 'double-before-ing-ed', 'Final consonant doubling before -ing/-ed.'),
  ('ful_suffix', 'suffix-ful', 'Extra l in the -ful suffix.'),
  ('ly_suffix', 'adverbs-ly', 'Adjective changed wrongly before -ly.'),
  ('able_ible', 'able-vs-ible', 'Wrong choice between -able and -ible.')
) as v(pattern_slug, rule_slug, note)
join public.error_patterns p on p.slug = v.pattern_slug
join public.rules r on r.slug = v.rule_slug
on conflict (error_pattern_id, rule_id) do nothing;

commit;
