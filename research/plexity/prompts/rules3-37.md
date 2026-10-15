# NEW, SEPARATE TASK (rules3-37.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "A or the: new or already known?" (slug: a-or-the).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: A or the: new or already known?
- Explanation: Use a / an when you mention something for the first time or mean any one of its kind. Use the when the listener already knows which one: it was mentioned before, it is clear from the situation, or there is only one.
- Memory hook: A: any one, new. The: that one, we both know it.

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
{"type":"multiple_choice","prompt":"I bought a dress and a bag. ___ dress was expensive.","answer":"the","choices":["a","an","the"]}
{"type":"multiple_choice","prompt":"Look! There is ___ cat in the garden.","answer":"a","choices":["a","an","the"]}
{"type":"multiple_choice","prompt":"Can you close ___ window, please? It is cold in here.","answer":"the","choices":["a","an","the"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"a-or-the","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "a-or-the".

## Already exists (9 examples, 14 known exercises; do not repeat)
Examples:
- I bought a dress and a bag. The dress was expensive.
- Can you close the window? It is cold.
- We need a new teacher.
- I have a car. A car is old but reliable.  -> I have a car. The car is old but reliable.
- Pass me a salt, please.  -> Pass me the salt, please.
- She wore the same dress.
- There is a book on the table. The book is mine.
- I bought a cake. The cake was delicious.
- I need the pen. Can you lend me one?  -> I need a pen. Can you lend me one?

Exercise prompts:
- I bought a dress and a bag. ___ dress was expensive.  [the]
- Look! There is ___ cat in the garden.  [a]
- Can you close ___ window, please? It is cold in here.  [the]
- She has ___ brother and two sisters.  [a]
- I have a car. ___ car is old but reliable.  [the]
- Pass me ___ salt, please. It is next to you.  [the]
- We need ___ new teacher for the course.  [a]
- I saw ___ accident on my way here.  [an]
- I saw an accident on my way here. ___ driver was not hurt.  [the]
- Is there ___ bank near here?  [a]
- Close ___ door, please. It is windy.  [the]
- She got ___ job in a bank.  [a]
- I am looking for ___ cheap hotel near the station.  [a]
- Where is ___ remote control? I cannot find it.  [the]
