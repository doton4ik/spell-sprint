# NEW, SEPARATE TASK (rules3-08.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Common irregular plurals" (slug: irregular-plurals).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Common irregular plurals
- Explanation: Some plural nouns do not use -s or -es. Child becomes children, mouse becomes mice and person becomes people.
- Memory hook: Child becomes children; mouse becomes mice.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 40 in total: 8 fill_gap, 8 multiple_choice, 13 correct_word, 11 spell.

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
{"type":"fill_gap","prompt":"Look at those ___ in the field. (овцы)","answer":"sheep"}
{"type":"fill_gap","prompt":"The baby already has six ___. (зубы)","answer":"teeth"}
{"type":"fill_gap","prompt":"Many ___ visit this museum every year. (люди)","answer":"people"}
{"type":"multiple_choice","prompt":"Choose the correct plural of child.","answer":"children","choices":["childs","childen","children"]}
{"type":"multiple_choice","prompt":"Choose the correct plural of foot.","answer":"feet","choices":["foots","feet","feets"]}
{"type":"multiple_choice","prompt":"Choose the correct plural of man.","answer":"men","choices":["mans","men","mens"]}
{"type":"correct_word","prompt":"oxes","answer":"oxen"}
{"type":"correct_word","prompt":"mouses","answer":"mice"}
{"type":"correct_word","prompt":"feets","answer":"feet"}
{"type":"spell","prompt":"Spell the word: more than one man.","answer":"men"}
{"type":"spell","prompt":"Spell the word: more than one woman.","answer":"women"}
{"type":"spell","prompt":"Spell the word: more than one tooth.","answer":"teeth"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"irregular-plurals","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "irregular-plurals".

## Already exists (18 examples, 15 known exercises; do not repeat)
Examples:
- mouses  -> mice
- Two mice ran across the floor.
- childs  -> children
- The children played outside all afternoon.
- The women met at the station.
- The geese flew over the lake.
- The childs are in the garden.  -> The children are in the garden.
- Two sheeps stood by the gate.  -> Two sheep stood by the gate.
- The dentist checked the children's teeth.
- Many people were waiting outside.
- She has two sheep on her farm.
- Both of his feet were wet.
- The mans are repairing the road.  -> The men are repairing the road.
- I saw three mouses in the kitchen.  -> I saw three mice in the kitchen.
- My tooths hurt after the sweets.  -> My teeth hurt after the sweets.
- There were many womans at the meeting.  -> There were many women at the meeting.
- The childrens are asleep.  -> The children are asleep.
- Five peoples came to the lesson.  -> Five people came to the lesson.

Exercise prompts:
- oxes  [oxen]
- mouses  [mice]
- Spell the word: more than one man.  [men]
- feets  [feet]
- Choose the correct plural of child.  [children]
- Look at those ___ in the field. (овцы)  [sheep]
- tooths  [teeth]
- womans  [women]
- Spell the word: more than one woman.  [women]
- Spell the word: more than one tooth.  [teeth]
- Spell the word: more than one goose.  [geese]
- Choose the correct plural of foot.  [feet]
- Choose the correct plural of man.  [men]
- The baby already has six ___. (зубы)  [teeth]
- Many ___ visit this museum every year. (люди)  [people]
