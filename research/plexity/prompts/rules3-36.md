# NEW, SEPARATE TASK (rules3-36.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "A or an: the sound decides" (slug: a-or-an).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: A or an: the sound decides
- Explanation: Use a before a consonant SOUND and an before a vowel SOUND. Listen to the first sound of the next word, not its first letter: an hour (the h is silent), a university (it starts with the sound "yoo").
- Memory hook: Say the next word aloud. Does it start with a vowel sound? Then an.

## What to write (exactly these numbers)
- examples: 18 in total: 10 "correct", 6 "incorrect", 2 "exception".
- exercises: 28 in total: 28 multiple_choice.

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
- multiple_choice: a sentence with one gap ___ ; "prompt" starts with "Choose the word: "; "choices" has the right answer and 1-2 wrong options; "answer" is exactly one of the choices.

Format examples of existing exercises (copy the shape, not the content):
```
{"type":"multiple_choice","prompt":"She studies at ___ university in London.","answer":"a","choices":["a","an"]}
{"type":"multiple_choice","prompt":"We waited for ___ hour.","answer":"an","choices":["a","an"]}
{"type":"multiple_choice","prompt":"He is ___ honest man.","answer":"an","choices":["a","an"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"a-or-an","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "a-or-an".

## Already exists (9 examples, 14 known exercises; do not repeat)
Examples:
- an hour
- a university
- an MBA
- She is a honest person.  -> She is an honest person.
- It was an European tradition.  -> It was a European tradition.
- a one-way ticket
- He gave me an honest answer.
- She owns a unique painting.
- He is an university student.  -> He is a university student.

Exercise prompts:
- She studies at ___ university in London.  [a]
- We waited for ___ hour.  [an]
- He is ___ honest man.  [an]
- She wants to visit ___ European country.  [a]
- I need ___ umbrella, it is raining.  [an]
- He has ___ one-year contract.  [a]
- She has ___ MBA from a good school.  [an]
- This is ___ useful tool.  [a]
- Can I have ___ egg, please?  [an]
- That was ___ unusual question.  [an]
- My sister is ___ engineer.  [an]
- I saw ___ one-eyed cat in the garden.  [a]
- He is ___ honourable man.  [an]
- She wants ___ useful gift.  [a]
