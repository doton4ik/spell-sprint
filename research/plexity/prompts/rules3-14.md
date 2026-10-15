# NEW, SEPARATE TASK (rules3-14.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Irregular past: go / went" (slug: irregular-past-go).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Irregular past: go / went
- Explanation: Go does not take -ed in the past tense. Its past form is the irregular word went.
- Memory hook: Go, went, gone — learn the whole set together.

## What to write (exactly these numbers)
- examples: 32 in total: 14 "correct", 18 "incorrect".
- exercises: 44 in total: 5 fill_gap, 14 multiple_choice, 15 correct_word, 10 spell.

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
{"type":"fill_gap","prompt":"Tom is not here. He has ___ to the shop.","answer":"gone"}
{"type":"multiple_choice","prompt":"Choose the correct form: Yesterday we ___ to the museum.","answer":"went","choices":["goed","went","gone"]}
{"type":"multiple_choice","prompt":"Choose the correct form: She has ___ to the airport.","answer":"gone","choices":["went","gone","goed"]}
{"type":"multiple_choice","prompt":"Choose the correct form: Last week they ___ to a concert.","answer":"went","choices":["gone","went","goed"]}
{"type":"correct_word","prompt":"goed","answer":"went"}
{"type":"correct_word","prompt":"goned","answer":"gone"}
{"type":"correct_word","prompt":"wented","answer":"went"}
{"type":"spell","prompt":"Spell the word: the past form of go.","answer":"went"}
{"type":"spell","prompt":"Spell the word: the past participle of go (I have ...).","answer":"gone"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"irregular-past-go","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "irregular-past-go".

## Already exists (16 examples, 9 known exercises; do not repeat)
Examples:
- We goed to the warehouse.  -> We went to the warehouse.
- She went to the meeting.
- She goed home.  -> She went home.
- After lunch, they went to the park.
- He has went home.  -> He has gone home.
- We went swimming yesterday.
- She has gone to the shop.
- They have went to bed.  -> They have gone to bed.
- Last summer we went to Italy.
- He has gone to work already.
- They went home after the film.
- Yesterday I goed to the dentist.  -> Yesterday I went to the dentist.
- My parents have went on holiday.  -> My parents have gone on holiday.
- We goed shopping on Saturday.  -> We went shopping on Saturday.
- Tom has not went to school today.  -> Tom has not gone to school today.
- They go to the beach last Sunday.  -> They went to the beach last Sunday.

Exercise prompts:
- Tom is not here. He has ___ to the shop.  [gone]
- goed  [went]
- goned  [gone]
- wented  [went]
- Spell the word: the past form of go.  [went]
- Spell the word: the past participle of go (I have ...).  [gone]
- Choose the correct form: Yesterday we ___ to the museum.  [went]
- Choose the correct form: She has ___ to the airport.  [gone]
- Choose the correct form: Last week they ___ to a concert.  [went]
