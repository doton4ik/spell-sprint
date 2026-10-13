# NEW, SEPARATE TASK (rules-15)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: to-too-two, vowel-order-ei-ie.
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 2 rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### to-too-two — To, too or two
Rule: To shows direction or comes before a verb. Too means also or excessively; two means the number 2.
Memory hint: Two is a number; too is extra.
Existing examples (do not repeat; 8):
    - [incorrect] This bag is two heavy.  ->  This bag is too heavy.
    - [incorrect] I have to sisters.  ->  I have two sisters.
    - [correct] The two boys wanted to come too.
    - [correct] We walked to the park after lunch.
    - [correct] I want to learn two new words.
    - [correct] The soup is too salty.
    - [incorrect] She has to cats.  ->  She has two cats.
    - [incorrect] I am to tired to walk.  ->  I am too tired to walk.
Existing exercises (do not repeat; showing 6 of 6):
    - [fill_gap] It is ___ late to call him.  =>  too
    - [fill_gap] We bought ___ tickets for the show.  =>  two
    - [multiple_choice] Choose the word: I am going ___ the market.  =>  to  (choices: to / too / two)
    - [multiple_choice] Choose the word: This coat is ___ big for me.  =>  too  (choices: to / too / two)
    - [fill_gap] He wants ___ study medicine.  =>  to
    - [fill_gap] The ___ sisters live in Rome.  =>  two

### vowel-order-ei-ie — Vowel order: i and e
Rule: The order of i and e changes the spelling of a word. After c, most words use ei.
Memory hint: After c, use ei: receive.
Existing examples (do not repeat; 8):
    - [incorrect] recieve  ->  receive
    - [correct] believe
    - [exception] seize
    - [correct] My friend waited near the entrance.
    - [incorrect] freind  ->  friend
    - [correct] She received a letter from her niece.
    - [correct] The ceiling was painted white.
    - [incorrect] We need to wiegh the bag.  ->  We need to weigh the bag.
Existing exercises (do not repeat; showing 1 of 1):
    - [correct_word] wierd  =>  weird

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
