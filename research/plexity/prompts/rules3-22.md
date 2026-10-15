# NEW, SEPARATE TASK (rules3-22.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Plural: y becomes ies" (slug: plural-y-to-ies).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Plural: y becomes ies
- Explanation: When a noun ends in a consonant plus y, change y to i and add es to form the plural.
- Memory hook: Company to companies; one lonely y turns into two i's.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 42 in total: 19 multiple_choice, 15 correct_word, 8 spell.

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
- correct_word: "prompt" is ONE misspelled or wrong word, "answer" is the correct word (no sentence).
- spell: "prompt" starts with "Spell the word: " and describes the word (its meaning, or "the past form of buy"); "answer" is the word.

Format examples of existing exercises (copy the shape, not the content):
```
{"type":"multiple_choice","prompt":"Choose the plural of hobby.","answer":"hobbies","choices":["hobbys","hobbies","hobbyes"]}
{"type":"multiple_choice","prompt":"Choose the plural of day.","answer":"days","choices":["daies","days","dayes"]}
{"type":"multiple_choice","prompt":"Choose the plural of key.","answer":"keys","choices":["keies","keys","keyes"]}
{"type":"correct_word","prompt":"countrys","answer":"countries"}
{"type":"correct_word","prompt":"storys","answer":"stories"}
{"type":"correct_word","prompt":"ladys","answer":"ladies"}
{"type":"spell","prompt":"Spell the word: more than one party.","answer":"parties"}
{"type":"spell","prompt":"Spell the word: more than one city.","answer":"cities"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"plural-y-to-ies","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "plural-y-to-ies".

## Already exists (18 examples, 11 known exercises; do not repeat)
Examples:
- companys  -> companies
- delivery -> deliveries
- dairys  -> dairies
- The berries were fresh and sweet.
- cherrys  -> cherries
- The libraries open at nine.
- The bakeries sell fresh bread.
- The factorys closed early.  -> The factories closed early.
- The babies slept quietly in the next room.
- Many families live in this building.
- He wrote three stories about his journey.
- There were many parties last summer.
- Both ladys left early.  -> Both ladies left early.
- My two babys are asleep.  -> My two babies are asleep.
- Which countrys have you visited?  -> Which countries have you visited?
- There are many storys in this book.  -> There are many stories in this book.
- Their familys came to the party.  -> Their families came to the party.
- The partyes were very noisy.  -> The parties were very noisy.

Exercise prompts:
- Choose the plural of hobby.  [hobbies]
- countrys  [countries]
- storys  [stories]
- ladys  [ladies]
- familys  [families]
- Spell the word: more than one party.  [parties]
- Spell the word: more than one city.  [cities]
- Choose the plural of day.  [days]
- Choose the plural of key.  [keys]
- Choose the plural of monkey.  [monkeys]
- Choose the plural of boy.  [boys]
