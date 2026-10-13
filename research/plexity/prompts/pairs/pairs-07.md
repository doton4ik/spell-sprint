
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **20 new sentences for each of these 6 pairs**, 120 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### discover-invent (level B1)
Words: discover / invent
Meaning: discover = открыть, обнаружить (то, что уже было); invent = изобрести (новое)
Rule: discover = find something that already exists · invent = make something new
Existing sentences (do not repeat these ideas):
    - Scientists hope to ___ a better battery.  [invent]
    - We were surprised to ___ an old photo album in the loft.  [discover]
    - She wants to ___ something useful one day.  [invent]
    - Divers hope to ___ the wreck of an old ship.  [discover]
    - Who was the first person to ___ the telephone?  [invent]
    - Scientists hope to ___ a new kind of plant in the forest.  [discover]
    - Some day I would like to ___ a machine that cleans my room.  [invent]
    - You may ___ a lovely cafe if you walk down this street.  [discover]

### borrow-rent (level B1)
Words: borrow / rent
Meaning: borrow = взять на время (бесплатно); rent = арендовать, снимать (за деньги)
Rule: borrow = use and give back, free · rent = pay to use
Existing sentences (do not repeat these ideas):
    - Can I ___ your bike this afternoon?  [borrow]
    - We decided to ___ a car in Glasgow.  [rent]
    - They ___ a flat near the station.  [rent]
    - May I ___ your pen for a minute?  [borrow]
    - We ___ a flat in the city for four hundred euros a month.  [rent]
    - May I ___ your bike? Mine has a flat tyre.  [borrow]
    - Tourists can ___ bicycles at the station for ten euros a day.  [rent]
    - Can I ___ a book from you? I will return it on Monday.  [borrow]

### suit-fit (level A2)
Words: suit / fit
Meaning: suit = идти (кому-то), подходить (по времени); fit = подходить по размеру
Rule: fit = the right size · suit = look good on you, or be convenient
Existing sentences (do not repeat these ideas):
    - These shoes don't ___ me any more.  [fit]
    - Friday would ___ us better than Thursday.  [suit]
    - Does this jacket ___ across the shoulders?  [fit]
    - A later time might ___ everyone.  [suit]
    - This blue jacket does not ___ me; it is too small.  [fit]
    - A short haircut would ___ you.  [suit]
    - Will all our bags ___ in the boot?  [fit]
    - Blue and green ___ you, but yellow does not.  [suit]

### policy-politics (level B2)
Words: policy / politics
Meaning: policy = политика, правила (организации); politics = политика (государство, партии)
Rule: policy = a plan or rules (refund policy) · politics = government and parties
Existing sentences (do not repeat these ideas):
    - The company changed its holiday ___.  [policy]
    - He never talks about ___ at family dinners.  [politics]
    - What's your school's phone-use ___?  [policy]
    - She studied ___ at university.  [politics]
    - Our refund ___ is printed on the receipt.  [policy]
    - The school has a strict ___ on mobile phones.  [policy]
    - She is studying ___ and history at university.  [politics]
    - The company has a new ___ about working from home.  [policy]

### choice-chance (level B1)
Words: choice / chance
Meaning: choice = выбор; chance = шанс, вероятность
Rule: choice = choosing between options · chance = a possibility
Existing sentences (do not repeat these ideas):
    - You have no ___ but to apologise.  [choice]
    - There's a good ___ of rain later.  [chance]
    - Blue was an easy ___ for the walls.  [choice]
    - Is there any ___ I can change my seat?  [chance]
    - The menu offers plenty of ___ for vegetarians.  [choice]
    - You have a ___ between tea and coffee.  [choice]
    - There is a good ___ of rain tomorrow.  [chance]
    - It was a hard ___ because I liked both shirts.  [choice]

### offer-suggest (level B1)
Words: offer / suggest
Meaning: offer = предлагать (дать что-то); suggest = предлагать (идею), советовать
Rule: offer = say you will give or do something · suggest = give an idea
Existing sentences (do not repeat these ideas):
    - Can I ___ you some tea?  [offer]
    - I ___ taking the earlier train.  [suggest]
    - The waiter will ___ dessert later.  [offer]
    - Can you ___ a good place for lunch near here?  [suggest]
    - Can I ___ you a cup of tea?  [offer]
    - I ___ going to the cinema on Friday.  [suggest]
    - The shop will ___ a ten percent discount.  [offer]
    - Can you ___ a good place to eat?  [suggest]

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
