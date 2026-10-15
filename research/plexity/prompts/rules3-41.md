# NEW, SEPARATE TASK (rules3-41.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "The with rivers, seas, mountain ranges and plural countries" (slug: the-geography).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: The with rivers, seas, mountain ranges and plural countries
- Explanation: Use the with oceans, seas, rivers and mountain ranges (the Atlantic, the Thames, the Alps), with plural names (the Netherlands, the United States) and with countries that have words like Kingdom, Republic or States in the name. Most single countries, cities, lakes and single mountains take no article: Japan, Lake Geneva, Mount Everest.
- Memory hook: Water and groups take the. Single places walk alone.

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
{"type":"multiple_choice","prompt":"We crossed ___ Atlantic Ocean by ship.","answer":"the","choices":["a","an","the","no article"]}
{"type":"multiple_choice","prompt":"She lives in ___ United States.","answer":"the","choices":["a","an","the","no article"]}
{"type":"multiple_choice","prompt":"He climbed ___ Mount Everest.","answer":"no article","choices":["a","an","the","no article"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"the-geography","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "the-geography".

## Already exists (9 examples, 14 known exercises; do not repeat)
Examples:
- We crossed the Atlantic Ocean by ship.
- The Alps are popular for skiing.
- She lives in the United States.
- I want to visit the Japan.  -> I want to visit Japan.
- He climbed the Mount Everest.  -> He climbed Mount Everest.
- Lake Geneva
- The Danube flows through several countries.
- She has never visited Spain.
- We flew to the Italy.  -> We flew to Italy.

Exercise prompts:
- We crossed ___ Atlantic Ocean by ship.  [the]
- She lives in ___ United States.  [the]
- He climbed ___ Mount Everest.  [no article]
- ___ Alps are popular for skiing.  [the]
- We flew over ___ Pacific.  [the]
- They visited ___ Netherlands last year.  [the]
- ___ Lake Geneva is very deep.  [no article]
- The longest river in Europe is ___ Volga.  [the]
- I want to visit ___ Japan.  [no article]
- He lives in ___ United Kingdom.  [the]
- My cousin lives in ___ Philippines.  [the]
- We swam in ___ Red Sea.  [the]
- She wants to climb ___ Mount Fuji.  [no article]
- They visited ___ Czech Republic.  [the]
