You are writing content for "Spell Sprint", an English spelling and vocabulary trainer for Russian-speaking learners (levels A2-C1).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself; do not copy from dictionaries or websites.
Avoid words and sentences where British and American English differ (colour/color, centre/center, apartment/flat).

## Your task in this round

Write new questions for the **level check** of the app, all at level **B1**. Only this level: a learner who is B1 should be able to answer them and a weaker learner should not.
Count: 6 gap-fills, 5 find-the-mistake, 5 word/collocation/phrasal-verb items, 3 word-formation, 5 dictation sentences.
Vary the grammar and vocabulary points and the topics (home, school, work, travel, health, technology, nature, shopping). Do not write questions about articles (a/an/the).

## Formats (answer with ONE JSON object with these five arrays)

1. **gap** - a sentence with one gap and 4 options, exactly one is correct.
   {"prompt": "She ___ to school every day.", "answer": "goes", "wrong": ["go", "going", "is go"], "explain": "He, she and it take -s in the present simple."}
   - exactly one ___ in the prompt; 3 wrong options that are real mistakes learners make, and clearly wrong; the 4 options are all different.
2. **mistake** - a sentence with exactly ONE mistake; the sentence is split into exactly 4 parts and the learner picks the part with the mistake.
   {"sentence": "She don’t like coffee.", "parts": ["She", "don’t", "like", "coffee"], "answer": "don’t", "explain": "With she, use doesn’t."}
   - every part must appear in the sentence exactly as written; the answer is one of the parts; only one part has a mistake.
3. **phrase** - a collocation, phrasal verb or word-choice gap with 4 options.
   {"prompt": "I need to ___ a decision soon.", "answer": "make", "wrong": ["do", "get", "have"], "explain": "We say make a decision."}
4. **formation** - the learner writes the correct form of the word in capitals; the word is given in brackets at the end.
   {"prompt": "She is a very good ___ . (SING)", "answer": "singer", "explain": "Add -er for the person who sings."}
   - the prompt has one ___ and the base word in capitals in brackets; if two forms are correct, join them with | ("decision|indecision").
5. **dictation** - one complete sentence of 6-16 words that a voice reads aloud and the learner types.
   {"sentence": "My brother plays football on Sundays.", "alternatives": ["My brother plays football on Sunday."]}
   - alternatives: other ways to write what was heard that must also count (digits for number words, a contraction); usually empty.

## Rules

- Every `explain` is a hint of **at most 14 words**, plain English.
- Exactly one right answer, no matter how you read the sentence. A different option must never also be correct.
- No leaks: the other words in the sentence must not give the answer away.
- Natural English; avoid British/American differences.

## Output format

{"gap": [...], "mistake": [...], "phrase": [...], "formation": [...], "dictation": [...]}

Before you answer, test every option of every gap and check that exactly one fits.

## How to answer (important)

- Put the WHOLE answer in ONE code block (three backticks + json). Outside a code block the chat removes the underscores of the gaps (___) and breaks the JSON.
- Compact JSON: one item per line, no comments, no text before or after the code block.
- Never stop in the middle of an item. If you run out of room, end after the last COMPLETE item and close all brackets; I will ask you to continue.
