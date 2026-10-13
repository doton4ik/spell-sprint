# NEW, SEPARATE TASK (rules-13)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: stationary-vs-stationery, suffix-ful.
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 2 rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### stationary-vs-stationery — Stationary or stationery
Rule: Stationary means not moving. Stationery means paper and writing supplies.
Memory hint: Stationery has e for envelopes.
Existing examples (do not repeat; 8):
    - [correct] The train remained stationary at the platform.
    - [incorrect] The car stayed stationery.  ->  The car stayed stationary.
    - [incorrect] We need more stationary for the office.  ->  We need more stationery for the office.
    - [correct] I bought stationery for my class.
    - [correct] The shop sells pens and other stationery.
    - [correct] The car was stationary at the lights.
    - [incorrect] He bought some stationary for school.  ->  He bought some stationery for school.
    - [incorrect] The stationery bike stood in the corner.  ->  The stationary bike stood in the corner.
Existing exercises (do not repeat; showing 6 of 6):
    - [fill_gap] Please order more ___ for the office.  =>  stationery
    - [fill_gap] The traffic was ___ for ten minutes.  =>  stationary
    - [multiple_choice] Choose the word: Envelopes and paper are ___.  =>  stationery  (choices: stationery / stationary)
    - [multiple_choice] Choose the word: The satellite looks ___ in the sky.  =>  stationary  (choices: stationery / stationary)
    - [fill_gap] She keeps her ___ in a blue box.  =>  stationery
    - [fill_gap] The plane was ___ on the runway.  =>  stationary

### suffix-ful — The suffix -ful has one L
Rule: The suffix -ful always has a single l, as in useful and careful, even though the word full has two.
Memory hint: Ful is never full of extra Ls.
Existing examples (do not repeat; 8):
    - [exception] carefully
    - [correct] He gave a truthful answer to the question.
    - [correct] It was a helpful suggestion from my colleague.
    - [incorrect] carefull  ->  careful
    - [incorrect] usefull  ->  useful
    - [correct] Her cheerful voice made everyone smile.
    - [incorrect] hopefull  ->  hopeful
    - [incorrect] cheerfull  ->  cheerful
Existing exercises (do not repeat; showing 0 of 0):


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
