You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 4 rules below write **14 new examples and 14 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### tion-vs-sion — Nouns ending in -tion or -sion
Rule: Some nouns end in -tion, like information. Others end in -sion, like decision and discussion. Learn the ending with each word.
Memory hint: Information takes tion; decision takes sion.
Existing examples (do not repeat; 8):
    - [correct] We had a discussion after the film.
    - [incorrect] decition  ->  decision
    - [incorrect] informasion  ->  information
    - [correct] The information was easy to find.
    - [correct] The instructions were clear.
    - [correct] We watched a television show.
    - [incorrect] They gave us permition.  ->  They gave us permission.
    - [incorrect] The explanasion was short.  ->  The explanation was short.
Existing exercises (do not repeat; showing 6 of 6):
    - [correct_word] revition  =>  revision
    - [correct_word] condision  =>  condition
    - [spell] Spell the word: the place where a train stops for passengers (one word, -tion).  =>  station
    - [spell] Spell the word: the answer to a problem.  =>  solution
    - [fill_gap] Please answer the last ___. (вопрос)  =>  question
    - [multiple_choice] Choose the correct spelling: entering a country by force.  =>  invasion  (choices: invation / invasion / invacion)

### plural-es — Plural nouns with -es
Rule: Add -es to most nouns ending in s, x, z, ch or sh. Box becomes boxes.
Memory hint: A hissing ending needs an extra e.
Existing examples (do not repeat; 9):
    - [correct] She wears two watches on special occasions.
    - [incorrect] watchs  ->  watches
    - [correct] We packed the boxes before lunch.
    - [exception] stomach → stomachs
    - [incorrect] boxs  ->  boxes
    - [correct] I put two sandwiches in my bag.
    - [correct] The churches in the town are old.
    - [incorrect] She sliced two peachs.  ->  She sliced two peaches.
    - [incorrect] The bosss met yesterday.  ->  The bosses met yesterday.
Existing exercises (do not repeat; showing 6 of 6):
    - [correct_word] benchs  =>  benches
    - [correct_word] taxs  =>  taxes
    - [spell] Spell the word: more than one wish.  =>  wishes
    - [spell] Spell the word: more than one class.  =>  classes
    - [fill_gap] Please wash the ___. (посуду)  =>  dishes
    - [multiple_choice] Choose the correct plural of match.  =>  matches  (choices: matchs / matches / matchies)

### plural-f-to-ves — Plural nouns with -ves
Rule: Some nouns ending in f or fe change that ending to -ves in the plural. Knife becomes knives.
Memory hint: A knife loses fe and gains ves.
Existing examples (do not repeat; 9):
    - [incorrect] wifes  ->  wives
    - [exception] roof → roofs; chef → chefs
    - [correct] The knives are in the kitchen drawer.
    - [incorrect] knifes  ->  knives
    - [correct] Several leaves fell from the tree.
    - [correct] The two wives were sisters.
    - [correct] The scarves hung by the door.
    - [incorrect] The shelfs are full of books.  ->  The shelves are full of books.
    - [incorrect] Three wolfs crossed the road.  ->  Three wolves crossed the road.
Existing exercises (do not repeat; showing 6 of 6):
    - [correct_word] calfs  =>  calves
    - [correct_word] thiefs  =>  thieves
    - [spell] Spell the word: more than one knife.  =>  knives
    - [spell] Spell the word: more than one elf.  =>  elves
    - [multiple_choice] Choose the correct plural of life.  =>  lives  (choices: lifes / lives / livs)
    - [multiple_choice] Choose the correct plural of leaf.  =>  leaves  (choices: leafs / leaves / leavs)

### plural-y-to-ies — Plural: y becomes ies
Rule: When a noun ends in a consonant plus y, change y to i and add es to form the plural.
Memory hint: Company to companies; one lonely y turns into two i's.
Existing examples (do not repeat; 8):
    - [incorrect] companys  ->  companies
    - [correct] delivery -> deliveries
    - [incorrect] dairys  ->  dairies
    - [correct] The berries were fresh and sweet.
    - [incorrect] cherrys  ->  cherries
    - [correct] The libraries open at nine.
    - [correct] The bakeries sell fresh bread.
    - [incorrect] The factorys closed early.  ->  The factories closed early.
Existing exercises (do not repeat; showing 1 of 1):
    - [multiple_choice] Choose the plural of hobby.  =>  hobbies  (choices: hobbys / hobbies / hobbyes)

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
