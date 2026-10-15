# NEW, SEPARATE TASK (rules3-30.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "There vs their vs they're" (slug: there-vs-their).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: There vs their vs they're
- Explanation: There points to a place or starts a sentence (there is). Their shows that something belongs to them. They're is short for they are.
- Memory hook: Their has "heir" in it: it belongs to someone.
- Confusable words: there, their, they're.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 48 in total: 26 fill_gap, 22 multiple_choice.

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

Format examples of existing exercises (copy the shape, not the content):
```
{"type":"fill_gap","prompt":"Do you know where ___ house is?","answer":"their"}
{"type":"fill_gap","prompt":"The neighbours painted ___ fence green.","answer":"their"}
{"type":"fill_gap","prompt":"I left my bag over ___ on the chair.","answer":"there"}
{"type":"multiple_choice","prompt":"Choose the word: ___ are four apples in the bowl.","answer":"There","choices":["There","Their","They're"]}
{"type":"multiple_choice","prompt":"Choose the word: ___ late, so we should start without them.","answer":"They're","choices":["There","Their","They're"]}
{"type":"multiple_choice","prompt":"Choose the word: The players are proud of ___ team.","answer":"their","choices":["there","their","they're"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"there-vs-their","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "there-vs-their".

## Already exists (18 examples, 11 known exercises; do not repeat)
Examples:
- Their is a meeting at noon.  -> There is a meeting at noon.
- Their truck arrived late.
- They left their coats there by the door.
- The coats are over their.  -> The coats are over there.
- There house is small.  -> Their house is small.
- There are three chairs in the room.
- They said they're ready to start.
- Their going to be late.  -> They're going to be late.
- The children are in the garden with their dog.
- Look at the shelf over there.
- They're planning a trip to Spain this summer.
- There is a problem with the printer.
- The students forgot there books at home.  -> The students forgot their books at home.
- Their is no milk in the fridge.  -> There is no milk in the fridge.
- I think they're car is outside.  -> I think their car is outside.
- Put the boxes over their, please.  -> Put the boxes over there, please.
- There coming to dinner tonight.  -> They're coming to dinner tonight.
- Many people lost they're jobs last year.  -> Many people lost their jobs last year.

Exercise prompts:
- Do you know where ___ house is?  [their]
- The neighbours painted ___ fence green.  [their]
- I left my bag over ___ on the chair.  [there]
- Choose the word: ___ are four apples in the bowl.  [There]
- Choose the word: ___ late, so we should start without them.  [They're]
- My parents sold ___ house last spring.  [their]
- Is ___ a post office near here?  [there]
- Choose the word: The players are proud of ___ team.  [their]
- Choose the word: I know they are tired, but ___ still working.  [they're]
- We went to Italy and stayed ___ for two weeks.  [there]
- Choose the word: Can you see ___ car? It is the blue one.  [their]
