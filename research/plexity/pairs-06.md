
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **25 new sentences for each of these 8 pairs**, 200 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### look-see-watch (level A2)
Words: look / see / watch
Meaning: look = смотреть (направить взгляд); see = видеть; watch = смотреть, наблюдать (за чем-то движущимся)
Rule: look at = turn your eyes to · see = notice with your eyes · watch = look for a time (TV, a match)
Existing sentences (do not repeat these ideas):
    - Can you ___ at my screen for a second?  [look]
    - I can't ___ anything without my glasses.  [see]
    - We usually ___ a film on Fridays.  [watch]
    - Did you ___ the man in the blue coat?  [see]
    - Please ___ the soup so it doesn't boil over.  [watch]

### other-another (level A2)
Words: other / another
Meaning: other = другой, другие, остальные; another = ещё один; другой (один)
Rule: another = one more, + singular (another cup) · other = + plural, or after the/my
Existing sentences (do not repeat these ideas):
    - Can I have ___ cup of tea?  [another]
    - My ___ shoes are under the bed.  [other]
    - Let's try ___ restaurant tonight.  [another]
    - Where are the ___ children?  [other]
    - She needs ___ minute to finish.  [another]

### still-yet-already (level B1)
Words: still / yet / already
Meaning: still = всё ещё; yet = ещё (в отрицаниях); уже (в вопросах); already = уже
Rule: still = continuing · yet = not yet / …yet? at the end · already = sooner than expected
Existing sentences (do not repeat these ideas):
    - Are you ready to go ___?  [yet]
    - I have ___ done my homework.  [already]
    - She is ___ waiting outside.  [still]
    - He hasn't called me ___.  [yet]
    - We were ___ eating when they arrived.  [still]

### dictionary-vocabulary (level B1)
Words: dictionary / vocabulary
Meaning: dictionary = словарь (книга, приложение); vocabulary = словарный запас
Rule: dictionary = a book or app of words · vocabulary = the words you know
Existing sentences (do not repeat these ideas):
    - My English ___ is better than last year.  [vocabulary]
    - Use a ___ if you don't know the word.  [dictionary]
    - This app helps you build your ___.  [vocabulary]
    - I checked the spelling in my ___.  [dictionary]
    - Her scientific ___ is very strong.  [vocabulary]

### possibility-opportunity (level B1)
Words: possibility / opportunity
Meaning: possibility = возможность, вероятность (что-то может случиться); opportunity = возможность, шанс (сделать что-то)
Rule: possibility = something might happen · opportunity = a good chance to do something
Existing sentences (do not repeat these ideas):
    - There is a real ___ of snow tonight.  [possibility]
    - This job is a great ___ for graduates.  [opportunity]
    - We should discuss every ___ before deciding.  [possibility]
    - She had the ___ to work abroad.  [opportunity]
    - Is there any ___ the train will be late?  [possibility]

### homework-housework (level A2)
Words: homework / housework
Meaning: homework = домашнее задание; housework = работа по дому
Rule: homework = tasks from school · housework = cleaning, washing, ironing
Existing sentences (do not repeat these ideas):
    - I can't go out until I finish my ___.  [homework]
    - She does most of the ___ on Saturdays.  [housework]
    - Our maths ___ took two hours last night.  [homework]
    - Nobody enjoys ironing and other ___.  [housework]
    - The teacher checked our ___ this morning.  [homework]

### for-during (level B1)
Words: for / during
Meaning: for = в течение (сколько времени); during = во время (чего)
Rule: for + how long (for three weeks) · during + when, an event (during the lesson)
Existing sentences (do not repeat these ideas):
    - We stayed there ___ three weeks.  [for]
    - Nobody answered my calls ___ the meeting.  [during]
    - She lived in Leeds ___ a year.  [for]
    - He fell asleep ___ the lesson.  [during]
    - I waited outside ___ ten minutes.  [for]

### good-well (level A2)
Words: good / well
Meaning: good = хороший; well = хорошо; здоров
Rule: good = adjective (a good idea, smells good) · well = adverb (speaks well), or healthy
Existing sentences (do not repeat these ideas):
    - She speaks English very ___.  [well]
    - It was a really ___ idea.  [good]
    - I'm not feeling very ___ today.  [well]
    - The soup smells really ___ today.  [good]
    - You did the exercise quite ___.  [well]

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

