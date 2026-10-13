You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 2 rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### adverbs-ly — Forming adverbs with -ly
Rule: Most adverbs are formed by adding -ly to an adjective, but adjectives ending in y usually change to i before -ly, as in happy becoming happily.
Memory hint: Happy waves goodbye to y and says hi to ily.
Existing examples (do not repeat; 8):
    - [exception] simply
    - [correct] He easily finished the puzzle in ten minutes.
    - [correct] She spoke quietly during the meeting.
    - [incorrect] finaly  ->  finally
    - [incorrect] happyly  ->  happily
    - [incorrect] slowley  ->  slowly
    - [incorrect] quickley  ->  quickly
    - [correct] She answered the question quickly and clearly.
Existing exercises (do not repeat; showing 0 of 0):


### irregular-past-go — Irregular past: go / went
Rule: Go does not take -ed in the past tense. Its past form is the irregular word went.
Memory hint: Go, went, gone — learn the whole set together.
Existing examples (do not repeat; 8):
    - [incorrect] We goed to the warehouse.  ->  We went to the warehouse.
    - [correct] She went to the meeting.
    - [incorrect] She goed home.  ->  She went home.
    - [correct] After lunch, they went to the park.
    - [incorrect] He has went home.  ->  He has gone home.
    - [correct] We went swimming yesterday.
    - [correct] She has gone to the shop.
    - [incorrect] They have went to bed.  ->  They have gone to bed.
Existing exercises (do not repeat; showing 1 of 1):
    - [fill_gap] Tom is not here. He has ___ to the shop.  =>  gone

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
