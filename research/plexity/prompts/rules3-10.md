# NEW, SEPARATE TASK (rules3-10.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Double consonants" (slug: double-consonants).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Double consonants
- Explanation: Some common words need doubled letters. Learn the whole visual pattern instead of relying only on sound.
- Memory hook: Tomorrow has a double r; useful has one l.

## What to write (exactly these numbers)
- examples: 32 in total: 14 "correct", 18 "incorrect".
- exercises: 48 in total: 5 fill_gap, 14 multiple_choice, 29 correct_word.

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

Format examples of existing exercises (copy the shape, not the content):
```
{"type":"fill_gap","prompt":"Please write your home ___ below. (адрес)","answer":"address"}
{"type":"multiple_choice","prompt":"Choose the correct spelling of the word that means a chance.","answer":"opportunity","choices":["oportunity","opportunity","opportunnity"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: It is ___ to wear a helmet.","answer":"necessary","choices":["necessary","neccessary","necesary"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling of the adverb that means sometimes.","answer":"occasionally","choices":["ocasionally","occasionally","occassionally"]}
{"type":"correct_word","prompt":"acommodation","answer":"accommodation"}
{"type":"correct_word","prompt":"aparent","answer":"apparent"}
{"type":"correct_word","prompt":"begining","answer":"beginning"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"double-consonants","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "double-consonants".

## Already exists (16 examples, 10 known exercises; do not repeat)
Examples:
- tomorow  -> tomorrow
- beginning
- recommended
- Write your address clearly on the form.
- adress  -> address
- succes  -> success
- It is necessary to book a table early.
- I felt embarrassed when I forgot his name.
- The committee made its decision on Friday.
- We stayed in cheap accommodation near the station.
- She was embarassed by the question.  -> She was embarrassed by the question.
- It is neccessary to bring your passport.  -> It is necessary to bring your passport.
- I see her ocasionally at the gym.  -> I see her occasionally at the gym.
- He disapeared after the show.  -> He disappeared after the show.
- It is a great oportunity for us.  -> It is a great opportunity for us.
- The comittee meets every month.  -> The committee meets every month.

Exercise prompts:
- acommodation  [accommodation]
- aparent  [apparent]
- begining  [beginning]
- ocurred  [occurred]
- dissapear  [disappear]
- embarasing  [embarrassing]
- Choose the correct spelling of the word that means a chance.  [opportunity]
- Choose the correct spelling: It is ___ to wear a helmet.  [necessary]
- Choose the correct spelling of the adverb that means sometimes.  [occasionally]
- Please write your home ___ below. (адрес)  [address]
