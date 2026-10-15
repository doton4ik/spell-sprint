# NEW, SEPARATE TASK (rules3-06.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Affect vs effect" (slug: affect-vs-effect).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Affect vs effect
- Explanation: Affect is usually a verb meaning to influence something. Effect is usually a noun meaning the result.
- Memory hook: Affect = Action, Effect = End result.
- Confusable words: affect, effect.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 50 in total: 25 fill_gap, 25 multiple_choice.

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
{"type":"fill_gap","prompt":"Too much sugar can ___ your teeth.","answer":"affect"}
{"type":"fill_gap","prompt":"The side ___ of the pill is sleepiness.","answer":"effect"}
{"type":"fill_gap","prompt":"Pollution can ___ the health of children.","answer":"affect"}
{"type":"multiple_choice","prompt":"Choose the word: Cold weather can ___ your mood.","answer":"affect","choices":["affect","effect"]}
{"type":"multiple_choice","prompt":"Choose the word: The teacher's praise had a great ___.","answer":"effect","choices":["affect","effect"]}
{"type":"multiple_choice","prompt":"Choose the word: Does coffee ___ you at night?","answer":"affect","choices":["affect","effect"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"affect-vs-effect","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "affect-vs-effect".

## Already exists (18 examples, 12 known exercises; do not repeat)
Examples:
- The delay will effect the delivery.  -> The delay will affect the delivery.
- The delay had a big effect.
- The new rule had an affect.  -> The new rule had an effect.
- Noise can effect sleep.  -> Noise can affect sleep.
- The cold may affect how quickly the medicine takes effect.
- Heat can affect the colour of the paint.
- The new law took effect in May.
- Her kind words had a good affect on me.  -> Her kind words had a good effect on me.
- Lack of sleep affects my memory.
- The medicine had no effect on her cough.
- Rain will affect the football match tomorrow.
- The film had a strong effect on the audience.
- Bad weather can effect the flight times.  -> Bad weather can affect the flight times.
- Stress has a bad affect on health.  -> Stress has a bad effect on health.
- The price rise did not effect sales.  -> The price rise did not affect sales.
- What is the affect of coffee on sleep?  -> What is the effect of coffee on sleep?
- How will the new rule effect us?  -> How will the new rule affect us?
- The side affects of the pill are mild.  -> The side effects of the pill are mild.

Exercise prompts:
- Too much sugar can ___ your teeth.  [affect]
- The side ___ of the pill is sleepiness.  [effect]
- Pollution can ___ the health of children.  [affect]
- The new tax will have a big ___ on prices.  [effect]
- How did the news ___ you?  [affect]
- The ___ of the storm lasted for days.  [effect]
- Choose the word: Cold weather can ___ your mood.  [affect]
- Choose the word: The teacher's praise had a great ___.  [effect]
- Choose the word: Does coffee ___ you at night?  [affect]
- Choose the word: There was no visible ___ after the treatment.  [effect]
- Choose the word: Late trains ___ thousands of workers.  [affect]
- Choose the word: The special ___ in the film were amazing.  [effects]
