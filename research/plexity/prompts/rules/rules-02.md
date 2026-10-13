# NEW, SEPARATE TASK (rules-02)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: advice-vs-advise, affect-vs-effect.
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 2 rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### advice-vs-advise — Advice or advise
Rule: Advice is a noun for a suggestion. Advise is a verb meaning to give a suggestion.
Memory hint: Advice is a thing; advise is an action.
Existing examples (do not repeat; 8):
    - [correct] Her advice helped me choose a course.
    - [incorrect] I need your advise.  ->  I need your advice.
    - [correct] I advise you to check the details.
    - [incorrect] Please advice me.  ->  Please advise me.
    - [correct] My teacher gave me useful advice.
    - [correct] Can you advise me which book to buy?
    - [incorrect] He gave me good advise.  ->  He gave me good advice.
    - [incorrect] I advice you to start early.  ->  I advise you to start early.
Existing exercises (do not repeat; showing 6 of 6):
    - [fill_gap] She asked her friend for ___ about the exam.  =>  advice
    - [fill_gap] I would ___ you not to wait.  =>  advise
    - [multiple_choice] Choose the word: Thank you for your ___.  =>  advice  (choices: advice / advise)
    - [multiple_choice] Choose the word: The doctor will ___ you what to eat.  =>  advise  (choices: advice / advise)
    - [fill_gap] That is a good piece of ___.  =>  advice
    - [fill_gap] Who can ___ me on the best route?  =>  advise

### affect-vs-effect — Affect vs effect
Rule: Affect is usually a verb meaning to influence something. Effect is usually a noun meaning the result.
Memory hint: Affect = Action, Effect = End result.
Existing examples (do not repeat; 8):
    - [incorrect] The delay will effect the delivery.  ->  The delay will affect the delivery.
    - [correct] The delay had a big effect.
    - [incorrect] The new rule had an affect.  ->  The new rule had an effect.
    - [incorrect] Noise can effect sleep.  ->  Noise can affect sleep.
    - [correct] The cold may affect how quickly the medicine takes effect.
    - [correct] Heat can affect the colour of the paint.
    - [correct] The new law took effect in May.
    - [incorrect] Her kind words had a good affect on me.  ->  Her kind words had a good effect on me.
Existing exercises (do not repeat; showing 2 of 2):
    - [fill_gap] Too much sugar can ___ your teeth.  =>  affect
    - [fill_gap] The side ___ of the pill is sleepiness.  =>  effect

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
