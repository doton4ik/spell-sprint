You are writing content for "Spell Sprint", an English spelling and vocabulary trainer for Russian-speaking learners (levels A2-C1).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself; do not copy from dictionaries or websites.
Avoid words and sentences where British and American English differ (colour/color, centre/center, apartment/flat).

## Your task in this round

Write **10 NEW words for each of these 4 slots** (40 words). A slot is a topic and subtopic of the word library. Put each word in the slot where it fits best; use the slot code in `slot`.

### S01 — Animals / Animal Life
Words already in it (do not repeat): tail, feather, fur, paw, hunt, bite, migrate, wild, extinct, endangered

### S02 — Animals / Pets and Farm Animals
Words already in it (do not repeat): rabbit, hamster, puppy, kitten, sheep, chicken, cage, lead, feed, stroke, parrot, tortoise

### S03 — Animals / Wild Animals
Words already in it (do not repeat): elephant, giraffe, crocodile, monkey, dolphin, penguin, chase, scary, fierce, hedgehog, owl, frog, wasp, mosquito, whale, shark, deer

### S04 — Business and Office / Finance and Planning
Words already in it (do not repeat): revenue, expenses, profit, profit margin, invoice, target, market demand, cash flow

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
