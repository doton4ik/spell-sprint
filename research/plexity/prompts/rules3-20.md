# NEW, SEPARATE TASK (rules3-20.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Plural nouns with -es" (slug: plural-es).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Plural nouns with -es
- Explanation: Add -es to most nouns ending in s, x, z, ch or sh. Box becomes boxes.
- Memory hook: A hissing ending needs an extra e.

## What to write (exactly these numbers)
- examples: 38 in total: 16 "correct", 20 "incorrect", 2 "exception".
- exercises: 46 in total: 3 fill_gap, 12 multiple_choice, 17 correct_word, 14 spell.

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
{"type":"fill_gap","prompt":"Please wash the ___. (посуду)","answer":"dishes"}
{"type":"multiple_choice","prompt":"Choose the correct plural of match.","answer":"matches","choices":["matchs","matches","matchies"]}
{"type":"multiple_choice","prompt":"Choose the correct plural of brush.","answer":"brushes","choices":["brushs","brushes","brushies"]}
{"type":"multiple_choice","prompt":"Choose the correct plural of fox.","answer":"foxes","choices":["foxs","foxes","foxies"]}
{"type":"correct_word","prompt":"benchs","answer":"benches"}
{"type":"correct_word","prompt":"taxs","answer":"taxes"}
{"type":"correct_word","prompt":"kisss","answer":"kisses"}
{"type":"spell","prompt":"Spell the word: more than one wish.","answer":"wishes"}
{"type":"spell","prompt":"Spell the word: more than one class.","answer":"classes"}
{"type":"spell","prompt":"Spell the word: more than one dress.","answer":"dresses"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"plural-es","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "plural-es".

## Already exists (19 examples, 16 known exercises; do not repeat)
Examples:
- She wears two watches on special occasions.
- watchs  -> watches
- We packed the boxes before lunch.
- stomach → stomachs
- boxs  -> boxes
- I put two sandwiches in my bag.
- The churches in the town are old.
- She sliced two peachs.  -> She sliced two peaches.
- The bosss met yesterday.  -> The bosses met yesterday.
- Put the glasses on the top shelf.
- The foxes hid in the bushes.
- Two buses were late this morning.
- The painters bought new brushes.
- I bought two dresss for the party.  -> I bought two dresses for the party.
- Many businesss close in winter.  -> Many businesses close in winter.
- She cleaned her glasss with a cloth.  -> She cleaned her glasses with a cloth.
- I need three brushs for painting.  -> I need three brushes for painting.
- The foxs live in the forest.  -> The foxes live in the forest.
- We eat our lunchs outside in summer.  -> We eat our lunches outside in summer.

Exercise prompts:
- benchs  [benches]
- taxs  [taxes]
- Spell the word: more than one wish.  [wishes]
- Spell the word: more than one class.  [classes]
- Please wash the ___. (посуду)  [dishes]
- Choose the correct plural of match.  [matches]
- kisss  [kisses]
- addresss  [addresses]
- bushs  [bushes]
- scratchs  [scratches]
- Spell the word: more than one dress.  [dresses]
- Spell the word: more than one lunch.  [lunches]
- Spell the word: more than one business.  [businesses]
- Choose the correct plural of brush.  [brushes]
- Choose the correct plural of fox.  [foxes]
- Choose the correct plural of glass.  [glasses]
