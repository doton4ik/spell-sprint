You are writing content for "Spell Sprint", an English spelling and vocabulary trainer for Russian-speaking learners (levels A2-C1).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself; do not copy from dictionaries or websites.
Avoid words and sentences where British and American English differ (colour/color, centre/center, apartment/flat).

## Your task in this round

Write **10 NEW words for each of these 6 slots** (60 words). A slot is a topic and subtopic of the word library. Put each word in the slot where it fits best; use the slot code in `slot`.

### S31 — Health and Body / Body and Symptoms
Words already in it (do not repeat): stomach, throat, shoulder, knee, headache, fever, cough, sneeze, dizzy, sore, bruise, injury, ankle, wrist, elbow, rash, chest, wound, painful

### S32 — Hobbies and Free Time / Creative Hobbies
Words already in it (do not repeat): paint, knit, sew, hobby, photography, guitar, instrument, gardening, collect, craft, poetry, sketch, rehearsal

### S33 — Hobbies and Free Time / Relaxing and Going Out
Words already in it (do not repeat): cinema, concert, audience, festival, board game, relax, enjoyable, exciting, chess, puzzle, novel, fishing

### S34 — Hobbies and Free Time / Sport and Exercise
Words already in it (do not repeat): gym, jog, exercise, equipment, competition, champion, referee, stadium, take part in, hiking, cycling

### S35 — Home / Around the House
Words already in it (do not repeat): kitchen, bedroom, bathroom, furniture, curtain, staircase, neighbourhood, rent, landlord, appliance, laundry, cupboard, attic, basement, balcony, garage, ceiling, chimney, fence, hallway

### S36 — Jobs and Career / At Work
Words already in it (do not repeat): supervisor, workload, overtime, promotion, resignation, teamwork, punctual, workplace, annual leave, sick leave, contract, shift, client, agenda, boss, unemployed, colleagues, receptionist, payslip, manager

## What a good word is

- A single English word, or a short phrase / phrasal verb (at most 3 words), lowercase (names only if they are always capitalised). Letters, space, apostrophe or hyphen only.
- Useful for a Russian-speaking learner and **easy to misspell** is best: double letters, silent letters, odd vowel pairs, look-alike endings (-ence/-ance, -able/-ible). A mix of levels: about 30% easy (A2), 45% medium (B1), 25% hard (B2-C1).
- One clear meaning. If the word has several meanings, choose the one that fits the slot's topic, and translate that meaning.
- Not a word that is already in the slot's list above, and not a different spelling of it (plural, past tense).

## Fields (all required unless marked optional)

- `slot`: the code, e.g. "S03"
- `word`: the word
- `translation`: Russian, the main meaning first, a few words at most ("запасы", "забирать, получать"). This is what the learner sees and must answer to, so it must point to THIS word and not to a big set of synonyms.
- `difficulty`: "easy" | "medium" | "hard"
- `risk`: 1-5, how easy it is to misspell (1 = simple, 5 = very tricky)
- `partOfSpeech`: one of noun, verb, adjective, adverb, conjunction, determiner, pronoun, preposition, interjection, phrase, other
- `definition`: a simple English definition, 4-14 words, written without using the word itself
- `example`: a natural sentence of 6-14 words that uses the word **exactly in this form** (no plural or past tense; the learner will later get this sentence with a gap). The context must show the meaning.
- `alternatives` (optional): other English words that are a correct answer to the same Russian translation, separated by ";" (only real synonyms, usually empty)
- `rule` (optional): a spelling memory hint of at most 100 characters ("two c, one s"), usually empty

## Output format

[
  {"slot": "S03", "word": "accommodation", "translation": "жильё, проживание", "difficulty": "hard", "risk": 5, "partOfSpeech": "noun",
   "definition": "a place where you can live or stay", "example": "The price includes accommodation for three nights.", "alternatives": "", "rule": "two c, two m"}
]

Before you answer, check each entry: the slot code exists, the word is not in the list, the example contains the word in exactly this form, the definition does not contain the word, and the Russian translation is correct and specific.
