
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **20 new sentences for each of these 6 pairs**, 120 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### piece-peace (level B1)
Words: piece / peace
Meaning: piece = кусок, кусочек; peace = мир; покой
Rule: piece = a part of something · peace = no war, or calm and quiet
Existing sentences (do not repeat these ideas):
    - Would you like a ___ of cake with your tea?  [piece]
    - The two countries finally made ___ after a long war.  [peace]
    - I need some ___ and quiet to study today.  [peace]
    - She gave me a small ___ of paper with her number.  [piece]
    - He wrote a letter on a ___ of paper.  [piece]
    - I'd like to give you a ___ of advice.  [piece]
    - She loves the ___ and quiet of the town.  [peace]
    - People all over the world are anxious for ___.  [peace]

### meat-meet (level A2)
Words: meat / meet
Meaning: meat = мясо; meet = встречать(ся), знакомиться
Rule: meat = food from animals · meet = see or come together with someone
Existing sentences (do not repeat these ideas):
    - She does not eat ___ or fish at all.  [meat]
    - Let's ___ in front of the cinema at six.  [meet]
    - It is nice to ___ you at last.  [meet]
    - This ___ is too salty for me.  [meat]
    - Are you sure there's no ___ in this soup?  [meat]
    - Do you have many friends who don't eat ___?  [meat]
    - We used to ___ on our way to school.  [meet]
    - Come on. There's someone I want you to ___.  [meet]

### whole-hole (level B1)
Words: whole / hole
Meaning: whole = целый, весь; hole = дыра, яма
Rule: whole = all of something · hole = an empty space in something
Existing sentences (do not repeat these ideas):
    - He ate the ___ pizza by himself last night.  [whole]
    - There is a big ___ in my left sock.  [hole]
    - The dog dug a deep ___ in the garden.  [hole]
    - I spent the ___ day reading in the library.  [whole]
    - We are going to stay there the ___ week.  [whole]
    - I just want to forget about the ___ thing.  [whole]
    - Be careful. There's a ___ in the floor.  [hole]
    - We've got to fill this ___ with something.  [hole]

### flour-flower (level B1)
Words: flour / flower
Meaning: flour = мука; flower = цветок
Rule: flour = powder for baking bread · flower = the colourful part of a plant
Existing sentences (do not repeat these ideas):
    - Mix the eggs with ___ and sugar in a bowl.  [flour]
    - She put a red ___ in her hair.  [flower]
    - We need more ___ to bake bread tonight.  [flour]
    - Every ___ in the garden was open this morning.  [flower]
    - This cake contains ___, milk, eggs and sugar.  [flour]
    - There was no ___ in the shop.  [flour]
    - My uncle has a ___ shop near the station.  [flower]
    - That red ___ over there is very pretty.  [flower]

### allowed-aloud (level B2)
Words: allowed / aloud
Meaning: allowed = разрешённый; aloud = вслух
Rule: allowed = permitted · aloud = in a voice that people can hear
Existing sentences (do not repeat these ideas):
    - Phones are not ___ in the exam room.  [allowed]
    - She read the letter ___ to her grandfather.  [aloud]
    - He laughed ___ at the joke in the film.  [aloud]
    - Children are not ___ to swim here without adults.  [allowed]
    - Will we be ___ to eat during the meeting?  [allowed]
    - My father ___ me to go to the concert.  [allowed]
    - Please read it ___ so that everyone can hear.  [aloud]
    - Read ___ what you have written.  [aloud]

### passed-past (level B1)
Words: passed / past
Meaning: passed = сдал; прошёл; передал; past = мимо; прошлое
Rule: passed = verb (went by, handed, succeeded) · past = beyond, or earlier time
Existing sentences (do not repeat these ideas):
    - He ___ his driving test on Friday morning.  [passed]
    - We walked ___ the old church on our way home.  [past]
    - In the ___, people wrote many more letters.  [past]
    - She ___ me the salt without saying a word.  [passed]
    - Five years have ___ since they came to Japan.  [passed]
    - The story lived on, ___ from person to person.  [passed]
    - I've been studying French for the ___ three years.  [past]
    - I need to understand what happened in the ___.  [past]

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
