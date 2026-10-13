
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **20 new sentences for each of these 6 pairs**, 120 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### economy-economics (level B2)
Words: economy / economics
Meaning: economy = экономика (страны); economics = экономика (наука, предмет)
Rule: economy = the money system of a country · economics = the subject you study
Existing sentences (do not repeat these ideas):
    - She is studying ___ at Bristol.  [economics]
    - Tourism is important for the island's ___.  [economy]
    - His degree in ___ helped him get the job.  [economics]
    - The national ___ grew last quarter.  [economy]
    - She studies ___ at university.  [economics]
    - The country's ___ grew slowly last year.  [economy]
    - My brother has a degree in ___.  [economics]

### notice-note (level B2)
Words: notice / note
Meaning: notice = заметить; note = отметить, записать; обратить внимание
Rule: notice = see, become aware · note = write down, or "please note" = pay attention
Existing sentences (do not repeat these ideas):
    - Did you ___ her new haircut?  [notice]
    - Please ___ your seat number on the form.  [note]
    - I didn't ___ the sign by the gate.  [notice]
    - Please ___ that the shop closes early on Sundays.  [note]
    - Did you ___ the new painting on the wall?  [notice]
    - Please ___ the date of the meeting in your diary.  [note]
    - I did not ___ that my bag was open.  [notice]

### custom-habit (level B2)
Words: custom / habit
Meaning: custom = обычай; habit = привычка
Rule: custom = a tradition of a group · habit = something one person often does
Existing sentences (do not repeat these ideas):
    - Drinking tea at four is a local ___.  [custom]
    - Biting his nails is a bad ___.  [habit]
    - In this village, it's a wedding ___.  [custom]
    - She got into the ___ of running early.  [habit]
    - Removing shoes indoors is a common ___.  [custom]
    - In some countries, it is a ___ to take off your shoes at the door.  [custom]
    - Shaking hands is a common ___ when people meet.  [custom]

### careful-caring (level B1)
Words: careful / caring
Meaning: careful = осторожный, аккуратный; caring = заботливый
Rule: careful = paying attention to avoid danger · caring = kind, looking after others
Existing sentences (do not repeat these ideas):
    - Be ___ with that hot pan.  [careful]
    - She's a very ___ nurse.  [caring]
    - He is patient and ___ with children.  [caring]
    - Workers must be ___ near the machines.  [careful]
    - Be ___ when you cross the busy road.  [careful]
    - A ___ father helps with homework and cooks dinner.  [caring]
    - Please be ___ with the glass; it breaks easily.  [careful]

### excuse-apologise (level B1)
Words: excuse / apologise
Meaning: excuse = извинить, простить; apologise = извиниться
Rule: excuse me / excuse someone · apologise (to someone) = say sorry yourself
Existing sentences (do not repeat these ideas):
    - Please ___ me for being late.  [excuse]
    - You should ___ to your sister.  [apologise]
    - ___ me, is this seat free?  [excuse]
    - He forgot to ___ after the mistake.  [apologise]
    - I want to ___ for being late.  [apologise]
    - Please ___ my bad handwriting; I was in a hurry.  [excuse]
    - We ___ for the long delay.  [apologise]

### then-than (level A2)
Words: then / than
Meaning: then = потом, тогда; than = чем (в сравнении)
Rule: then = at that time or next · than = used to compare
Existing sentences (do not repeat these ideas):
    - She is much taller ___ her older brother.  [than]
    - Finish your dinner, and ___ you can watch TV.  [then]
    - First wash the rice, and ___ cook it slowly.  [then]
    - Travelling by train is cheaper ___ flying to Spain.  [than]
    - I ate one and ___ I ate the other.  [then]
    - No one could be sure what would happen ___.  [then]
    - He has a lot more money ___ I have.  [than]
    - I'm better at looking after children ___ you are.  [than]

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


## How to answer (important)

- Put the WHOLE answer in ONE code block (three backticks + json). Outside a code block the chat removes the underscores of the gaps (___) and breaks the JSON.
- Compact JSON: one item per line, no comments, no text before or after the code block.
- Never stop in the middle of an item. If you run out of room, end after the last COMPLETE item and close all brackets; I will ask you to continue.
