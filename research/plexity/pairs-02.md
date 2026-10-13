
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **25 new sentences for each of these 8 pairs**, 200 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### lose-miss (level B1)
Words: lose / miss
Meaning: lose = терять; проигрывать; miss = пропустить; скучать по
Rule: lose = cannot find or not win · miss = be too late for, or feel sad without someone
Existing sentences (do not repeat these ideas):
    - Hurry up, or we will ___ the last bus.  [miss]
    - Don't ___ your wallet on the crowded train.  [lose]
    - We will ___ you very much when you leave.  [miss]
    - I always ___ my keys when I am in a hurry.  [lose]

### hope-wait (level A2)
Words: hope / wait
Meaning: hope = надеяться; wait = ждать
Rule: hope = want something to happen · wait = stay until something happens
Existing sentences (do not repeat these ideas):
    - I ___ you feel better very soon.  [hope]
    - Please ___ here until I come back.  [wait]
    - I can't ___ to see you again in June.  [wait]
    - We ___ that the weather will be good on Saturday.  [hope]

### fewer-less (level B1)
Words: fewer / less
Meaning: fewer = меньше (о том, что можно посчитать); less = меньше (о том, что нельзя посчитать)
Rule: fewer = a smaller number of things you can count · less = a smaller amount
Existing sentences (do not repeat these ideas):
    - There are ___ students in our class than last year.  [fewer]
    - I drink ___ coffee than I used to.  [less]
    - We made ___ mistakes in this test than in the last one.  [fewer]
    - You should spend ___ time on your phone every day.  [less]

### job-work (level A2)
Words: job / work
Meaning: job = работа, должность (одна, конкретная); work = работа, труд (вообще, неисчисляемое)
Rule: a job = a position you have · work = what you do, uncountable (no "a work")
Existing sentences (do not repeat these ideas):
    - She found a new ___ in a bookshop.  [job]
    - I have too much ___ this week.  [work]
    - Please turn off your phone and ___ quietly.  [work]
    - Cleaning windows is hard ___.  [work]

### house-home (level A2)
Words: house / home
Meaning: house = дом (здание); home = дом, где ты живёшь; домой
Rule: house = the building · home = where you live (go home, at home — no "to", no "the")
Existing sentences (do not repeat these ideas):
    - I'm going ___ after class.  [home]
    - She stayed at ___ with the baby.  [home]
    - That old ___ needs a new roof.  [house]
    - The builders are painting the ___ next to ours.  [house]

### all-whole (level B1)
Words: all / whole
Meaning: all = все, весь; whole = целый, весь (одна вещь целиком)
Rule: the whole + singular (the whole day) · all + plural or all the (all the students)
Existing sentences (do not repeat these ideas):
    - I spent the ___ day cleaning the flat.  [whole]
    - ___ the students passed the test.  [all]
    - She ate the ___ cake by herself.  [whole]
    - The ___ family came to dinner.  [whole]

### among-between (level B1)
Words: among / between
Meaning: among = среди (в группе); between = между (двумя, или каждым по отдельности)
Rule: between = two things, or clear separate ones · among = in a group, a crowd
Existing sentences (do not repeat these ideas):
    - The bank is ___ the post office and the chemist's.  [between]
    - She felt nervous ___ strangers.  [among]
    - Please split the bill ___ you and me.  [between]
    - Her house is hidden ___ the tall trees.  [among]

### hear-listen (level A2)
Words: hear / listen
Meaning: hear = слышать; listen = слушать
Rule: hear = sound reaches you · listen (to) = you pay attention
Existing sentences (do not repeat these ideas):
    - Can you ___ the music next door?  [hear]
    - Please ___ carefully to the instructions.  [listen]
    - I didn't ___ my phone ring.  [hear]
    - The children never ___ in class.  [listen]

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

