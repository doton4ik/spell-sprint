# NEW, SEPARATE TASK (rules-17)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: your-vs-youre, a-or-an.
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 2 rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### your-vs-youre — Your vs you're
Rule: Your shows that something belongs to you. You're is short for you are.
Memory hint: If you can say "you are", use you're.
Existing examples (do not repeat; 8):
    - [incorrect] Your welcome.  ->  You're welcome.
    - [correct] Your invoice is ready.
    - [incorrect] Your very kind.  ->  You're very kind.
    - [incorrect] You're bag is heavy.  ->  Your bag is heavy.
    - [correct] Your brother said you're coming soon.
    - [correct] You're welcome to stay.
    - [correct] Your answer is correct.
    - [incorrect] Is that you're coat?  ->  Is that your coat?
Existing exercises (do not repeat; showing 1 of 1):
    - [fill_gap] I hope ___ feeling better today.  =>  you're

### a-or-an — A or an: the sound decides  (article rule)
Rule: Use a before a consonant SOUND and an before a vowel SOUND. Listen to the first sound of the next word, not its first letter: an hour (the h is silent), a university (it starts with the sound "yoo").
Memory hint: Say the next word aloud. Does it start with a vowel sound? Then an.
Existing examples (do not repeat; 9):
    - [correct] an hour
    - [correct] a university
    - [correct] an MBA
    - [incorrect] She is a honest person.  ->  She is an honest person.
    - [incorrect] It was an European tradition.  ->  It was a European tradition.
    - [exception] a one-way ticket
    - [correct] He gave me an honest answer.
    - [correct] She owns a unique painting.
    - [incorrect] He is an university student.  ->  He is a university student.
Existing exercises (do not repeat; showing 14 of 14):
    - [multiple_choice] She studies at ___ university in London.  =>  a  (choices: a / an)
    - [multiple_choice] We waited for ___ hour.  =>  an  (choices: a / an)
    - [multiple_choice] He is ___ honest man.  =>  an  (choices: a / an)
    - [multiple_choice] She wants to visit ___ European country.  =>  a  (choices: a / an)
    - [multiple_choice] I need ___ umbrella, it is raining.  =>  an  (choices: a / an)
    - [multiple_choice] He has ___ one-year contract.  =>  a  (choices: a / an)
    - [multiple_choice] She has ___ MBA from a good school.  =>  an  (choices: a / an)
    - [multiple_choice] This is ___ useful tool.  =>  a  (choices: a / an)
    - [multiple_choice] Can I have ___ egg, please?  =>  an  (choices: a / an)
    - [multiple_choice] That was ___ unusual question.  =>  an  (choices: a / an)
    - [multiple_choice] My sister is ___ engineer.  =>  an  (choices: a / an)
    - [multiple_choice] I saw ___ one-eyed cat in the garden.  =>  a  (choices: a / an)
    - [multiple_choice] He is ___ honourable man.  =>  an  (choices: a / an)
    - [multiple_choice] She wants ___ useful gift.  =>  a  (choices: a / an)

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
