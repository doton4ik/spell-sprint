
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Write **20 new sentences for each of these 6 pairs**, 120 sentences in total. Use the `id` exactly as written as `pairId` in the answer. Where the rule above and a sentence pull in different directions, follow the rule.

### whose-whos (level B1)
Words: whose / who's
Meaning: whose = чей; who's = кто есть = who is / who has
Rule: whose = belongs to which person · who's = who is or who has
Existing sentences (do not repeat these ideas):
    - Do you know ___ bag is left on the bus?  [whose]
    - I don't know ___ coming to the party tonight.  [who's]
    - ___ car is parked in front of my garage?  [whose]
    - She is the girl ___ been living next door.  [who's]
    - I know a girl ___ father is a lawyer.  [whose]
    - ___ little child is this? Where are his parents?  [whose]
    - I wonder ___ going to be at the party.  [who's]
    - We need to know ___ going to be there.  [who's]

### accept-except (level B1)
Words: accept / except
Meaning: accept = принимать; except = кроме
Rule: accept = take or agree to (verb) · except = not including
Existing sentences (do not repeat these ideas):
    - Please ___ this small gift from all of us.  [accept]
    - Everyone came to the party ___ Tom, who was ill.  [except]
    - Do you ___ credit cards in your little shop?  [accept]
    - The museum is open every day ___ Monday.  [except]
    - I had no choice but to ___ the offer.  [accept]
    - Are you too proud to ___ a little help?  [accept]
    - I'll give you any of them ___ this one.  [except]
    - ___ for the storm, I would have arrived earlier.  [except]

### write-right (level A2)
Words: write / right
Meaning: write = писать; right = правый; правильный; право
Rule: write = put words on paper · right = correct, or the opposite of left
Existing sentences (do not repeat these ideas):
    - Please ___ your name at the top of the page.  [write]
    - Turn ___ at the next traffic lights and go straight.  [right]
    - You are ___ about the price of the tickets.  [right]
    - I will ___ you a long letter next week.  [write]
    - I know how to ___ a letter in English.  [write]
    - All you have to do is ___ it down.  [write]
    - Now that you say it, I think you're ___.  [right]
    - She doesn't have a lot of money ___ now.  [right]

### hear-here (level A2)
Words: hear / here
Meaning: hear = слышать; here = здесь
Rule: hear = listen with your ears · here = in this place
Existing sentences (do not repeat these ideas):
    - Can you ___ the music from your room?  [hear]
    - Please sit ___ next to me on the sofa.  [here]
    - I can't ___ you, so please speak louder.  [hear]
    - Come ___ and look at these old photos.  [here]
    - I would be very happy to ___ from her.  [hear]
    - If you've got a better idea, let's ___ it.  [hear]
    - We can go if you don't like it ___.  [here]
    - What time did I tell you to get ___?  [here]

### wear-where (level A2)
Words: wear / where
Meaning: wear = носить (одежду); where = где, куда
Rule: wear = have clothes on · where = in or to which place
Existing sentences (do not repeat these ideas):
    - I like to ___ a hat when it is sunny.  [wear]
    - ___ did you put my keys this morning?  [where]
    - Do you know ___ the nearest bank is?  [where]
    - You don't have to ___ a tie at this office.  [wear]
    - He didn't have anything to ___ for the party.  [wear]
    - If it is cold outside, we ___ warm clothes.  [wear]
    - I need you to tell me ___ to go.  [where]
    - No one asked me ___ I wanted to go.  [where]

### break-brake (level B1)
Words: break / brake
Meaning: break = ломать; перерыв; brake = тормоз; тормозить
Rule: break = to damage, or a rest · brake = the part that stops a vehicle
Existing sentences (do not repeat these ideas):
    - Press the ___ gently when the road is wet.  [brake]
    - Let's take a short ___ and have some coffee.  [break]
    - Be careful not to ___ the glass on the shelf.  [break]
    - The ___ on my bike does not work well.  [brake]
    - I don't know when I can take a ___.  [break]
    - I had to ___ a window to get in.  [break]
    - He put his foot on the ___ suddenly.  [brake]
    - He didn't ___ in time, and ran into a tree.  [brake]

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
