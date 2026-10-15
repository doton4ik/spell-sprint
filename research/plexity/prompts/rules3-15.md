# NEW, SEPARATE TASK (rules3-15.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Its vs it's" (slug: its-vs-its-contraction).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Its vs it's
- Explanation: Its (no apostrophe) shows that something belongs to it. It's is short for it is or it has.
- Memory hook: If you can say "it is", use it's.
- Confusable words: its, it's.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 48 in total: 26 fill_gap, 22 multiple_choice.

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
{"type":"fill_gap","prompt":"The old bridge lost ___ charm.","answer":"its"}
{"type":"fill_gap","prompt":"The company is proud of ___ new office.","answer":"its"}
{"type":"fill_gap","prompt":"___ a beautiful day, so let's go outside.","answer":"It's"}
{"type":"multiple_choice","prompt":"Choose the correct word: The dog wagged ___ tail.","answer":"its","choices":["its","it's"]}
{"type":"multiple_choice","prompt":"Choose the correct word: I think ___ going to rain.","answer":"it's","choices":["its","it's"]}
{"type":"multiple_choice","prompt":"Choose the correct word: The city is famous for ___ old bridges.","answer":"its","choices":["its","it's"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"its-vs-its-contraction","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "its-vs-its-contraction".

## Already exists (18 examples, 11 known exercises; do not repeat)
Examples:
- The company changed it's name.  -> The company changed its name.
- It's a large warehouse.
- The dog ate it's food.  -> The dog ate its food.
- Its a sunny day.  -> It's a sunny day.
- The bird opened its wings because it's ready to fly.
- The company announced its new plan.
- It's a pleasure to meet you.
- The team lost it's last game.  -> The team lost its last game.
- The cat licked its paw and fell asleep.
- It's raining, so take an umbrella.
- The house lost its roof in the storm.
- I think it's time to go home.
- The baby lost it's toy under the bed.  -> The baby lost its toy under the bed.
- Its been a long day for everyone.  -> It's been a long day for everyone.
- I like the film, but it's ending was sad.  -> I like the film, but its ending was sad.
- Its too late to call him now.  -> It's too late to call him now.
- The tree lost all it's leaves in autumn.  -> The tree lost all its leaves in autumn.
- Its important to drink enough water.  -> It's important to drink enough water.

Exercise prompts:
- The old bridge lost ___ charm.  [its]
- The company is proud of ___ new office.  [its]
- ___ a beautiful day, so let's go outside.  [It's]
- Choose the correct word: The dog wagged ___ tail.  [its]
- Choose the correct word: I think ___ going to rain.  [it's]
- The bird built ___ nest in the old tree.  [its]
- I cannot find my phone, and ___ almost time to leave.  [it's]
- Choose the correct word: The city is famous for ___ old bridges.  [its]
- Choose the correct word: ___ been a great week for our team.  [It's]
- The museum closes ___ doors at five o'clock.  [its]
- Choose the correct word: Look at the sky, ___ getting dark!  [it's]
