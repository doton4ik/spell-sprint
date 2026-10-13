You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 4 rules below write **14 new examples and 14 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### irregular-past-common — Common irregular past verbs
Rule: Many common verbs change spelling in the past. Buy becomes bought, teach becomes taught, and think becomes thought.
Memory hint: Bought, brought and thought share ought.
Existing examples (do not repeat; 8):
    - [incorrect] buyed  ->  bought
    - [correct] She bought some bread yesterday.
    - [incorrect] teached  ->  taught
    - [correct] The teacher taught us a new song.
    - [correct] He told me the news yesterday.
    - [correct] We found the keys under the sofa.
    - [incorrect] She tolded me a secret.  ->  She told me a secret.
    - [incorrect] I finded my wallet.  ->  I found my wallet.
Existing exercises (do not repeat; showing 6 of 6):
    - [correct_word] sayed  =>  said
    - [correct_word] maked  =>  made
    - [spell] Spell the word: the past form of leave.  =>  left
    - [spell] Spell the word: the past form of keep.  =>  kept
    - [fill_gap] She ___ me a postcard from Paris. (прислала)  =>  sent
    - [multiple_choice] Choose the correct past form of meet.  =>  met  (choices: meeted / met / meat)

### irregular-plurals — Common irregular plurals
Rule: Some plural nouns do not use -s or -es. Child becomes children, mouse becomes mice and person becomes people.
Memory hint: Child becomes children; mouse becomes mice.
Existing examples (do not repeat; 8):
    - [incorrect] mouses  ->  mice
    - [correct] Two mice ran across the floor.
    - [incorrect] childs  ->  children
    - [correct] The children played outside all afternoon.
    - [correct] The women met at the station.
    - [correct] The geese flew over the lake.
    - [incorrect] The childs are in the garden.  ->  The children are in the garden.
    - [incorrect] Two sheeps stood by the gate.  ->  Two sheep stood by the gate.
Existing exercises (do not repeat; showing 6 of 6):
    - [correct_word] oxes  =>  oxen
    - [correct_word] mouses  =>  mice
    - [spell] Spell the word: more than one man.  =>  men
    - [correct_word] feets  =>  feet
    - [multiple_choice] Choose the correct plural of child.  =>  children  (choices: childs / childen / children)
    - [fill_gap] Look at those ___ in the field. (овцы)  =>  sheep

### comparatives-er-est — Comparatives with -er and -est
Rule: Short adjectives often add -er or -est. Double a final consonant after a short vowel, change final y to i, or drop a final e.
Memory hint: Big doubles; happy changes y; nice drops e.
Existing examples (do not repeat; 9):
    - [correct] This room is bigger than ours.
    - [incorrect] biger  ->  bigger
    - [correct] She chose the nicest cake.
    - [exception] good → better → best
    - [incorrect] happyer  ->  happier
    - [correct] My bag is lighter than yours.
    - [correct] This is the happiest day of my life.
    - [incorrect] She is the tinyest girl in class.  ->  She is the tiniest girl in class.
    - [incorrect] It got much bigger and hoter.  ->  It got much bigger and hotter.
Existing exercises (do not repeat; showing 6 of 6):
    - [correct_word] sunnyer  =>  sunnier
    - [correct_word] fatest  =>  fattest
    - [spell] Spell the word: the comparative form of wide.  =>  wider
    - [spell] Spell the word: the superlative form of big.  =>  biggest
    - [multiple_choice] Choose the superlative of busy.  =>  busiest  (choices: busyest / busiest / busiiest)
    - [fill_gap] The ___ day of summer is in June. (самый длинный)  =>  longest

### double-consonants — Double consonants
Rule: Some common words need doubled letters. Learn the whole visual pattern instead of relying only on sound.
Memory hint: Tomorrow has a double r; useful has one l.
Existing examples (do not repeat; 6):
    - [incorrect] tomorow  ->  tomorrow
    - [correct] beginning
    - [correct] recommended
    - [correct] Write your address clearly on the form.
    - [incorrect] adress  ->  address
    - [incorrect] succes  ->  success
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
