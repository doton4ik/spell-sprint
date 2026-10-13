You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 4 rules below write **14 new examples and 14 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### practice-vs-practise — Practice or practise
Rule: In British English, practice is a noun. Practise is a verb.
Memory hint: Practise with s is something you do.
Existing examples (do not repeat; 8):
    - [incorrect] I want to practice speaking.  ->  I want to practise speaking.
    - [correct] I practise speaking English each morning.
    - [incorrect] Daily practise is useful.  ->  Daily practice is useful.
    - [correct] Regular practice improves spelling.
    - [correct] Practice makes perfect.
    - [correct] We practise the dialogue together.
    - [incorrect] She needs more practise.  ->  She needs more practice.
    - [incorrect] They practice the song before class.  ->  They practise the song before class.
Existing exercises (do not repeat; showing 6 of 6):
    - [fill_gap] The football ___ starts at five.  =>  practice
    - [fill_gap] I ___ my English with a friend.  =>  practise
    - [multiple_choice] Choose the word: It takes a lot of ___ to write well.  =>  practice  (choices: practice / practise)
    - [multiple_choice] Choose the word: Please ___ the new words daily.  =>  practise  (choices: practice / practise)
    - [fill_gap] After hours of ___, she played perfectly.  =>  practice
    - [fill_gap] We ___ spelling on the bus.  =>  practise

### principal-vs-principle — Principal or principle
Rule: Principal means main or a head teacher. Principle is a basic belief or rule.
Memory hint: Principal is main; principle is a rule.
Existing examples (do not repeat; 8):
    - [correct] The principal reason was the price.
    - [incorrect] Honesty is an important principal.  ->  Honesty is an important principle.
    - [incorrect] The principle reason was cost.  ->  The principal reason was cost.
    - [correct] Fairness is an important principle.
    - [correct] The principal thanked the students.
    - [correct] It is against my principles to cheat.
    - [incorrect] The principle of the school is kind.  ->  The principal of the school is kind.
    - [incorrect] He lives by strong principals.  ->  He lives by strong principles.
Existing exercises (do not repeat; showing 6 of 6):
    - [fill_gap] The ___ cause of the delay was snow.  =>  principal
    - [fill_gap] She refuses to lie as a matter of ___.  =>  principle
    - [multiple_choice] Choose the word: The ___ of the college gave a speech.  =>  principal  (choices: principal / principle)
    - [multiple_choice] Choose the word: Honesty is a basic ___.  =>  principle  (choices: principal / principle)
    - [fill_gap] Our ___ aim is to help beginners.  =>  principal
    - [fill_gap] It is the same ___ in every science.  =>  principle

### quiet-vs-quite — Quiet or quite
Rule: Quiet means making little noise. Quite means fairly or rather.
Memory hint: Quiet sounds soft; quite means fairly.
Existing examples (do not repeat; 8):
    - [incorrect] The film was quiet interesting.  ->  The film was quite interesting.
    - [incorrect] The room was quite after lunch.  ->  The room was quiet after lunch.
    - [correct] The book was quite interesting.
    - [correct] The library is quiet in the morning.
    - [correct] The baby is quiet now.
    - [correct] It was quite a long journey.
    - [incorrect] Please be quite in the library.  ->  Please be quiet in the library.
    - [incorrect] The exam was quiet easy.  ->  The exam was quite easy.
Existing exercises (do not repeat; showing 6 of 6):
    - [fill_gap] The village is very ___ at night.  =>  quiet
    - [fill_gap] I was ___ tired after the trip.  =>  quite
    - [multiple_choice] Choose the word: Keep ___, the neighbours are sleeping.  =>  quiet  (choices: quiet / quite)
    - [multiple_choice] Choose the word: That is ___ a good idea.  =>  quite  (choices: quiet / quite)
    - [fill_gap] It is ___ cold outside.  =>  quite
    - [fill_gap] He is a ___ boy who reads a lot.  =>  quiet

### silent-letters — Silent letters
Rule: Some English words contain letters that are written but not pronounced. Learning these silent letters helps you spell tricky words correctly.
Memory hint: The k in knife is silent, just like the w in write.
Existing examples (do not repeat; 6):
    - [correct] She decided to write a letter to her friend.
    - [correct] The chef used a sharp knife to cut the bread.
    - [incorrect] rite  ->  write
    - [incorrect] nife  ->  knife
    - [incorrect] lam  ->  lamb
    - [correct] The lamb slept beside the old fence.
Existing exercises (do not repeat; showing 0 of 0):


## Examples (14 per rule)

- 6 of type "correct": a natural sentence that uses the rule correctly. 8 of type "incorrect": a sentence with the typical mistake learners make, and the same sentence corrected in "correction" (only the mistake changes). One mistake per sentence.
- "note": a short reason, at most 80 characters, naming the point of the rule ("Soft c before e: city, not sity").
- Sentences of 5-14 words, everyday topics, different words and structures. Easy words except the target of the rule.
- A word that is spelled wrongly must be a spelling mistake a real learner makes, not a random typo.

## Exercises (14 per rule), mix of these types

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
