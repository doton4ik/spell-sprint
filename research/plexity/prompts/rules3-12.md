# NEW, SEPARATE TASK (rules3-12.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Dropping the silent e" (slug: drop-silent-e).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Dropping the silent e
- Explanation: When a verb ends in a silent e, you usually drop the e before adding -ing or -ed. For example, make becomes making.
- Memory hook: The silent e steps aside to let -ing and -ed in.

## What to write (exactly these numbers)
- examples: 36 in total: 14 "correct", 20 "incorrect", 2 "exception".
- exercises: 42 in total: 4 fill_gap, 8 multiple_choice, 17 correct_word, 13 spell.

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
{"type":"fill_gap","prompt":"The sun was ___ above the hills. (shine)","answer":"shining"}
{"type":"multiple_choice","prompt":"Choose the correct -ing form of have.","answer":"having","choices":["haveing","having","haveng"]}
{"type":"multiple_choice","prompt":"Choose the correct -ing form of see.","answer":"seeing","choices":["seing","seeing","seeeing"]}
{"type":"correct_word","prompt":"closeing","answer":"closing"}
{"type":"correct_word","prompt":"hateing","answer":"hating"}
{"type":"correct_word","prompt":"likeed","answer":"liked"}
{"type":"spell","prompt":"Spell the word: the -ing form of write.","answer":"writing"}
{"type":"spell","prompt":"Spell the word: the -ed form of love.","answer":"loved"}
{"type":"spell","prompt":"Spell the word: the -ing form of leave.","answer":"leaving"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"drop-silent-e","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "drop-silent-e".

## Already exists (18 examples, 10 known exercises; do not repeat)
Examples:
- agreeing
- He danced all night at the party.
- She is writing a long letter to her cousin.
- hopeed  -> hoped
- makeing  -> making
- hopeing  -> hoping
- She smiled while moving the chairs.
- moveing  -> moving
- She is baking a chocolate cake.
- We decided to leave early.
- The baby was smiling at me.
- They were using my laptop.
- She is takeing a photo.  -> She is taking a photo.
- He liveed there for years.  -> He lived there for years.
- I am writeing an email.  -> I am writing an email.
- They were chaseing the dog.  -> They were chasing the dog.
- She arriveed at the station late.  -> She arrived at the station late.
- He is comeing home tomorrow.  -> He is coming home tomorrow.

Exercise prompts:
- closeing  [closing]
- hateing  [hating]
- likeed  [liked]
- rideing  [riding]
- Spell the word: the -ing form of write.  [writing]
- Spell the word: the -ed form of love.  [loved]
- Spell the word: the -ing form of leave.  [leaving]
- Choose the correct -ing form of have.  [having]
- Choose the correct -ing form of see.  [seeing]
- The sun was ___ above the hills. (shine)  [shining]
