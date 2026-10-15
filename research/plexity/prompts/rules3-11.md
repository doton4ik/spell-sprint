# NEW, SEPARATE TASK (rules3-11.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Doubling before -ing and -ed" (slug: double-before-ing-ed).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Doubling before -ing and -ed
- Explanation: Short verbs that end in one vowel and one consonant often double the final consonant before -ing or -ed, as in plan becoming planning.
- Memory hook: One vowel, one consonant, double before you go on.

## What to write (exactly these numbers)
- examples: 36 in total: 14 "correct", 20 "incorrect", 2 "exception".
- exercises: 44 in total: 4 fill_gap, 9 multiple_choice, 18 correct_word, 13 spell.

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
{"type":"fill_gap","prompt":"The dog was ___ its tail happily. (wag)","answer":"wagging"}
{"type":"multiple_choice","prompt":"Choose the correct -ing form of visit.","answer":"visiting","choices":["visitting","visiting","visitng"]}
{"type":"multiple_choice","prompt":"Choose the correct -ing form of play.","answer":"playing","choices":["plaiing","playing","plapping"]}
{"type":"correct_word","prompt":"beged","answer":"begged"}
{"type":"correct_word","prompt":"shoping","answer":"shopping"}
{"type":"correct_word","prompt":"cuting","answer":"cutting"}
{"type":"spell","prompt":"Spell the word: the -ing form of put.","answer":"putting"}
{"type":"spell","prompt":"Spell the word: the -ed form of stop.","answer":"stopped"}
{"type":"spell","prompt":"Spell the word: the -ing form of swim.","answer":"swimming"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"double-before-ing-ed","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "double-before-ing-ed".

## Already exists (18 examples, 10 known exercises; do not repeat)
Examples:
- fixing
- She dropped her phone on the floor.
- They are shopping for groceries this afternoon.
- stoped  -> stopped
- planing  -> planning
- They were running through the park together.
- sliped  -> slipped
- runing  -> running
- She is swimming in the sea.
- We were chatting for hours.
- The bus stopped at the corner.
- He is getting tired of waiting.
- They were geting ready to leave.  -> They were getting ready to leave.
- He is siting on the floor.  -> He is sitting on the floor.
- She was swiming in the lake.  -> She was swimming in the lake.
- The boy was hiting the ball.  -> The boy was hitting the ball.
- The thief was grabing her bag.  -> The thief was grabbing her bag.
- We were chating online all night.  -> We were chatting online all night.

Exercise prompts:
- beged  [begged]
- shoping  [shopping]
- cuting  [cutting]
- joged  [jogged]
- Spell the word: the -ing form of put.  [putting]
- Spell the word: the -ed form of stop.  [stopped]
- Spell the word: the -ing form of swim.  [swimming]
- Choose the correct -ing form of visit.  [visiting]
- Choose the correct -ing form of play.  [playing]
- The dog was ___ its tail happily. (wag)  [wagging]
