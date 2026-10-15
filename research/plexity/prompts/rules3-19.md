# NEW, SEPARATE TASK (rules3-19.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Nouns ending in -tion or -sion" (slug: tion-vs-sion).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Nouns ending in -tion or -sion
- Explanation: Some nouns end in -tion, like information. Others end in -sion, like decision and discussion. Learn the ending with each word.
- Memory hook: Information takes tion; decision takes sion.

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
{"type":"fill_gap","prompt":"Please answer the last ___. (вопрос)","answer":"question"}
{"type":"multiple_choice","prompt":"Choose the correct spelling: entering a country by force.","answer":"invasion","choices":["invation","invasion","invacion"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: the ability to see; also a clear idea of the future.","answer":"vision","choices":["vition","vision","vizion"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: a party for a birthday or a special event.","answer":"celebration","choices":["celebrasion","celebration","celebracion"]}
{"type":"correct_word","prompt":"revition","answer":"revision"}
{"type":"correct_word","prompt":"condision","answer":"condition"}
{"type":"correct_word","prompt":"nasion","answer":"nation"}
{"type":"spell","prompt":"Spell the word: the place where a train stops for passengers (one word, -tion).","answer":"station"}
{"type":"spell","prompt":"Spell the word: the answer to a problem.","answer":"solution"}
{"type":"spell","prompt":"Spell the word: when two vehicles hit each other (-sion).","answer":"collision"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"tion-vs-sion","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "tion-vs-sion".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- We had a discussion after the film.
- decition  -> decision
- informasion  -> information
- The information was easy to find.
- The instructions were clear.
- We watched a television show.
- They gave us permition.  -> They gave us permission.
- The explanasion was short.  -> The explanation was short.
- The population of our town is growing fast.
- We came to the conclusion that the plan was good.
- Please pay attention to the teacher.
- The new version of the app is faster.
- I want to pay more attension to details.  -> I want to pay more attention to details.
- We came to the conclution very quickly.  -> We came to the conclusion very quickly.
- The new vertion is ready for everyone.  -> The new version is ready for everyone.
- He has a big collecsion of old coins.  -> He has a big collection of old coins.
- Her expretion showed surprise.  -> Her expression showed surprise.
- The educasion system is changing.  -> The education system is changing.

Exercise prompts:
- revition  [revision]
- condision  [condition]
- Spell the word: the place where a train stops for passengers (one word, -tion).  [station]
- Spell the word: the answer to a problem.  [solution]
- Please answer the last ___. (вопрос)  [question]
- Choose the correct spelling: entering a country by force.  [invasion]
- nasion  [nation]
- extention  [extension]
- confution  [confusion]
- acsion  [action]
- direcsion  [direction]
- Spell the word: when two vehicles hit each other (-sion).  [collision]
- Spell the word: the process of teaching and learning in schools (-tion).  [education]
- Choose the correct spelling: the ability to see; also a clear idea of the future.  [vision]
- Choose the correct spelling: a party for a birthday or a special event.  [celebration]
- Choose the correct spelling: the opinion you form about a person when you first meet.  [impression]
