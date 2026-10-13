# NEW, SEPARATE TASK (words-03.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: S09 (Clothes and Appearance / Accessories), S10 (Clothes and Appearance / Clothing Items), S11 (Clothes and Appearance / Looks and Grooming), S12 (Common Actions / At Home).
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling and vocabulary trainer for Russian-speaking learners (levels A2-C1).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself; do not copy from dictionaries or websites.
Avoid words and sentences where British and American English differ (colour/color, centre/center, apartment/flat).

## Your task in this round

Write **10 NEW words for each of these 4 slots** (40 words). A slot is a topic and subtopic of the word library. Put each word in the slot where it fits best; use the slot code in `slot`.

### S09 — Clothes and Appearance / Accessories
Words already in it (do not repeat): scarf, gloves, necklace, bracelet, sunglasses, umbrella, wallet, put on, belt, earrings, zip

### S10 — Clothes and Appearance / Clothing Items
Words already in it (do not repeat): trousers, sweater, underwear, sleeve, collar, pocket, button, wear, fit, try on, jumper, blouse, skirt, trainers, slippers, pyjamas, sandals

### S11 — Clothes and Appearance / Looks and Grooming
Words already in it (do not repeat): hairstyle, beard, moustache, perfume, shave, comb, fashionable, elegant, casual, scruffy

### S12 — Common Actions / At Home
Words already in it (do not repeat): tidy up, vacuum, iron, put away, plug in, unplug, wipe, fold, pour, stir, rinse, hang, lock, sweep, unpack, scrub, dust

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

## How to answer (important)

- Put the WHOLE answer in ONE code block (three backticks + json). Outside a code block the chat removes the underscores of the gaps (___) and breaks the JSON.
- Compact JSON: one item per line, no comments, no text before or after the code block.
- Never stop in the middle of an item. If you run out of room, end after the last COMPLETE item and close all brackets; I will ask you to continue.
