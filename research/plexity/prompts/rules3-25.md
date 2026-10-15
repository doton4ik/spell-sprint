# NEW, SEPARATE TASK (rules3-25.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Quiet or quite" (slug: quiet-vs-quite).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Quiet or quite
- Explanation: Quiet means making little noise. Quite means fairly or rather.
- Memory hook: Quiet sounds soft; quite means fairly.
- Confusable words: quiet, quite.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 48 in total: 27 fill_gap, 21 multiple_choice.

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
{"type":"fill_gap","prompt":"The village is very ___ at night.","answer":"quiet"}
{"type":"fill_gap","prompt":"I was ___ tired after the trip.","answer":"quite"}
{"type":"fill_gap","prompt":"It is ___ cold outside.","answer":"quite"}
{"type":"multiple_choice","prompt":"Choose the word: Keep ___, the neighbours are sleeping.","answer":"quiet","choices":["quiet","quite"]}
{"type":"multiple_choice","prompt":"Choose the word: That is ___ a good idea.","answer":"quite","choices":["quiet","quite"]}
{"type":"multiple_choice","prompt":"Choose the word: We need a ___ place to study.","answer":"quiet","choices":["quiet","quite"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"quiet-vs-quite","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "quiet-vs-quite".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- The film was quiet interesting.  -> The film was quite interesting.
- The room was quite after lunch.  -> The room was quiet after lunch.
- The book was quite interesting.
- The library is quiet in the morning.
- The baby is quiet now.
- It was quite a long journey.
- Please be quite in the library.  -> Please be quiet in the library.
- The exam was quiet easy.  -> The exam was quite easy.
- Please speak in a quiet voice.
- The soup is quite hot, so be careful.
- It was a quiet evening at home.
- She plays the piano quite well.
- The street is quite at night.  -> The street is quiet at night.
- He is quiet good at chess.  -> He is quite good at chess.
- Can you be quite while I work?  -> Can you be quiet while I work?
- The movie was quiet long.  -> The movie was quite long.
- She gave a quite answer and left.  -> She gave a quiet answer and left.
- I felt quiet sure about my choice.  -> I felt quite sure about my choice.

Exercise prompts:
- The village is very ___ at night.  [quiet]
- I was ___ tired after the trip.  [quite]
- Choose the word: Keep ___, the neighbours are sleeping.  [quiet]
- Choose the word: That is ___ a good idea.  [quite]
- It is ___ cold outside.  [quite]
- He is a ___ boy who reads a lot.  [quiet]
- The children were ___ during the film.  [quiet]
- My bag is ___ heavy today.  [quite]
- Choose the word: We need a ___ place to study.  [quiet]
- Choose the word: The test was ___ difficult.  [quite]
- He spoke in a ___ voice, so I could hardly hear him.  [quiet]
- It is ___ late, so let's go home.  [quite]
- Choose the word: The baby finally went ___.  [quiet]
- Choose the word: I am ___ sure that I locked the door.  [quite]
- The lake was calm and ___ in the early morning.  [quiet]
- Choose the word: Nobody was talking and the room was ___.  [quiet]
