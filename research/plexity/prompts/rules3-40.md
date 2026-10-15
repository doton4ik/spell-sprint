# NEW, SEPARATE TASK (rules3-40.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "No article: names, meals, languages, sports" (slug: no-article-names-meals-languages).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: No article: names, meals, languages, sports
- Explanation: Use no article with names of people, most cities and countries, languages, sports and the meals: Paris, Canada, French, football, breakfast. If you add an adjective to a meal, you need a: We had a wonderful lunch.
- Memory hook: Names, languages, games and meals walk alone.

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
{"type":"multiple_choice","prompt":"I usually have ___ breakfast at seven.","answer":"no article","choices":["a","an","the","no article"]}
{"type":"multiple_choice","prompt":"She speaks ___ French and Spanish.","answer":"no article","choices":["a","an","the","no article"]}
{"type":"multiple_choice","prompt":"We play ___ football on Sundays.","answer":"no article","choices":["a","an","the","no article"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"no-article-names-meals-languages","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "no-article-names-meals-languages".

## Already exists (9 examples, 14 known exercises; do not repeat)
Examples:
- I usually have breakfast at seven.
- She speaks French and Spanish.
- We had a wonderful lunch at the beach.
- I live in the Paris.  -> I live in Paris.
- He plays the chess very well.  -> He plays chess very well.
- the Browns
- We play tennis every Saturday.
- Dinner is at eight.
- The Maria is my sister.  -> Maria is my sister.

Exercise prompts:
- I usually have ___ breakfast at seven.  [no article]
- She speaks ___ French and Spanish.  [no article]
- We play ___ football on Sundays.  [no article]
- I live in ___ Paris.  [no article]
- We had ___ wonderful lunch at the beach.  [a]
- He plays ___ chess very well.  [no article]
- My friend works in ___ Canada.  [no article]
- ___ Spanish is easy for her.  [no article]
- We had ___ lunch at noon.  [no article]
- ___ Mr Brown is my English teacher.  [no article]
- She is learning ___ German.  [no article]
- We had ___ breakfast in bed.  [no article]
- He plays ___ basketball after school.  [no article]
- They invited us to ___ lovely dinner.  [a]
