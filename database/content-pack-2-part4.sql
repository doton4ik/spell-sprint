-- Spell Sprint content pack 2 — part 4 of 4: word links and error patterns.
-- Run the parts in order (1 → 4). Each part is safe to run again.
begin;

insert into public.rule_word_links (rule_id, word_id, relation, note)
select r.id, v.word_id, v.relation, v.note
from (values
  ('advice-vs-advise', 'general-english-confusable-words-advice', 'primary', 'Noun and verb have different endings'),
  ('advice-vs-advise', 'general-english-confusable-words-advise', 'primary', 'Noun and verb have different endings'),
  ('quiet-vs-quite', 'general-english-confusable-words-quiet', 'primary', 'Different meanings need different spellings'),
  ('quiet-vs-quite', 'general-english-confusable-words-quite', 'primary', 'Different meanings need different spellings'),
  ('weather-vs-whether', 'weather-and-seasons-weather-and-seasons-weather', 'primary', 'Conditions or choice determine the spelling'),
  ('weather-vs-whether', 'general-english-confusable-words-weather', 'primary', 'Conditions or choice determine the spelling'),
  ('weather-vs-whether', 'general-english-confusable-words-whether', 'primary', 'Conditions or choice determine the spelling'),
  ('principal-vs-principle', 'general-english-confusable-words-principal', 'primary', 'Main person or a guiding belief'),
  ('principal-vs-principle', 'general-english-confusable-words-principle', 'primary', 'Main person or a guiding belief'),
  ('stationary-vs-stationery', 'general-english-confusable-words-stationary', 'primary', 'Motion or writing determines the ending'),
  ('stationary-vs-stationery', 'general-english-confusable-words-stationery', 'primary', 'Motion or writing determines the ending'),
  ('lose-vs-loose', 'general-english-confusable-words-loose', 'primary', 'Verb and adjective differ by o'),
  ('lose-vs-loose', 'general-english-confusable-words-lose', 'primary', 'Verb and adjective differ by o'),
  ('affect-vs-effect', 'general-english-confusable-words-affect', 'primary', 'Action and result use different initials'),
  ('affect-vs-effect', 'general-english-confusable-words-effect', 'primary', 'Action and result use different initials'),
  ('there-vs-their', 'general-english-confusable-words-their', 'primary', 'Place and ownership have different forms'),
  ('there-vs-their', 'general-english-confusable-words-there', 'primary', 'Place and ownership have different forms'),
  ('double-consonants', 'general-english-professional-communication-communication', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'study-and-career-learning-and-research-assignment', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'travel-and-culture-at-the-destination-accommodation', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'everyday-life-home-and-services-appointment', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'food-and-drinks-meals-and-cooking-dessert', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'food-and-drinks-caf-and-restaurant-allergic', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'people-and-family-family-and-friends-colleague', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'feelings-feelings-embarrassed', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'feelings-feelings-disappointed', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'health-and-body-at-the-doctor-appointment', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'technology-devices-and-software-battery', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'technology-devices-and-software-install', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'nature-and-animals-nature-and-animals-butterfly', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'nature-and-animals-nature-and-animals-squirrel', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'weather-and-seasons-weather-and-seasons-drizzle', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'general-english-commonly-misspelled-accommodation', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'general-english-commonly-misspelled-occasionally', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'general-english-commonly-misspelled-necessary', 'primary', 'Contains a meaningful doubled consonant'),
  ('double-consonants', 'general-english-commonly-misspelled-embarrass', 'primary', 'Contains a meaningful doubled consonant'),
  ('vowel-order-ei-ie', 'everyday-life-home-and-services-receipt', 'primary', 'Check whether ie or ei appears'),
  ('vowel-order-ei-ie', 'people-and-family-family-and-friends-friendship', 'primary', 'Check whether ie or ei appears'),
  ('vowel-order-ei-ie', 'shopping-shopping-receipt', 'primary', 'Check whether ie or ei appears'),
  ('vowel-order-ei-ie', 'general-english-commonly-misspelled-receive', 'primary', 'Check whether ie or ei appears'),
  ('vowel-order-ei-ie', 'general-english-commonly-misspelled-achieve', 'primary', 'Check whether ie or ei appears'),
  ('vowel-order-ei-ie', 'general-english-commonly-misspelled-believe', 'primary', 'Check whether ie or ei appears'),
  ('vowel-order-ei-ie', 'people-and-family-family-and-friends-neighbour', 'related', 'Irregular ie or ei letter pattern'),
  ('vowel-order-ei-ie', 'general-english-commonly-misspelled-foreign', 'related', 'Irregular ie or ei letter pattern'),
  ('vowel-order-ei-ie', 'general-english-commonly-misspelled-weird', 'related', 'Irregular ie or ei letter pattern'),
  ('vowel-order-ei-ie', 'general-english-commonly-misspelled-neighbour', 'related', 'Irregular ie or ei letter pattern'),
  ('vowel-order-ei-ie', 'general-english-commonly-misspelled-conscience', 'related', 'Irregular ie or ei letter pattern'),
  ('silent-letters', 'home-around-the-house-cupboard', 'primary', 'A written consonant is not pronounced'),
  ('silent-letters', 'health-and-body-body-and-symptoms-knee', 'primary', 'A written consonant is not pronounced'),
  ('silent-letters', 'nature-and-animals-nature-and-animals-island', 'primary', 'A written consonant is not pronounced'),
  ('silent-letters', 'general-english-commonly-misspelled-knowledge', 'primary', 'A written consonant is not pronounced'),
  ('silent-letters', 'general-english-commonly-misspelled-answer', 'primary', 'A written consonant is not pronounced'),
  ('plural-y-to-ies', 'places-in-town-places-in-town-pharmacy', 'related', 'Plural changes consonant y to ies'),
  ('plural-y-to-ies', 'places-in-town-places-in-town-library', 'related', 'Plural changes consonant y to ies'),
  ('plural-y-to-ies', 'places-in-town-places-in-town-bakery', 'related', 'Plural changes consonant y to ies'),
  ('plural-y-to-ies', 'health-and-body-at-the-doctor-allergy', 'related', 'Plural changes consonant y to ies'),
  ('plural-y-to-ies', 'general-english-commonly-misspelled-library', 'related', 'Plural changes consonant y to ies'),
  ('tion-vs-sion', 'general-english-professional-communication-presentation', 'primary', 'Noun uses the tion ending'),
  ('tion-vs-sion', 'business-and-office-meetings-and-negotiation-negotiation', 'primary', 'Noun uses the tion ending'),
  ('tion-vs-sion', 'study-and-career-career-development-qualification', 'primary', 'Noun uses the tion ending'),
  ('tion-vs-sion', 'travel-and-culture-travel-planning-reservation', 'primary', 'Noun uses the tion ending'),
  ('tion-vs-sion', 'food-and-drinks-caf-and-restaurant-reservation', 'primary', 'Noun uses the tion ending'),
  ('tion-vs-sion', 'people-and-family-family-and-friends-generation', 'primary', 'Noun uses the tion ending'),
  ('tion-vs-sion', 'health-and-body-at-the-doctor-prescription', 'primary', 'Noun uses the tion ending'),
  ('tion-vs-sion', 'technology-online-life-notification', 'primary', 'Noun uses the tion ending'),
  ('tion-vs-sion', 'nature-and-animals-nature-and-animals-pollution', 'primary', 'Noun uses the tion ending'),
  ('tion-vs-sion', 'business-and-office-meetings-and-negotiation-customer-satisfaction', 'related', 'Contains the tion noun ending'),
  ('tion-vs-sion', 'travel-and-culture-at-the-destination-directions', 'related', 'Contains the tion noun ending'),
  ('comparatives-er-est', 'feelings-feelings-happy', 'primary', 'Happier changes final y to i'),
  ('plural-es', 'sport-and-fitness-training-and-competition-match', 'primary', 'Final ch takes es in plural'),
  ('double-before-ing-ed', 'shopping-shopping-fitting-room', 'related', 'Fit doubles t before ing'),
  ('drop-silent-e', 'weather-and-seasons-weather-and-seasons-freezing', 'primary', 'Freeze drops final e before ing'),
  ('suffix-ful', 'feelings-feelings-grateful', 'primary', 'The ful suffix has one l'),
  ('adverbs-ly', 'general-english-commonly-misspelled-definitely', 'related', 'Adverb is formed with final ly'),
  ('drop-silent-e', 'sport-and-fitness-training-and-competition-score', 'related', 'Final e is removed before ing'),
  ('drop-silent-e', 'food-and-drinks-meals-and-cooking-bake', 'related', 'Final e is removed before ing'),
  ('drop-silent-e', 'health-and-body-body-and-symptoms-sneeze', 'related', 'Final e is removed before ing'),
  ('drop-silent-e', 'technology-devices-and-software-update', 'related', 'Final e is removed before ing'),
  ('drop-silent-e', 'nature-and-animals-nature-and-animals-recycle', 'related', 'Final e is removed before ing'),
  ('drop-silent-e', 'general-english-commonly-misspelled-separate', 'related', 'Final e is removed before ing'),
  ('comparatives-er-est', 'feelings-feelings-proud', 'related', 'Comparative adjective follows this pattern'),
  ('comparatives-er-est', 'health-and-body-body-and-symptoms-dizzy', 'related', 'Comparative adjective follows this pattern'),
  ('comparatives-er-est', 'health-and-body-body-and-symptoms-sore', 'related', 'Comparative adjective follows this pattern'),
  ('comparatives-er-est', 'general-english-confusable-words-quiet', 'related', 'Comparative adjective follows this pattern'),
  ('silent-letters', 'travel-and-culture-at-the-destination-sightseeing', 'related', 'Silent gh occurs in sight'),
  ('plural-es', 'business-and-office-finance-and-planning-expenses', 'related', 'Final s sound takes es in plural'),
  ('soft-c-and-g', 'shopping-shopping-exchange', 'related', 'Change keeps e before able')
) as v(slug, word_id, relation, note)
join public.rules r on r.slug = v.slug
where not exists (select 1 from public.rule_word_links l where l.rule_id = r.id and l.word_id = v.word_id);


insert into public.error_patterns (slug, tier, label, description) values
  ('plural_es', 'learning', 'Plural -es', 'Plural written with -s where -es is needed (boxs instead of boxes).'),
  ('f_to_ves', 'learning', 'f → ves', 'Plural of a word ending in f/fe written with -fs/-fes (knifes instead of knives).'),
  ('irregular_plural', 'learning', 'Irregular plural', 'A regular -s on an irregular plural (mans instead of men).'),
  ('irregular_past', 'learning', 'Irregular past', 'A regular -ed on an irregular verb (thinked instead of thought).'),
  ('comparative_spelling', 'learning', 'Comparative -er/-est', 'Spelling change before -er/-est missed (happyer, hoter, niceer).'),
  ('tion_sion', 'learning', '-tion or -sion', 'The wrong one of -tion and -sion (decition instead of decision).'),
  ('ance_ence', 'learning', '-ance or -ence', 'The wrong one of -ance/-ence or -ant/-ent (differance instead of difference).'),
  ('soft_c_g', 'learning', 'Soft c / g + e', 'The e that keeps c or g soft was dropped (noticable instead of noticeable).')
on conflict (slug) do nothing;

insert into public.error_pattern_rule_links (error_pattern_id, rule_id, note)
select p.id, r.id, v.note
from (values
  ('plural_es', 'plural-es', '-es after s, x, z, ch, sh'),
  ('f_to_ves', 'plural-f-to-ves', 'f/fe becomes ves'),
  ('irregular_plural', 'irregular-plurals', 'regular -s on an irregular plural'),
  ('irregular_past', 'irregular-past-common', 'regular -ed on an irregular verb'),
  ('comparative_spelling', 'comparatives-er-est', 'spelling change before -er/-est'),
  ('tion_sion', 'tion-vs-sion', '-tion versus -sion'),
  ('ance_ence', 'ance-vs-ence', '-ance/-ence and -ant/-ent'),
  ('soft_c_g', 'soft-c-and-g', 'e kept after soft c/g')
) as v(pattern_slug, rule_slug, note)
join public.error_patterns p on p.slug = v.pattern_slug
join public.rules r on r.slug = v.rule_slug
on conflict (error_pattern_id, rule_id) do nothing;

commit;
