# NEW, SEPARATE TASK (rules3-34.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Were, where or wear" (slug: were-where-wear).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Were, where or wear
- Explanation: Were is a past form of be. Where asks about a place; wear means to have clothes on.
- Memory hook: Where is a place; wear is clothes.
- Confusable words: were, where, wear.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 48 in total: 24 fill_gap, 24 multiple_choice.

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

Format examples of existing exercises (copy the shape, not the content):
```
{"type":"fill_gap","prompt":"___ is the post office?","answer":"where"}
{"type":"fill_gap","prompt":"What do you ___ to school?","answer":"wear"}
{"type":"fill_gap","prompt":"The shops ___ closed on Sunday.","answer":"were"}
{"type":"multiple_choice","prompt":"Choose the word: Do you know ___ the exit is?","answer":"where","choices":["were","where","wear"]}
{"type":"multiple_choice","prompt":"Choose the word: You ___ right about the date.","answer":"were","choices":["were","where","wear"]}
{"type":"multiple_choice","prompt":"Choose the word: I need to ___ a helmet.","answer":"wear","choices":["were","where","wear"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"were-where-wear","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "were-where-wear".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- We were tired after the walk.
- Where do you wear that jacket?
- I will where a coat.  -> I will wear a coat.
- Where you at home yesterday?  -> Were you at home yesterday?
- Where did you put my keys?
- They were happy to see us.
- I forgot were I parked.  -> I forgot where I parked.
- We always where warm clothes here.  -> We always wear warm clothes here.
- Where are my keys?
- They were at school all day.
- I wear glasses to read.
- We were not sure where to go.
- Were is the nearest bank?  -> Where is the nearest bank?
- They where late for the meeting.  -> They were late for the meeting.
- I always were a hat in summer.  -> I always wear a hat in summer.
- Do you know were he lives?  -> Do you know where he lives?
- She will where her new dress tonight.  -> She will wear her new dress tonight.
- We wear very happy yesterday.  -> We were very happy yesterday.

Exercise prompts:
- ___ is the post office?  [where]
- What do you ___ to school?  [wear]
- The shops ___ closed on Sunday.  [were]
- Choose the word: Do you know ___ the exit is?  [where]
- Choose the word: You ___ right about the date.  [were]
- Choose the word: I need to ___ a helmet.  [wear]
- ___ did you buy that bag?  [Where]
- My shoes ___ wet after the rain.  [were]
- Choose the word: I never ___ a tie at work.  [wear]
- Choose the word: Nobody knows ___ he went.  [where]
- You should ___ a coat today; it is cold.  [wear]
- The children ___ very quiet in the library.  [were]
- Choose the word: ___ is the station?  [Where]
- Choose the word: They ___ here an hour ago.  [were]
- What will you ___ to the party?  [wear]
- Choose the word: This is the town ___ I was born.  [where]
