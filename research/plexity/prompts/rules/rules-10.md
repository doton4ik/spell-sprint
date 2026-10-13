You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 2 rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### plural-f-to-ves — Plural nouns with -ves
Rule: Some nouns ending in f or fe change that ending to -ves in the plural. Knife becomes knives.
Memory hint: A knife loses fe and gains ves.
Existing examples (do not repeat; 9):
    - [incorrect] wifes  ->  wives
    - [exception] roof → roofs; chef → chefs
    - [correct] The knives are in the kitchen drawer.
    - [incorrect] knifes  ->  knives
    - [correct] Several leaves fell from the tree.
    - [correct] The two wives were sisters.
    - [correct] The scarves hung by the door.
    - [incorrect] The shelfs are full of books.  ->  The shelves are full of books.
    - [incorrect] Three wolfs crossed the road.  ->  Three wolves crossed the road.
Existing exercises (do not repeat; showing 6 of 6):
    - [correct_word] calfs  =>  calves
    - [correct_word] thiefs  =>  thieves
    - [spell] Spell the word: more than one knife.  =>  knives
    - [spell] Spell the word: more than one elf.  =>  elves
    - [multiple_choice] Choose the correct plural of life.  =>  lives  (choices: lifes / lives / livs)
    - [multiple_choice] Choose the correct plural of leaf.  =>  leaves  (choices: leafs / leaves / leavs)

### plural-y-to-ies — Plural: y becomes ies
Rule: When a noun ends in a consonant plus y, change y to i and add es to form the plural.
Memory hint: Company to companies; one lonely y turns into two i's.
Existing examples (do not repeat; 8):
    - [incorrect] companys  ->  companies
    - [correct] delivery -> deliveries
    - [incorrect] dairys  ->  dairies
    - [correct] The berries were fresh and sweet.
    - [incorrect] cherrys  ->  cherries
    - [correct] The libraries open at nine.
    - [correct] The bakeries sell fresh bread.
    - [incorrect] The factorys closed early.  ->  The factories closed early.
Existing exercises (do not repeat; showing 1 of 1):
    - [multiple_choice] Choose the plural of hobby.  =>  hobbies  (choices: hobbys / hobbies / hobbyes)

## Examples (10 per rule)

- 4 of type "correct": a natural sentence that uses the rule correctly. 6 of type "incorrect": a sentence with the typical mistake learners make, and the same sentence corrected in "correction" (only the mistake changes). One mistake per sentence.
- "note": a short reason, at most 80 characters, naming the point of the rule ("Soft c before e: city, not sity").
- Sentences of 5-14 words, everyday topics, different words and structures. Easy words except the target of the rule.
- A word that is spelled wrongly must be a spelling mistake a real learner makes, not a random typo.

## Exercises (10 per rule), mix of these types

- "fill_gap": a sentence with one ___ and one correct word as "answer". The context must allow exactly one answer.
- "multiple_choice": a prompt with ___ (or "Choose the correct spelling: ...") and "choices" (2-4 options, all different, "answer" is exactly one of them).
- "correct_word": "prompt" is a wrongly spelled word, "answer" is the correct spelling (use only for spelling rules, not for the confusable-word or article rules).
- "spell": "prompt" like "Spell the word: the plural of baby." and "answer" the one correct word (use only for rules where a form is built: plural, past tense, comparative, suffix).
Choose the types that fit the rule: spelling-form rules mostly correct_word, spell and multiple_choice; confusable pairs mostly fill_gap and multiple_choice; article rules fill_gap and multiple_choice with the options a / an / the / no article ("no article" written exactly that way).
Every exercise is independent: no "see the sentence above". Every answer must be unambiguous.

## Output format

[
  {"slug": "accept-vs-except",
   "examples": [{"type": "correct", "text": "I accept your apology.", "note": "Accept = receive or agree"},
                {"type": "incorrect", "text": "Everyone accept Tom came.", "correction": "Everyone except Tom came.", "note": "Except = not including"}],
   "exercises": [{"type": "fill_gap", "prompt": "I cannot ___ his excuse.", "answer": "accept"},
                 {"type": "multiple_choice", "prompt": "We work every day ___ Sunday.", "answer": "except", "choices": ["accept", "except"]}]}
]

Use the slug exactly as written. Before you answer, check every item against the rule above: wrong sentences must really be wrong, correct ones really correct, each exercise has exactly one answer.

## How to answer (important)

- Put the WHOLE answer in ONE code block (three backticks + json). Outside a code block the chat removes the underscores of the gaps (___) and breaks the JSON.
- Compact JSON: one item per line, no comments, no text before or after the code block.
- Never stop in the middle of an item. If you run out of room, end after the last COMPLETE item and close all brackets; I will ask you to continue.
