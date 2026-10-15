# NEW, SEPARATE TASK (rules3-18.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Nouns ending in -ance or -ence" (slug: ance-vs-ence).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Nouns ending in -ance or -ence
- Explanation: Some nouns end in -ance, like appearance. Others end in -ence, like difference and independence.
- Memory hook: Appearance takes ance; difference takes ence.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 46 in total: 3 fill_gap, 12 multiple_choice, 19 correct_word, 12 spell.

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
{"type":"fill_gap","prompt":"Her ___ at the meeting surprised us. (присутствие)","answer":"presence"}
{"type":"multiple_choice","prompt":"Choose the correct spelling: keeping a machine in good condition.","answer":"maintenance","choices":["maintainance","maintenance","maintenence"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: the place where a person lives (formal).","answer":"residence","choices":["residance","residence","residense"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: money paid so that a company protects you from loss.","answer":"insurance","choices":["insurence","insurance","insurense"]}
{"type":"correct_word","prompt":"existance","answer":"existence"}
{"type":"correct_word","prompt":"resistence","answer":"resistance"}
{"type":"correct_word","prompt":"importence","answer":"importance"}
{"type":"spell","prompt":"Spell the word: the people who watch a show in a theatre (one word, -ence).","answer":"audience"}
{"type":"spell","prompt":"Spell the word: proof that something is true.","answer":"evidence"}
{"type":"spell","prompt":"Spell the word: being away from school or work (-ence).","answer":"absence"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"ance-vs-ence","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "ance-vs-ence".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- Their independence matters to them.
- Her appearance changed over the years.
- appearence  -> appearance
- independance  -> independence
- The doctor gave us clear guidance.
- There was no violence at the match.
- It made a big differance.  -> It made a big difference.
- He showed great intellegence.  -> He showed great intelligence.
- Regular attendance is important for this course.
- She has a lot of confidence on stage.
- We sat in silence for a minute.
- The distance between the two towns is short.
- The insurence covers all the repairs.  -> The insurance covers all the repairs.
- Patiance is very useful for teachers.  -> Patience is very useful for teachers.
- The conferance starts at ten o'clock.  -> The conference starts at ten o'clock.
- Thank you for your assistence with the bags.  -> Thank you for your assistance with the bags.
- He has a lot of experiance with children.  -> He has a lot of experience with children.
- Her absance was noticed by everyone.  -> Her absence was noticed by everyone.

Exercise prompts:
- existance  [existence]
- resistence  [resistance]
- Spell the word: the people who watch a show in a theatre (one word, -ence).  [audience]
- Spell the word: proof that something is true.  [evidence]
- Her ___ at the meeting surprised us. (присутствие)  [presence]
- Choose the correct spelling: keeping a machine in good condition.  [maintenance]
- importence  [importance]
- performence  [performance]
- silance  [silence]
- confidance  [confidence]
- sentance  [sentence]
- Spell the word: being away from school or work (-ence).  [absence]
- Spell the word: a door or gate where you go into a building (-ance).  [entrance]
- Choose the correct spelling: the place where a person lives (formal).  [residence]
- Choose the correct spelling: money paid so that a company protects you from loss.  [insurance]
- Choose the correct spelling: the amount of space between two places.  [distance]
