You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 4 rules below write **14 new examples and 14 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### able-vs-ible — -able versus -ible endings
Rule: Some adjectives end in -able and others in -ible, and there is no simple rule, so these words are often best learned individually, like available and possible.
Memory hint: Able is common; ible likes to hide in short roots.
Existing examples (do not repeat; 7):
    - [correct] It is possible to finish the project early.
    - [correct] The tickets are still available online.
    - [incorrect] responsable  ->  responsible
    - [incorrect] availible  ->  available
    - [correct] The menu was readable even in poor light.
    - [incorrect] accessable  ->  accessible
    - [incorrect] readible  ->  readable
Existing exercises (do not repeat; showing 0 of 0):


### accept-vs-except — Accept or except
Rule: Accept means to agree to take something. Except means not including.
Memory hint: Accept an offer; except one item.
Existing examples (do not repeat; 8):
    - [incorrect] Everyone came accept me.  ->  Everyone came except me.
    - [correct] She decided to accept the invitation.
    - [incorrect] I will except the offer.  ->  I will accept the offer.
    - [correct] All the shops were open except one.
    - [correct] I accept your apology.
    - [correct] Everyone except Tom arrived on time.
    - [incorrect] They welcomed everyone accept the last guest.  ->  They welcomed everyone except the last guest.
    - [incorrect] I cannot except this gift.  ->  I cannot accept this gift.
Existing exercises (do not repeat; showing 6 of 6):
    - [fill_gap] I cannot ___ his excuse.  =>  accept
    - [fill_gap] Everybody ___ Anna joined the trip.  =>  except
    - [multiple_choice] Choose the word: She was happy to ___ the job.  =>  accept  (choices: accept / except)
    - [multiple_choice] Choose the word: We work every day ___ Sunday.  =>  except  (choices: accept / except)
    - [fill_gap] Do you ___ credit cards here?  =>  accept
    - [fill_gap] All the windows ___ this one were closed.  =>  except

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
