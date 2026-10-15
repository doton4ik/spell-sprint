# NEW, SEPARATE TASK (rules3-21.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Plural nouns with -ves" (slug: plural-f-to-ves).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Plural nouns with -ves
- Explanation: Some nouns ending in f or fe change that ending to -ves in the plural. Knife becomes knives.
- Memory hook: A knife loses fe and gains ves.

## What to write (exactly these numbers)
- examples: 38 in total: 16 "correct", 20 "incorrect", 2 "exception".
- exercises: 42 in total: 5 fill_gap, 11 multiple_choice, 15 correct_word, 11 spell.

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
{"type":"fill_gap","prompt":"Cut the sandwich into two ___. (половинки)","answer":"halves"}
{"type":"fill_gap","prompt":"The new safety rules saved many ___ last year. (жизни)","answer":"lives"}
{"type":"multiple_choice","prompt":"Choose the correct plural of life.","answer":"lives","choices":["lifes","lives","livs"]}
{"type":"multiple_choice","prompt":"Choose the correct plural of leaf.","answer":"leaves","choices":["leafs","leaves","leavs"]}
{"type":"multiple_choice","prompt":"Choose the correct word: Please help ___ to some tea, everyone.","answer":"yourselves","choices":["yourself","yourselfs","yourselves"]}
{"type":"correct_word","prompt":"calfs","answer":"calves"}
{"type":"correct_word","prompt":"thiefs","answer":"thieves"}
{"type":"correct_word","prompt":"shelfs","answer":"shelves"}
{"type":"spell","prompt":"Spell the word: more than one knife.","answer":"knives"}
{"type":"spell","prompt":"Spell the word: more than one elf.","answer":"elves"}
{"type":"spell","prompt":"Spell the word: more than one loaf.","answer":"loaves"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"plural-f-to-ves","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "plural-f-to-ves".

## Already exists (19 examples, 16 known exercises; do not repeat)
Examples:
- wifes  -> wives
- roof → roofs; chef → chefs
- The knives are in the kitchen drawer.
- knifes  -> knives
- Several leaves fell from the tree.
- The two wives were sisters.
- The scarves hung by the door.
- The shelfs are full of books.  -> The shelves are full of books.
- Three wolfs crossed the road.  -> Three wolves crossed the road.
- She cut the apple into two halves.
- The baker made six loaves of bread.
- People say that cats have nine lives.
- The thieves ran away before the police came.
- He bought three loafs of bread.  -> He bought three loaves of bread.
- Cut the cake into two halfs.  -> Cut the cake into two halves.
- Doctors save many lifes every day.  -> Doctors save many lives every day.
- Please help yourselfs to some food.  -> Please help yourselves to some food.
- The two thiefs were caught later.  -> The two thieves were caught later.
- Both calfs were born in spring.  -> Both calves were born in spring.

Exercise prompts:
- calfs  [calves]
- thiefs  [thieves]
- Spell the word: more than one knife.  [knives]
- Spell the word: more than one elf.  [elves]
- Choose the correct plural of life.  [lives]
- Choose the correct plural of leaf.  [leaves]
- shelfs  [shelves]
- wolfs  [wolves]
- selfs  [selves]
- halfs  [halves]
- Spell the word: more than one loaf.  [loaves]
- Spell the word: more than one wife.  [wives]
- Choose the correct word: Please help ___ to some tea, everyone.  [yourselves]
- Choose the correct plural of thief.  [thieves]
- Cut the sandwich into two ___. (половинки)  [halves]
- The new safety rules saved many ___ last year. (жизни)  [lives]
