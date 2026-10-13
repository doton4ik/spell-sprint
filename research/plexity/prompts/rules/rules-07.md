You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 4 rules below write **14 new examples and 14 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

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


### then-vs-than — Then or than
Rule: Then refers to time or the next step. Than is used when comparing things.
Memory hint: Then is time; than compares.
Existing examples (do not repeat; 8):
    - [correct] This coat is warmer than mine.
    - [incorrect] We ate and than left.  ->  We ate and then left.
    - [correct] We finished dinner, then went home.
    - [incorrect] She is taller then me.  ->  She is taller than me.
    - [correct] Add the flour, then mix well.
    - [correct] Tea is cheaper than coffee here.
    - [incorrect] I would rather read then watch TV.  ->  I would rather read than watch TV.
    - [incorrect] First we eat, than we go out.  ->  First we eat, then we go out.
Existing exercises (do not repeat; showing 6 of 6):
    - [fill_gap] My brother is older ___ me.  =>  than
    - [fill_gap] Finish your homework, ___ you can play.  =>  then
    - [multiple_choice] Choose the word: She runs faster ___ I do.  =>  than  (choices: then / than)
    - [multiple_choice] Choose the word: Turn left, ___ go straight.  =>  then  (choices: then / than)
    - [fill_gap] It was better ___ nothing.  =>  than
    - [fill_gap] If you are tired, ___ rest.  =>  then

### there-vs-their — There vs their vs they're
Rule: There points to a place or starts a sentence (there is). Their shows that something belongs to them. They're is short for they are.
Memory hint: Their has "heir" in it: it belongs to someone.
Existing examples (do not repeat; 8):
    - [incorrect] Their is a meeting at noon.  ->  There is a meeting at noon.
    - [correct] Their truck arrived late.
    - [correct] They left their coats there by the door.
    - [incorrect] The coats are over their.  ->  The coats are over there.
    - [incorrect] There house is small.  ->  Their house is small.
    - [correct] There are three chairs in the room.
    - [correct] They said they're ready to start.
    - [incorrect] Their going to be late.  ->  They're going to be late.
Existing exercises (do not repeat; showing 1 of 1):
    - [fill_gap] Do you know where ___ house is?  =>  their

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
