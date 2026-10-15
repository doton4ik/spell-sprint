# NEW, SEPARATE TASK (rules3-29.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Then or than" (slug: then-vs-than).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Then or than
- Explanation: Then refers to time or the next step. Than is used when comparing things.
- Memory hook: Then is time; than compares.
- Confusable words: then, than.

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
{"type":"fill_gap","prompt":"My brother is older ___ me.","answer":"than"}
{"type":"fill_gap","prompt":"Finish your homework, ___ you can play.","answer":"then"}
{"type":"fill_gap","prompt":"It was better ___ nothing.","answer":"than"}
{"type":"multiple_choice","prompt":"Choose the word: She runs faster ___ I do.","answer":"than","choices":["then","than"]}
{"type":"multiple_choice","prompt":"Choose the word: Turn left, ___ go straight.","answer":"then","choices":["then","than"]}
{"type":"multiple_choice","prompt":"Choose the word: I would rather stay home ___ go out in the rain.","answer":"than","choices":["then","than"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"then-vs-than","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "then-vs-than".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- This coat is warmer than mine.
- We ate and than left.  -> We ate and then left.
- We finished dinner, then went home.
- She is taller then me.  -> She is taller than me.
- Add the flour, then mix well.
- Tea is cheaper than coffee here.
- I would rather read then watch TV.  -> I would rather read than watch TV.
- First we eat, than we go out.  -> First we eat, then we go out.
- He is more careful than his brother.
- We waited for an hour, and then the bus came.
- I would rather walk than take a taxi.
- Wash your hands, then dry them well.
- This test was harder then the last one.  -> This test was harder than the last one.
- Eat your lunch, than we will go out.  -> Eat your lunch, then we will go out.
- I got home and than had a shower.  -> I got home and then had a shower.
- She speaks English better then I do.  -> She speaks English better than I do.
- He earns more then his sister.  -> He earns more than his sister.
- Think first, than answer the question.  -> Think first, then answer the question.

Exercise prompts:
- My brother is older ___ me.  [than]
- Finish your homework, ___ you can play.  [then]
- Choose the word: She runs faster ___ I do.  [than]
- Choose the word: Turn left, ___ go straight.  [then]
- It was better ___ nothing.  [than]
- If you are tired, ___ rest.  [then]
- She is much happier ___ she was last year.  [than]
- Wash the apples first, and ___ cut them.  [then]
- Choose the word: I would rather stay home ___ go out in the rain.  [than]
- Choose the word: Open the file, ___ click Save.  [then]
- Our new flat is bigger ___ the old one.  [than]
- I thought about it for a minute, and ___ I said yes.  [then]
- Choose the word: There were more people ___ we expected.  [than]
- Choose the word: First we had dinner, ___ we watched a film.  [then]
- It takes longer by bus ___ by train.  [than]
- We had no mobile phones back ___.  [then]
