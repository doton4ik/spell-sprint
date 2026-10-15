# NEW, SEPARATE TASK (rules3-42.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Routine places and transport: go to school, by bus" (slug: no-article-routine-places).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Routine places and transport: go to school, by bus
- Explanation: Some places and times are used for their normal purpose and take no article: go to school (as a pupil), go to work, be at home, go to bed, at night, by bus, by train. If you mean the building or one particular thing, use the: I am going to the school to speak to the teacher.
- Memory hook: Normal use: no article. A particular building: the.

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
{"type":"multiple_choice","prompt":"My son is a pupil. He goes to ___ school every morning.","answer":"no article","choices":["a","an","the","no article"]}
{"type":"multiple_choice","prompt":"I go to ___ work at eight.","answer":"no article","choices":["a","an","the","no article"]}
{"type":"multiple_choice","prompt":"She stays in ___ bed when she is ill.","answer":"no article","choices":["a","an","the","no article"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"no-article-routine-places","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "no-article-routine-places".

## Already exists (9 examples, 14 known exercises; do not repeat)
Examples:
- My son goes to school every morning.
- We travelled to Rome by train.
- I am going to the school to speak to his teacher.
- I go to the work at eight.  -> I go to work at eight.
- She stays in the bed when she is ill.  -> She stays in bed when she is ill.
- I listen to the radio. We watched TV.
- He goes to bed at ten.
- He went to the school to talk to his son's teacher.
- We went home by the bus.  -> We went home by bus.

Exercise prompts:
- My son is a pupil. He goes to ___ school every morning.  [no article]
- I go to ___ work at eight.  [no article]
- She stays in ___ bed when she is ill.  [no article]
- We travelled to Rome by ___ train.  [no article]
- I am visiting his teacher. I am going to ___ school to speak to her.  [the]
- He is at ___ home now.  [no article]
- I always listen to ___ radio in the car.  [the]
- We watched ___ TV all evening.  [no article]
- It is very cold at ___ night here.  [no article]
- He is going to ___ bed early tonight.  [no article]
- My father is at ___ work now.  [no article]
- She came to ___ hospital to see her sick friend.  [the]
- What time do you finish ___ school?  [no article]
- We usually travel by ___ plane.  [no article]
