# NEW, SEPARATE TASK (rules3-23.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Practice or practise" (slug: practice-vs-practise).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Practice or practise
- Explanation: In British English, practice is a noun. Practise is a verb.
- Memory hook: Practise with s is something you do.
- Confusable words: practice, practise.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 48 in total: 30 fill_gap, 18 multiple_choice.

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
{"type":"fill_gap","prompt":"The football ___ starts at five.","answer":"practice"}
{"type":"fill_gap","prompt":"I ___ my English with a friend.","answer":"practise"}
{"type":"fill_gap","prompt":"After hours of ___, she played perfectly.","answer":"practice"}
{"type":"multiple_choice","prompt":"Choose the word: It takes a lot of ___ to write well.","answer":"practice","choices":["practice","practise"]}
{"type":"multiple_choice","prompt":"Choose the word: Please ___ the new words daily.","answer":"practise","choices":["practice","practise"]}
{"type":"multiple_choice","prompt":"Choose the word: It takes years of ___ to speak well.","answer":"practice","choices":["practice","practise"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"practice-vs-practise","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "practice-vs-practise".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- I want to practice speaking.  -> I want to practise speaking.
- I practise speaking English each morning.
- Daily practise is useful.  -> Daily practice is useful.
- Regular practice improves spelling.
- Practice makes perfect.
- We practise the dialogue together.
- She needs more practise.  -> She needs more practice.
- They practice the song before class.  -> They practise the song before class.
- The team has football practice every Friday.
- You should practise the words every day.
- She needs a lot of practice before the exam.
- I practise the guitar after school.
- I need to practice more before the test.  -> I need to practise more before the test.
- Daily practise helps you learn faster.  -> Daily practice helps you learn faster.
- He will practice his speech tonight.  -> He will practise his speech tonight.
- The band has a practise on Monday.  -> The band has a practice on Monday.
- We practice English with a teacher.  -> We practise English with a teacher.
- After much practise, she won the race.  -> After much practice, she won the race.

Exercise prompts:
- The football ___ starts at five.  [practice]
- I ___ my English with a friend.  [practise]
- Choose the word: It takes a lot of ___ to write well.  [practice]
- Choose the word: Please ___ the new words daily.  [practise]
- After hours of ___, she played perfectly.  [practice]
- We ___ spelling on the bus.  [practise]
- The choir has ___ every Tuesday evening.  [practice]
- You must ___ the piano every day.  [practise]
- Choose the word: It takes years of ___ to speak well.  [practice]
- Choose the word: Please ___ the dialogue with your partner.  [practise]
- The doctor's ___ is near the station.  [practice]
- She wants to ___ her English in London.  [practise]
- Choose the word: We need more ___ before the match.  [practice]
- Choose the word: He likes to ___ his speech in the mirror.  [practise]
- Good ___ makes you faster at typing.  [practice]
- I ___ my spelling with this app.  [practise]
