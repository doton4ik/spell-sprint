
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **25 new sentences for each of these 8 pairs**, 200 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### wait-expect (level B1)
Words: wait / expect
Meaning: wait = ждать (оставаться, пока); expect = ожидать, рассчитывать (что будет)
Rule: wait (for) = stay until something happens · expect = think something will happen
Existing sentences (do not repeat these ideas):
    - Please ___ here while I check the order.  [wait]
    - I didn't ___ such a long reply.  [expect]
    - We had to ___ outside the clinic.  [wait]
    - I can't ___ any longer in this queue.  [wait]

### worth-worthy (level B2)
Words: worth / worthy
Meaning: worth = стоящий (be worth + -ing / цена); worthy = достойный
Rule: be worth + -ing or a price (worth reading) · worthy = deserving (a worthy cause)
Existing sentences (do not repeat these ideas):
    - This book is ___ reading twice.  [worth]
    - The film wasn't ___ the ticket price.  [worth]
    - They support several ___ charities.  [worthy]
    - Is it ___ driving that far for lunch?  [worth]

### price-value (level B1)
Words: price / value
Meaning: price = цена (сколько платишь); value = ценность, стоимость (чего стоит)
Rule: price = the money you pay · value = how much something is worth or how important
Existing sentences (do not repeat these ideas):
    - The ___ of petrol has gone up again.  [price]
    - What was the ___ of your flight?  [price]
    - Good friends add ___ to your life.  [value]
    - The shop lowered the ___ by five pounds.  [price]

### economy-economics (level B2)
Words: economy / economics
Meaning: economy = экономика (страны); economics = экономика (наука, предмет)
Rule: economy = the money system of a country · economics = the subject you study
Existing sentences (do not repeat these ideas):
    - She is studying ___ at Bristol.  [economics]
    - Tourism is important for the island's ___.  [economy]
    - His degree in ___ helped him get the job.  [economics]
    - The national ___ grew last quarter.  [economy]

### actual-current (level B2)
Words: actual / current
Meaning: actual = фактический, настоящий; current = текущий, нынешний (актуальный)
Rule: actual = real (not "актуальный"!) · current = happening now
Existing sentences (do not repeat these ideas):
    - The ___ price is lower than we expected.  [actual]
    - Who is the ___ manager of the shop?  [current]
    - Please give the ___ number of guests.  [actual]
    - Our ___ plan may change tomorrow.  [current]

### learn-find-out (level B1)
Words: learn / find out
Meaning: learn = учить, научиться; find out = узнать, выяснить
Rule: learn = get knowledge or a skill · find out = discover a fact
Existing sentences (do not repeat these ideas):
    - I want to ___ Spanish before my trip.  [learn]
    - We need to ___ who broke the vase.  [find out]
    - Did you ever ___ why he was upset?  [find out]
    - Children ___ quickly through songs and games.  [learn]

### notice-note (level B2)
Words: notice / note
Meaning: notice = заметить; note = отметить, записать; обратить внимание
Rule: notice = see, become aware · note = write down, or "please note" = pay attention
Existing sentences (do not repeat these ideas):
    - Did you ___ her new haircut?  [notice]
    - Please ___ your seat number on the form.  [note]
    - I didn't ___ the sign by the gate.  [notice]
    - Please ___ that the shop closes early on Sundays.  [note]

### discover-invent (level B1)
Words: discover / invent
Meaning: discover = открыть, обнаружить (то, что уже было); invent = изобрести (новое)
Rule: discover = find something that already exists · invent = make something new
Existing sentences (do not repeat these ideas):
    - Scientists hope to ___ a better battery.  [invent]
    - We were surprised to ___ an old photo album in the loft.  [discover]
    - She wants to ___ something useful one day.  [invent]
    - Divers hope to ___ the wreck of an old ship.  [discover]

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

