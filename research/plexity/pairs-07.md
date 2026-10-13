
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **25 new sentences for each of these 8 pairs**, 200 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### what-that (level B1)
Words: what / that
Meaning: what = что (то, что); that = что (союз)
Rule: what = "the thing that" · that = joins two parts (I think that…)
Existing sentences (do not repeat these ideas):
    - I think ___ you're absolutely right.  [that]
    - This is exactly ___ I wanted.  [what]
    - She said ___ she was too tired.  [that]
    - Can you explain ___ happened yesterday?  [what]
    - I'm glad ___ you called me back.  [that]

### sail-swim (level B1)
Words: sail / swim
Meaning: sail = плыть (на судне); swim = плавать (самому)
Rule: sail = travel by boat · swim = move in water yourself
Existing sentences (do not repeat these ideas):
    - We watched the yacht ___ into the harbour.  [sail]
    - Can your little sister ___ yet?  [swim]
    - They plan to ___ around the Greek islands.  [sail]
    - I love to ___ in the sea in the morning.  [swim]
    - The boat will ___ at first light.  [sail]

### miss-fail (level B1)
Words: miss / fail
Meaning: miss = пропустить, опоздать; скучать; fail = провалить, не сдать
Rule: miss = not catch, not attend, not have · fail = not pass, not succeed
Existing sentences (do not repeat these ideas):
    - If we hurry, we won't ___ the bus.  [miss]
    - He may ___ his driving test again.  [fail]
    - I really ___ my grandparents.  [miss]
    - Too many students ___ this exam every year.  [fail]
    - She didn't ___ a single lesson last term.  [miss]

### win-beat (level B1)
Words: win / beat
Meaning: win = выиграть (игру, приз); beat = победить (кого-то)
Rule: win a game / a prize · beat a person or a team
Existing sentences (do not repeat these ideas):
    - Our team managed to ___ the champions.  [beat]
    - She hopes to ___ the race this year.  [win]
    - Nobody expected me to ___ Jake at chess.  [beat]
    - He wants to ___ a scholarship.  [win]
    - United ___ City two-nil last night.  [beat]

### lend-borrow-loan (level B1)
Words: lend / borrow / loan
Meaning: lend = одолжить (дать); borrow = взять взаймы; loan = заём, кредит
Rule: lend = give for a while · borrow = take for a while · a loan = money you borrow
Existing sentences (do not repeat these ideas):
    - Can I ___ your umbrella for tonight?  [borrow]
    - I'll ___ you my charger after lunch.  [lend]
    - The bank refused our home ___.  [loan]
    - Never ___ money you can't afford to lose.  [lend]
    - She used a student ___ to pay fees.  [loan]

### story-history (level A2)
Words: story / history
Meaning: story = история, рассказ; history = история (прошлое, предмет)
Rule: story = a tale, what happened to someone · history = the past, the school subject
Existing sentences (do not repeat these ideas):
    - My grandad told us a funny ___.  [story]
    - She's studying ___ at university.  [history]
    - That book has a sad love ___.  [story]
    - The museum shows the town's ___.  [history]
    - Tell me the whole ___ from the beginning.  [story]

### road-way (level A2)
Words: road / way
Meaning: road = дорога (улица, шоссе); way = путь, дорога (куда); способ
Rule: road = the real street · way = the route or the method (the way to the station)
Existing sentences (do not repeat these ideas):
    - This ___ gets icy in winter.  [road]
    - Is this the right ___ to the station?  [way]
    - They live on a quiet country ___.  [road]
    - Show me the easiest ___ to open it.  [way]
    - The main ___ was closed after the storm.  [road]

### price-prize (level A2)
Words: price / prize
Meaning: price = цена; prize = приз
Rule: price = how much it costs · prize = what you get for winning
Existing sentences (do not repeat these ideas):
    - What's the ___ of this blue jacket?  [price]
    - She won first ___ in the art contest.  [prize]
    - The shop reduced the ___ of milk.  [price]
    - His ___ was a weekend in Edinburgh.  [prize]
    - I checked the ___ before buying it.  [price]

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

