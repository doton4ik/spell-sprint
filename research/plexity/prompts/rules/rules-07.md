# NEW, SEPARATE TASK (rules-07)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: its-vs-its-contraction, soft-c-and-g.
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 2 rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### its-vs-its-contraction — Its vs it's
Rule: Its (no apostrophe) shows that something belongs to it. It's is short for it is or it has.
Memory hint: If you can say "it is", use it's.
Existing examples (do not repeat; 8):
    - [incorrect] The company changed it's name.  ->  The company changed its name.
    - [correct] It's a large warehouse.
    - [incorrect] The dog ate it's food.  ->  The dog ate its food.
    - [incorrect] Its a sunny day.  ->  It's a sunny day.
    - [correct] The bird opened its wings because it's ready to fly.
    - [correct] The company announced its new plan.
    - [correct] It's a pleasure to meet you.
    - [incorrect] The team lost it's last game.  ->  The team lost its last game.
Existing exercises (do not repeat; showing 1 of 1):
    - [fill_gap] The old bridge lost ___ charm.  =>  its

### soft-c-and-g — Keep e after soft c and g
Rule: Keep e after soft c or g before a suffix beginning with a or o. Notice becomes noticeable, and courage becomes courageous.
Memory hint: Keep e so c and g stay soft.
Existing examples (do not repeat; 8):
    - [correct] The change was noticeable after a week.
    - [incorrect] noticable  ->  noticeable
    - [correct] It was courageous of her to speak up.
    - [incorrect] couragous  ->  courageous
    - [correct] The price was outrageous.
    - [correct] The stain is hardly noticeable.
    - [incorrect] It was an advantagous deal.  ->  It was an advantageous deal.
    - [incorrect] The rule is not enforcable.  ->  The rule is not enforceable.
Existing exercises (do not repeat; showing 6 of 6):
    - [correct_word] outragous  =>  outrageous
    - [correct_word] peacable  =>  peaceable
    - [spell] Spell the word: giving you an advantage.  =>  advantageous
    - [spell] Spell the word: able to be charged to an account.  =>  chargeable
    - [multiple_choice] Choose the correct spelling: able to be pronounced.  =>  pronounceable  (choices: pronouncable / pronounceable / pronounciable)
    - [multiple_choice] Choose the correct spelling: very beautiful.  =>  gorgeous  (choices: gorgous / gorgeous / gorgius)

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
