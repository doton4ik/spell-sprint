
You are writing content for an English spelling trainer for Russian-speaking learners. The exercise is called
"Pairs": one sentence with a gap `___`, and 2–3 look-alike or sound-alike English words to choose from
(their / there / they're, affect / effect …). Exactly one option is right.


## Your task in this round

Create **4 NEW pairs** with **20 sentences each** (80 sentences). Use exactly these ids, levels and words (the options in `words` are separated by " / "; for a pair like "all together" the option is two words):

- id `anyone-any-one`, level B2, words: anyone / any one
- id `allusion-illusion`, level B2, words: allusion / illusion
- id `alter-altar`, level B2, words: alter / altar
- id `assure-ensure-insure`, level B2, words: assure / ensure / insure

The level tells how hard the other words in the sentences may be (A2 / B1 / B2). Meanings are Russian glosses (a few words), the hint is one line in English.

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

Answer with ONE JSON array containing one object per new pair, and no text outside it.

One object per pair, like this:

```json
{
  "id": "weather-whether",
  "level": "A2",
  "words": ["weather", "whether"],
  "meanings": { "weather": "погода", "whether": "ли" },
  "hint": "weather = rain, sun, wind · whether = if, with a choice",
  "sentences": [ { "text": "I do not know ___ she will come.", "answer": "whether" } ]
}
```

Rules for new pairs: pick words that Russian speakers really confuse; check the id is not in the list; at least 20 sentences;
`meanings` is a short Russian gloss per word; `hint` is one line with the rule in English, in the style above.
Ideas: homophones (wear / where / were, wait / weight, break / brake, whole / hole), look-alikes (affect / effect, advice / advise,
accept / except, adapt / adopt, loose / lose, than / then), and traps for Russians (sensible / sensitive, economic / economical,
historic / historical, principal / principle, desert / dessert).


## Before you answer, check yourself

For each sentence: (a) test every option in the gap, (b) confirm only one works, (c) confirm no leak (rule 3), (d) count words
(5–16), (e) confirm no sentence is a near copy of another one in your answer. Remove any sentence that fails.


## How to answer (important)

- Put the WHOLE answer in ONE code block (three backticks + json). Outside a code block the chat removes the underscores of the gaps (___) and breaks the JSON.
- Compact JSON: one item per line, no comments, no text before or after the code block.
- Never stop in the middle of an item. If you run out of room, end after the last COMPLETE item and close all brackets; I will ask you to continue.
