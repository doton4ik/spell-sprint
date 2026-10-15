# NEW, SEPARATE TASK (rules3-24.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Principal or principle" (slug: principal-vs-principle).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Principal or principle
- Explanation: Principal means main or a head teacher. Principle is a basic belief or rule.
- Memory hook: Principal is main; principle is a rule.
- Confusable words: principal, principle.

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
{"type":"fill_gap","prompt":"The ___ cause of the delay was snow.","answer":"principal"}
{"type":"fill_gap","prompt":"She refuses to lie as a matter of ___.","answer":"principle"}
{"type":"fill_gap","prompt":"Our ___ aim is to help beginners.","answer":"principal"}
{"type":"multiple_choice","prompt":"Choose the word: The ___ of the college gave a speech.","answer":"principal","choices":["principal","principle"]}
{"type":"multiple_choice","prompt":"Choose the word: Honesty is a basic ___.","answer":"principle","choices":["principal","principle"]}
{"type":"multiple_choice","prompt":"Choose the word: The ___ entrance is on the left.","answer":"principal","choices":["principal","principle"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"principal-vs-principle","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "principal-vs-principle".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- The principal reason was the price.
- Honesty is an important principal.  -> Honesty is an important principle.
- The principle reason was cost.  -> The principal reason was cost.
- Fairness is an important principle.
- The principal thanked the students.
- It is against my principles to cheat.
- The principle of the school is kind.  -> The principal of the school is kind.
- He lives by strong principals.  -> He lives by strong principles.
- The school principal welcomed the new students.
- Her principal job is to train the staff.
- He never breaks his principles.
- It is a basic principle of physics.
- Our principle goal is to save money.  -> Our principal goal is to save money.
- The principal of equality is important.  -> The principle of equality is important.
- She is the principle of a large school.  -> She is the principal of a large school.
- He is a man of high principals.  -> He is a man of high principles.
- Rain is the principle reason we stayed home.  -> Rain is the principal reason we stayed home.
- I never lie, on principal.  -> I never lie, on principle.

Exercise prompts:
- The ___ cause of the delay was snow.  [principal]
- She refuses to lie as a matter of ___.  [principle]
- Choose the word: The ___ of the college gave a speech.  [principal]
- Choose the word: Honesty is a basic ___.  [principle]
- Our ___ aim is to help beginners.  [principal]
- It is the same ___ in every science.  [principle]
- The school ___ phoned my parents yesterday.  [principal]
- It is a matter of ___ for me.  [principle]
- Choose the word: The ___ entrance is on the left.  [principal]
- Choose the word: Equality is a basic ___ of our club.  [principle]
- The ___ ingredient of bread is flour.  [principal]
- In ___, I agree with your idea.  [principle]
- Choose the word: Fairness is a basic ___ of the game.  [principle]
- Choose the word: She wants to be a school ___ one day.  [principal]
- Money is the ___ problem for many families.  [principal]
- Do you understand the ___ behind this machine?  [principle]
