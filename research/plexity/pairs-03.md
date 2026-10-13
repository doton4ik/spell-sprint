
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **25 new sentences for each of these 8 pairs**, 200 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### teach-learn-study (level A2)
Words: teach / learn / study
Meaning: teach = учить (кого-то), преподавать; learn = учить, выучить (самому); study = учиться, заниматься, изучать
Rule: teach = give knowledge · learn = get knowledge · study = spend time learning
Existing sentences (do not repeat these ideas):
    - My mum will ___ me how to cook rice.  [teach]
    - I'm trying to ___ ten new words today.  [learn]
    - She needs to ___ for her biology exam.  [study]
    - We usually ___ in the library after lunch.  [study]

### sink-drown (level B2)
Words: sink / drown
Meaning: sink = тонуть, идти ко дну (о предметах); drown = утонуть, погибнуть в воде
Rule: sink = go down under water (boats, stones) · drown = die in water (people, animals)
Existing sentences (do not repeat these ideas):
    - The boat began to ___ after the crash.  [sink]
    - Heavy stones ___ straight to the bottom.  [sink]
    - Lifeguards rescued the child before he could ___.  [drown]
    - The damaged ship may ___ by morning.  [sink]

### travel-trip (level A2)
Words: travel / trip
Meaning: travel = путешествовать; trip = поездка
Rule: travel = a verb (to travel) · a trip = one journey there and back (a school trip)
Existing sentences (do not repeat these ideas):
    - I want to ___ around Europe next summer.  [travel]
    - Our school ___ to York was brilliant.  [trip]
    - Do you usually ___ by train or coach?  [travel]
    - The business ___ lasted only one day.  [trip]

### robber-thief (level B1)
Words: robber / thief
Meaning: robber = грабитель (с угрозой, силой); thief = вор (тайно)
Rule: thief = steals secretly · robber = takes things by force or threat
Existing sentences (do not repeat these ideas):
    - Police caught the bike ___ yesterday.  [thief]
    - A masked ___ entered the bank.  [robber]
    - Someone called me a ___ after the joke.  [thief]
    - The ___ threatened the cashier with a knife.  [robber]

### salary-wage (level B2)
Words: salary / wage
Meaning: salary = оклад (в месяц, в год); wage = зарплата (почасовая, недельная)
Rule: salary = fixed pay per month or year · wage = pay per hour, day or week
Existing sentences (do not repeat these ideas):
    - She earns a good ___ as an accountant.  [salary]
    - Farm workers demanded a higher hourly ___.  [wage]
    - His annual ___ increased in April.  [salary]
    - The company promised to raise the minimum ___.  [wage]

### historic-historical (level B2)
Words: historic / historical
Meaning: historic = исторический (важный, знаменательный); historical = исторический (о прошлом, об истории)
Rule: historic = very important in history · historical = about the past (historical novels)
Existing sentences (do not repeat these ideas):
    - It was a ___ moment for the country.  [historic]
    - She loves reading ___ novels.  [historical]
    - The castle is a ___ building.  [historic]
    - They signed a ___ peace agreement.  [historic]

### end-finish (level A2)
Words: end / finish
Meaning: end = заканчиваться (сам); finish = заканчивать (что-то делать)
Rule: end = stop, come to the last part · finish = complete what you are doing
Existing sentences (do not repeat these ideas):
    - The film will ___ at half past nine.  [end]
    - Please ___ your soup before dessert.  [finish]
    - The summer holidays ___ next Monday.  [end]
    - I must ___ this report tonight.  [finish]

### win-earn (level B1)
Words: win / earn
Meaning: win = выиграть; earn = зарабатывать
Rule: win = get by playing or luck · earn = get by working
Existing sentences (do not repeat these ideas):
    - I hope we ___ the quiz tonight.  [win]
    - Doctors often ___ more than teachers.  [earn]
    - Our team can still ___ the match.  [win]
    - Students can ___ some money in the summer holidays.  [earn]

## Rules for every sentence

1. **Exactly one `___`**, and exactly one option fits. Read the sentence with every option: if two sound natural, drop it.
2. **The context must decide the answer.** A learner who knows the rule gets it right; one who doesn't can't guess from grammar alone.
3. **No leaks:** the sentence must not contain any other option of the same pair, or another form of the answer word.
4. **5–16 words**, starts with a capital letter (or with `___`), ends with `.`, `?` or `!`, no double spaces.
5. **Easy surrounding vocabulary.** The learner is tested on the pair, not on hard words. The level of the pair (A2 / B1 / B2)
   sets the level of the other words: A2 = everyday words, B1 = general topics, B2 = work, news, abstract.
6. **Neutral content**: everyday life, school, work, travel, home, food, health, hobbies, technology, nature, shopping.
   No politics, religion, violence, brands, rude words.
7. **Variety**, per pair: the gap at the start, middle and end; statements, questions, negatives, commands, "if / because / when" sentences,
   short dialogue lines; different subjects, tenses and topics; different names. Never two sentences with the same frame
   and one changed word. Do not follow a template.
8. **Balance:** each word of the pair is the answer a similar number of times (for 2 words about 50/50;
   for 3 words about a third each). Mix the order, no pattern.
9. Use only real English words as options. Never invent misspellings. Use standard British rules where the pair differs
   between British and American usage (practice/practise, licence/license), and write only sentences that are correct under
   the British rule.
10. Write the sentences yourself. Do not copy from textbooks, dictionaries or websites.


## Output format — JSON only, nothing else

```json
[
  {
    "pairId": "their-there-theyre",
    "add": [
      { "text": "The kids left ___ shoes by the door.", "answer": "their" },
      { "text": "___ a good chance it will rain tonight.", "answer": "there" }
    ]
  }
]
```

- `pairId` must be exactly an id from the list.
- `answer` must be exactly one of the pair's words, spelled the same as in the list (including apostrophes, e.g. `they're`).
- No comments, no markdown outside the code block, no explanations.


## Before you answer, check yourself

For each sentence: (a) test every option in the gap, (b) confirm only one works, (c) confirm no leak (rule 3), (d) count words
(5–16), (e) confirm no sentence is a near copy of another one in your answer. Remove any sentence that fails.

