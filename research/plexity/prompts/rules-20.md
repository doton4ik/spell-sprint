# NEW, SEPARATE TASK (rules-20)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: the-geography, no-article-routine-places.
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 2 rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### the-geography — The with rivers, seas, mountain ranges and plural countries  (article rule)
Rule: Use the with oceans, seas, rivers and mountain ranges (the Atlantic, the Thames, the Alps), with plural names (the Netherlands, the United States) and with countries that have words like Kingdom, Republic or States in the name. Most single countries, cities, lakes and single mountains take no article: Japan, Lake Geneva, Mount Everest.
Memory hint: Water and groups take the. Single places walk alone.
Existing examples (do not repeat; 9):
    - [correct] We crossed the Atlantic Ocean by ship.
    - [correct] The Alps are popular for skiing.
    - [correct] She lives in the United States.
    - [incorrect] I want to visit the Japan.  ->  I want to visit Japan.
    - [incorrect] He climbed the Mount Everest.  ->  He climbed Mount Everest.
    - [exception] Lake Geneva
    - [correct] The Danube flows through several countries.
    - [correct] She has never visited Spain.
    - [incorrect] We flew to the Italy.  ->  We flew to Italy.
Existing exercises (do not repeat; showing 14 of 14):
    - [multiple_choice] We crossed ___ Atlantic Ocean by ship.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] She lives in ___ United States.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] He climbed ___ Mount Everest.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] ___ Alps are popular for skiing.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] We flew over ___ Pacific.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] They visited ___ Netherlands last year.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] ___ Lake Geneva is very deep.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] The longest river in Europe is ___ Volga.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] I want to visit ___ Japan.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] He lives in ___ United Kingdom.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] My cousin lives in ___ Philippines.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] We swam in ___ Red Sea.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] She wants to climb ___ Mount Fuji.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] They visited ___ Czech Republic.  =>  the  (choices: a / an / the / no article)

### no-article-routine-places — Routine places and transport: go to school, by bus  (article rule)
Rule: Some places and times are used for their normal purpose and take no article: go to school (as a pupil), go to work, be at home, go to bed, at night, by bus, by train. If you mean the building or one particular thing, use the: I am going to the school to speak to the teacher.
Memory hint: Normal use: no article. A particular building: the.
Existing examples (do not repeat; 9):
    - [correct] My son goes to school every morning.
    - [correct] We travelled to Rome by train.
    - [correct] I am going to the school to speak to his teacher.
    - [incorrect] I go to the work at eight.  ->  I go to work at eight.
    - [incorrect] She stays in the bed when she is ill.  ->  She stays in bed when she is ill.
    - [exception] I listen to the radio. We watched TV.
    - [correct] He goes to bed at ten.
    - [correct] He went to the school to talk to his son's teacher.
    - [incorrect] We went home by the bus.  ->  We went home by bus.
Existing exercises (do not repeat; showing 14 of 14):
    - [multiple_choice] My son is a pupil. He goes to ___ school every morning.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] I go to ___ work at eight.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] She stays in ___ bed when she is ill.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] We travelled to Rome by ___ train.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] I am visiting his teacher. I am going to ___ school to speak to her.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] He is at ___ home now.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] I always listen to ___ radio in the car.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] We watched ___ TV all evening.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] It is very cold at ___ night here.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] He is going to ___ bed early tonight.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] My father is at ___ work now.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] She came to ___ hospital to see her sick friend.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] What time do you finish ___ school?  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] We usually travel by ___ plane.  =>  no article  (choices: a / an / the / no article)

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
