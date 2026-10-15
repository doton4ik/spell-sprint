# NEW, SEPARATE TASK (rules3-07.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Common irregular past verbs" (slug: irregular-past-common).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Common irregular past verbs
- Explanation: Many common verbs change spelling in the past. Buy becomes bought, teach becomes taught, and think becomes thought.
- Memory hook: Bought, brought and thought share ought.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 38 in total: 5 fill_gap, 7 multiple_choice, 14 correct_word, 12 spell.

## Rules for every item
- British English spelling. Everyday sentences of 5-12 words, plain words (A2-B1), natural, grammatical, no slang, no proper names that are hard to spell.
- Vary the topics, subjects, tenses and sentence shapes (home, school, work, travel, food, family, hobbies). Do not start many sentences the same way.
- Do not repeat or lightly reword any sentence in "Already exists" below, and do not repeat a sentence inside your own answer.
- Every item must be unambiguous: for a gap or a choice exactly ONE answer is correct. If two answers could fit the sentence, change the sentence.
- The sentence itself must test THIS rule, not another one.

## Examples (each item: {"type","text","correction","note"})
- "correct": a correct sentence that shows the rule; no "correction".
- "incorrect": a sentence with a mistake against THIS rule (a typical mistake of a learner); "correction" is the same sentence fixed, changing only what is wrong.
- "exception": only if the rule has exceptions: a correct sentence with the exception; no "correction".
- "note": 3-9 words that say why (e.g. "Accept = agree to take"); always include it.

## Exercises (each item: {"type","prompt","answer"} and "choices" for multiple_choice)
- fill_gap: a sentence with exactly one gap written as ___ ; "answer" is the one word or phrase that fills it.
- multiple_choice: a sentence with one gap ___ ; "prompt" starts with "Choose the word: "; "choices" has the right answer and 1-2 wrong options; "answer" is exactly one of the choices.
- correct_word: "prompt" is ONE misspelled or wrong word, "answer" is the correct word (no sentence).
- spell: "prompt" starts with "Spell the word: " and describes the word (its meaning, or "the past form of buy"); "answer" is the word.

Format examples of existing exercises (copy the shape, not the content):
```
{"type":"fill_gap","prompt":"She ___ me a postcard from Paris. (прислала)","answer":"sent"}
{"type":"fill_gap","prompt":"Yesterday I ___ about my old school. (думал)","answer":"thought"}
{"type":"multiple_choice","prompt":"Choose the correct past form of meet.","answer":"met","choices":["meeted","met","meat"]}
{"type":"multiple_choice","prompt":"Choose the correct past form of bring.","answer":"brought","choices":["bringed","brought","broughten"]}
{"type":"multiple_choice","prompt":"Choose the correct past form of fight.","answer":"fought","choices":["fighted","fought","faught"]}
{"type":"correct_word","prompt":"sayed","answer":"said"}
{"type":"correct_word","prompt":"maked","answer":"made"}
{"type":"correct_word","prompt":"bringed","answer":"brought"}
{"type":"spell","prompt":"Spell the word: the past form of leave.","answer":"left"}
{"type":"spell","prompt":"Spell the word: the past form of keep.","answer":"kept"}
{"type":"spell","prompt":"Spell the word: the past form of buy.","answer":"bought"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"irregular-past-common","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "irregular-past-common".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- buyed  -> bought
- She bought some bread yesterday.
- teached  -> taught
- The teacher taught us a new song.
- He told me the news yesterday.
- We found the keys under the sofa.
- She tolded me a secret.  -> She told me a secret.
- I finded my wallet.  -> I found my wallet.
- She brought a cake to the party.
- I thought about it all night.
- He caught the last train home.
- We fought hard but lost the game.
- I thinked about you yesterday.  -> I thought about you yesterday.
- She bringed her sister to the concert.  -> She brought her sister to the concert.
- The cat catched a mouse.  -> The cat caught a mouse.
- He teached English for ten years.  -> He taught English for ten years.
- They buyed a new sofa last week.  -> They bought a new sofa last week.
- I standed in the queue for an hour.  -> I stood in the queue for an hour.

Exercise prompts:
- sayed  [said]
- maked  [made]
- Spell the word: the past form of leave.  [left]
- Spell the word: the past form of keep.  [kept]
- She ___ me a postcard from Paris. (прислала)  [sent]
- Choose the correct past form of meet.  [met]
- bringed  [brought]
- catched  [caught]
- thinked  [thought]
- standed  [stood]
- Spell the word: the past form of buy.  [bought]
- Spell the word: the past form of teach.  [taught]
- Spell the word: the past form of sell.  [sold]
- Choose the correct past form of bring.  [brought]
- Choose the correct past form of fight.  [fought]
- Yesterday I ___ about my old school. (думал)  [thought]
