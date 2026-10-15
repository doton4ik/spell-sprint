# NEW, SEPARATE TASK (rules3-17.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Lose vs loose" (slug: lose-vs-loose).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Lose vs loose
- Explanation: Lose is a verb meaning to not have something anymore. Loose is an adjective meaning not tight.
- Memory hook: One O in lose, like losing one letter.
- Confusable words: lose, loose.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 50 in total: 32 fill_gap, 18 multiple_choice.

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
{"type":"fill_gap","prompt":"Keep your ticket safe and do not ___ it.","answer":"lose"}
{"type":"fill_gap","prompt":"My tooth is ___, and it might fall out soon.","answer":"loose"}
{"type":"fill_gap","prompt":"I always ___ my keys when I am in a hurry.","answer":"lose"}
{"type":"multiple_choice","prompt":"Choose the word: These trousers are too ___ around the waist.","answer":"loose","choices":["lose","loose"]}
{"type":"multiple_choice","prompt":"Choose the word: We will ___ the game if we do not defend.","answer":"lose","choices":["lose","loose"]}
{"type":"multiple_choice","prompt":"Choose the word: The bolt came ___ and fell on the floor.","answer":"loose","choices":["lose","loose"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"lose-vs-loose","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "lose-vs-loose".

## Already exists (18 examples, 11 known exercises; do not repeat)
Examples:
- I don't want to loose my keys.  -> I don't want to lose my keys.
- These jeans are too loose.
- The lid was loose, so I nearly lost it.
- The rope is lose.  -> The rope is loose.
- Do not loose the ticket.  -> Do not lose the ticket.
- Do not lose your passport at the airport.
- The knot is loose; tie it again.
- These shoes feel lose.  -> These shoes feel loose.
- I always lose my umbrella on rainy days.
- The screw is loose, so the shelf shakes.
- Do not lose hope, because things will get better.
- She wore a loose shirt in the hot weather.
- I hope we do not loose the match tomorrow.  -> I hope we do not lose the match tomorrow.
- My tooth is lose, and it hurts.  -> My tooth is loose, and it hurts.
- Did you loose your phone again?  -> Did you lose your phone again?
- The dog got lose from its lead.  -> The dog got loose from its lead.
- Be careful or you will loose your balance.  -> Be careful or you will lose your balance.
- He wore a lose coat over his sweater.  -> He wore a loose coat over his sweater.

Exercise prompts:
- Keep your ticket safe and do not ___ it.  [lose]
- My tooth is ___, and it might fall out soon.  [loose]
- I always ___ my keys when I am in a hurry.  [lose]
- Choose the word: These trousers are too ___ around the waist.  [loose]
- Choose the word: We will ___ the game if we do not defend.  [lose]
- The dog broke free and ran ___ in the park.  [loose]
- Do not ___ this paper, because it is your only copy.  [lose]
- Choose the word: The bolt came ___ and fell on the floor.  [loose]
- Choose the word: I do not want to ___ my place in the queue.  [lose]
- A ___ cable can cause problems with the sound.  [loose]
- If you ___ your passport abroad, tell the police at once.  [lose]
