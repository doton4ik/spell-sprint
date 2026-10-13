
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **25 new sentences for each of these 8 pairs**, 200 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### borrow-lend (level A2)
Words: borrow / lend
Meaning: borrow = брать взаймы, одолжить (у кого-то); lend = давать взаймы, одолжить (кому-то)
Rule: borrow = take something for a short time · lend = give something for a short time
Existing sentences (do not repeat these ideas):
    - Can I ___ your pen for a minute?  [borrow]
    - Could you ___ me some money until Friday?  [lend]
    - I never ___ books from the library without a card.  [borrow]
    - My uncle will ___ us his car for the weekend.  [lend]

### say-tell (level A2)
Words: say / tell
Meaning: say = сказать; tell = сказать (кому-то), рассказать
Rule: say = speak words (say hello) · tell = give information to someone (tell me)
Existing sentences (do not repeat these ideas):
    - Please ___ me the truth about the accident.  [tell]
    - What did he ___ about the film last night?  [say]
    - Did she ___ hello when she came in?  [say]
    - Can you ___ us the way to the station?  [tell]

### rob-steal (level B1)
Words: rob / steal
Meaning: rob = грабить (место, человека); steal = красть (вещь)
Rule: rob = take things from a person or place · steal = take a thing that is not yours
Existing sentences (do not repeat these ideas):
    - Two men tried to ___ the bank on Monday.  [rob]
    - Someone tried to ___ my bike yesterday.  [steal]
    - It is a crime to ___ money from shops.  [steal]
    - They planned to ___ an old lady in the street.  [rob]

### remember-remind (level A2)
Words: remember / remind
Meaning: remember = помнить, вспоминать; remind = напоминать (кому-то)
Rule: remember = keep in your mind · remind = make someone remember
Existing sentences (do not repeat these ideas):
    - I can't ___ where I parked the car.  [remember]
    - Please ___ me to call my mother tonight.  [remind]
    - Do you ___ the name of that restaurant?  [remember]
    - This song always seems to ___ me of summer.  [remind]

### bring-take (level A2)
Words: bring / take
Meaning: bring = приносить, приводить (сюда); take = относить, отводить, брать (отсюда)
Rule: bring = carry towards the speaker · take = carry away from the speaker
Existing sentences (do not repeat these ideas):
    - Waiter, could you ___ us the bill, please?  [bring]
    - I will ___ this parcel to the post office.  [take]
    - Could you ___ me a glass of water, please?  [bring]
    - Don't forget to ___ the rubbish out tonight.  [take]

### fun-funny (level A2)
Words: fun / funny
Meaning: fun = веселье, удовольствие; funny = смешной
Rule: fun = enjoyment · funny = makes you laugh (or strange)
Existing sentences (do not repeat these ideas):
    - We had a lot of ___ at the beach.  [fun]
    - He told a very ___ joke, and everyone laughed.  [funny]
    - Skiing with friends is great ___ in winter.  [fun]
    - My little brother makes ___ faces at the camera.  [funny]

### economic-economical (level B2)
Words: economic / economical
Meaning: economic = экономический; economical = экономный, выгодный
Rule: economic = about the economy · economical = saving money or fuel
Existing sentences (do not repeat these ideas):
    - The country has serious ___ problems at the moment.  [economic]
    - It is more ___ to buy food in large packs.  [economical]
    - She studies ___ history at university.  [economic]
    - A small car is cheaper and more ___ to run.  [economical]

### sensible-sensitive (level B1)
Words: sensible / sensitive
Meaning: sensible = разумный, здравомыслящий; sensitive = чувствительный
Rule: sensible = showing good judgement · sensitive = easily hurt or affected
Existing sentences (do not repeat these ideas):
    - It is ___ to take a warm coat in winter.  [sensible]
    - My skin is very ___ to the sun.  [sensitive]
    - He is a ___ person who always thinks before acting.  [sensible]
    - Be kind to her, because she is very ___.  [sensitive]

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

