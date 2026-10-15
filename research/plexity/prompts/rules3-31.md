# NEW, SEPARATE TASK (rules3-31.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "To, too or two" (slug: to-too-two).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: To, too or two
- Explanation: To shows direction or comes before a verb. Too means also or excessively; two means the number 2.
- Memory hook: Two is a number; too is extra.
- Confusable words: to, too, two.

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
{"type":"fill_gap","prompt":"It is ___ late to call him.","answer":"too"}
{"type":"fill_gap","prompt":"We bought ___ tickets for the show.","answer":"two"}
{"type":"fill_gap","prompt":"He wants ___ study medicine.","answer":"to"}
{"type":"multiple_choice","prompt":"Choose the word: I am going ___ the market.","answer":"to","choices":["to","too","two"]}
{"type":"multiple_choice","prompt":"Choose the word: This coat is ___ big for me.","answer":"too","choices":["to","too","two"]}
{"type":"multiple_choice","prompt":"Choose the word: We are driving ___ the coast tomorrow.","answer":"to","choices":["to","too","two"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"to-too-two","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "to-too-two".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- This bag is two heavy.  -> This bag is too heavy.
- I have to sisters.  -> I have two sisters.
- The two boys wanted to come too.
- We walked to the park after lunch.
- I want to learn two new words.
- The soup is too salty.
- She has to cats.  -> She has two cats.
- I am to tired to walk.  -> I am too tired to walk.
- I would like to drink some water.
- My brother is coming too.
- It is two o'clock, and the shop is closed.
- He went to the shop to buy bread.
- I have too brothers and a sister.  -> I have two brothers and a sister.
- The coffee is to hot to drink.  -> The coffee is too hot to drink.
- We are going too the cinema tonight.  -> We are going to the cinema tonight.
- Can I come to?  -> Can I come too?
- She waited for to hours.  -> She waited for two hours.
- It is two late to change the plan.  -> It is too late to change the plan.

Exercise prompts:
- It is ___ late to call him.  [too]
- We bought ___ tickets for the show.  [two]
- Choose the word: I am going ___ the market.  [to]
- Choose the word: This coat is ___ big for me.  [too]
- He wants ___ study medicine.  [to]
- The ___ sisters live in Rome.  [two]
- The bag is ___ heavy for a child.  [too]
- I have ___ younger sisters.  [two]
- Choose the word: We are driving ___ the coast tomorrow.  [to]
- Choose the word: Can I have some cake, ___?  [too]
- She decided ___ call her friend.  [to]
- Give me ___ minutes, please.  [two]
- Choose the word: It is ___ noisy to study here.  [too]
- Choose the word: He is learning ___ drive.  [to]
- My sister likes pizza, and I do ___.  [too]
- Choose the word: A bicycle has ___ wheels.  [two]
