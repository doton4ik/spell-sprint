# NEW, SEPARATE TASK (rules-21)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: a-with-jobs-and-quantities.
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 1 rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### a-with-jobs-and-quantities — A / an with jobs, per, and quantity words  (article rule)
Rule: Use a / an with a job when you say what someone is: She is a teacher. Use a / an to mean per: twice a week, ten pounds an hour. Quantity expressions also take a: a few, a little, a lot of, half an hour, such a, what a. Few and little without a mean "not enough".
Memory hint: A job, a week, a few, a little: the little word a is needed.
Existing examples (do not repeat; 9):
    - [correct] My mother is an engineer.
    - [correct] She goes to the gym twice a week.
    - [correct] What a beautiful day!
    - [incorrect] He works as waiter.  ->  He works as a waiter.
    - [incorrect] It takes half hour.  ->  It takes half an hour.
    - [exception] Few people came. / A few people came.
    - [correct] My brother is a dentist.
    - [correct] She phones her mother three times a week.
    - [incorrect] He is dentist.  ->  He is a dentist.
Existing exercises (do not repeat; showing 14 of 14):
    - [multiple_choice] My mother is ___ engineer.  =>  an  (choices: a / an / the / no article)
    - [multiple_choice] He works as ___ waiter.  =>  a  (choices: a / an / the / no article)
    - [multiple_choice] She goes to the gym twice ___ week.  =>  a  (choices: a / an / the / no article)
    - [multiple_choice] Don't worry. We still have ___ few days left.  =>  a  (choices: a / an / the / no article)
    - [multiple_choice] What ___ beautiful day!  =>  a  (choices: a / an / the / no article)
    - [multiple_choice] She is such ___ kind person.  =>  a  (choices: a / an / the / no article)
    - [multiple_choice] There is ___ little milk left, enough for our tea.  =>  a  (choices: a / an / the / no article)
    - [multiple_choice] It takes half ___ hour to get there.  =>  an  (choices: a / an / the / no article)
    - [multiple_choice] He earns twelve pounds ___ hour.  =>  an  (choices: a / an / the / no article)
    - [multiple_choice] My neighbour is ___ pilot.  =>  a  (choices: a / an / the / no article)
    - [multiple_choice] He works as ___ electrician.  =>  an  (choices: a / an / the / no article)
    - [multiple_choice] She drives at ninety kilometres ___ hour.  =>  an  (choices: a / an / the / no article)
    - [multiple_choice] What ___ lovely garden!  =>  a  (choices: a / an / the / no article)
    - [multiple_choice] I drink coffee twice ___ day.  =>  a  (choices: a / an / the / no article)

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

One array with one object per rule listed in this round. The shape (the values are placeholders, NOT content to copy):

[
  {"slug": "<a slug from the list above>",
   "examples": [{"type": "correct", "text": "<sentence>", "note": "<short reason>"},
                {"type": "incorrect", "text": "<sentence with the typical mistake>", "correction": "<the same sentence corrected>", "note": "<short reason>"}],
   "exercises": [{"type": "fill_gap", "prompt": "<sentence with one ___>", "answer": "<word>"},
                 {"type": "multiple_choice", "prompt": "<sentence with ___>", "answer": "<word>", "choices": ["<word>", "<word>"]}]}
]

Use the slug exactly as written. Before you answer, check every item against the rule above: wrong sentences must really be wrong, correct ones really correct, each exercise has exactly one answer.

## How to answer (important)

- Put the WHOLE answer in ONE code block (three backticks + json). Outside a code block the chat removes the underscores of the gaps (___) and breaks the JSON.
- Compact JSON: one item per line, no comments, no text before or after the code block.
- Never stop in the middle of an item. If you run out of room, end after the last COMPLETE item and close all brackets; I will ask you to continue.
