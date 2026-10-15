# NEW, SEPARATE TASK (rules3-09.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Comparatives with -er and -est" (slug: comparatives-er-est).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Comparatives with -er and -est
- Explanation: Short adjectives often add -er or -est. Double a final consonant after a short vowel, change final y to i, or drop a final e.
- Memory hook: Big doubles; happy changes y; nice drops e.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 18 "incorrect", 2 "exception".
- exercises: 44 in total: 6 fill_gap, 9 multiple_choice, 17 correct_word, 12 spell.

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
- correct_word: "prompt" is ONE misspelled or wrong word, "answer" is the correct word (no sentence).
- spell: "prompt" starts with "Spell the word: " and describes the word (its meaning, or "the past form of buy"); "answer" is the word.

Format examples of existing exercises (copy the shape, not the content):
```
{"type":"fill_gap","prompt":"The ___ day of summer is in June. (самый длинный)","answer":"longest"}
{"type":"fill_gap","prompt":"My bag is ___ than yours. (тяжелее)","answer":"heavier"}
{"type":"multiple_choice","prompt":"Choose the superlative of busy.","answer":"busiest","choices":["busyest","busiest","busiiest"]}
{"type":"multiple_choice","prompt":"Choose the comparative of thin.","answer":"thinner","choices":["thiner","thinner","thinnner"]}
{"type":"multiple_choice","prompt":"Choose the superlative of late.","answer":"latest","choices":["lattest","latest","latetest"]}
{"type":"correct_word","prompt":"sunnyer","answer":"sunnier"}
{"type":"correct_word","prompt":"fatest","answer":"fattest"}
{"type":"correct_word","prompt":"easyer","answer":"easier"}
{"type":"spell","prompt":"Spell the word: the comparative form of wide.","answer":"wider"}
{"type":"spell","prompt":"Spell the word: the superlative form of big.","answer":"biggest"}
{"type":"spell","prompt":"Spell the word: the comparative form of fat.","answer":"fatter"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"comparatives-er-est","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "comparatives-er-est".

## Already exists (18 examples, 15 known exercises; do not repeat)
Examples:
- This room is bigger than ours.
- biger  -> bigger
- She chose the nicest cake.
- good → better → best
- happyer  -> happier
- My bag is lighter than yours.
- This is the happiest day of my life.
- She is the tinyest girl in class.  -> She is the tiniest girl in class.
- It got much bigger and hoter.  -> It got much bigger and hotter.
- This is the coldest winter I remember.
- Her handwriting is neater than mine.
- He is the fastest runner in the school.
- A mouse is smaller than a cat.
- This road is wideer than the old one.  -> This road is wider than the old one.
- She is the prettyest girl in the class.  -> She is the prettiest girl in the class.
- The new phone is thiner than the old one.  -> The new phone is thinner than the old one.
- This soup is the tastyest in town.  -> This soup is the tastiest in town.
- My bag is heavyer than yours.  -> My bag is heavier than yours.

Exercise prompts:
- sunnyer  [sunnier]
- fatest  [fattest]
- Spell the word: the comparative form of wide.  [wider]
- Spell the word: the superlative form of big.  [biggest]
- Choose the superlative of busy.  [busiest]
- The ___ day of summer is in June. (самый длинный)  [longest]
- easyer  [easier]
- wetest  [wettest]
- crazyest  [craziest]
- sadest  [saddest]
- Spell the word: the comparative form of fat.  [fatter]
- Spell the word: the superlative form of nice.  [nicest]
- Choose the comparative of thin.  [thinner]
- Choose the superlative of late.  [latest]
- My bag is ___ than yours. (тяжелее)  [heavier]
