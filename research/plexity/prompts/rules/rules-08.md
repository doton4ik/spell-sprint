You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 4 rules below write **14 new examples and 14 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

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

### weather-vs-whether — Weather or whether
Rule: Weather is the condition outside. Whether introduces a question or a choice.
Memory hint: Weather is outside; whether is a choice.
Existing examples (do not repeat; 8):
    - [correct] The weather improved before our walk.
    - [correct] I asked whether the shop was open.
    - [incorrect] The whether is cold today.  ->  The weather is cold today.
    - [incorrect] I wonder weather she is home.  ->  I wonder whether she is home.
    - [correct] The weather is sunny today.
    - [correct] I am not sure whether it will rain.
    - [incorrect] I asked weather it was ready.  ->  I asked whether it was ready.
    - [incorrect] The whether is nice in spring.  ->  The weather is nice in spring.
Existing exercises (do not repeat; showing 6 of 6):
    - [fill_gap] We do not know ___ the train is late.  =>  whether
    - [fill_gap] The ___ was windy all week.  =>  weather
    - [multiple_choice] Choose the word: Nobody knows ___ he will come.  =>  whether  (choices: weather / whether)
    - [multiple_choice] Choose the word: Today’s ___ forecast says rain.  =>  weather  (choices: weather / whether)
    - [fill_gap] She cannot decide ___ to stay or leave.  =>  whether
    - [fill_gap] In hot ___ we drink more water.  =>  weather

### were-where-wear — Were, where or wear
Rule: Were is a past form of be. Where asks about a place; wear means to have clothes on.
Memory hint: Where is a place; wear is clothes.
Existing examples (do not repeat; 8):
    - [correct] We were tired after the walk.
    - [correct] Where do you wear that jacket?
    - [incorrect] I will where a coat.  ->  I will wear a coat.
    - [incorrect] Where you at home yesterday?  ->  Were you at home yesterday?
    - [correct] Where did you put my keys?
    - [correct] They were happy to see us.
    - [incorrect] I forgot were I parked.  ->  I forgot where I parked.
    - [incorrect] We always where warm clothes here.  ->  We always wear warm clothes here.
Existing exercises (do not repeat; showing 6 of 6):
    - [fill_gap] ___ is the post office?  =>  where
    - [fill_gap] What do you ___ to school?  =>  wear
    - [fill_gap] The shops ___ closed on Sunday.  =>  were
    - [multiple_choice] Choose the word: Do you know ___ the exit is?  =>  where  (choices: were / where / wear)
    - [multiple_choice] Choose the word: You ___ right about the date.  =>  were  (choices: were / where / wear)
    - [multiple_choice] Choose the word: I need to ___ a helmet.  =>  wear  (choices: were / where / wear)

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
