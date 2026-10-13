
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **25 new sentences for each of these 3 pairs**, 75 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### its-its (level A2)
Words: its / it's
Meaning: its = его, её (о предмете, животном); it's = это есть = it is / it has
Rule: its = belongs to it · it's = it is or it has
Existing sentences (do not repeat these ideas):
    - The dog hurt ___ leg while playing in the park.  [its]
    - ___ raining again, so take an umbrella.  [it's]
    - The company is moving ___ office to a new city.  [its]
    - I think ___ time for us to go home.  [it's]
    - It looks like a storm is on ___ way.  [its]
    - A place for everything and everything in ___ place.  [its]
    - It'll go away on ___ own in two weeks.  [its]
    - I think now ___ time for us to leave.  [it's]
    - I can't find it. Are you sure ___ here?  [it's]
    - My job is the same as ___ always been.  [it's]

### to-too-two (level A2)
Words: to / too / two
Meaning: to = к, в, чтобы; too = слишком; тоже; two = два
Rule: to = direction or before a verb · too = more than needed, or also · two = the number 2
Existing sentences (do not repeat these ideas):
    - We waited ___ hours for the train yesterday.  [two]
    - It is far ___ hot to walk in the afternoon.  [too]
    - I am going ___ the market with my mother.  [to]
    - You like this band, and I like them, ___.  [too]
    - She has ___ brothers and one younger sister.  [two]
    - I need time ___ think about all of this.  [to]
    - I see why you don't want ___ go there.  [to]
    - Tell him you love him before it's ___ late!  [too]
    - I couldn't do that because I was ___ busy.  [too]
    - He will be back in a day or ___.  [two]
    - Don't try doing ___ things at the same time.  [two]
    - May I have this for ___ or three days?  [two]

### their-there-theyre (level A2)
Words: their / there / they're
Meaning: their = их; there = там; there is — есть; they're = они (есть) = they are
Rule: their = belongs to them · there = place, or "there is" · they're = they are
Existing sentences (do not repeat these ideas):
    - The children forgot ___ lunch boxes at school.  [their]
    - Put the bags over ___, next to the door.  [there]
    - ___ going to be late again today.  [they're]
    - Is ___ a chemist near here?  [there]
    - My neighbours sold ___ car last month.  [their]
    - I told them what I thought of ___ plan.  [their]
    - The parents are playing a game with ___ children.  [their]
    - Each person knows ___ situation better than anyone else.  [their]
    - Do you think we can get ___ in time?  [there]
    - I'll be home by the time you get ___.  [there]
    - ___ are still things that we need to do.  [there]
    - Do you have any idea what ___ talking about?  [they're]
    - There's no one in the house. ___ all outside.  [they're]
    - What else do you think ___ planning to do?  [they're]

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

