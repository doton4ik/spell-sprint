# NEW, SEPARATE TASK (rules3-26.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Silent letters" (slug: silent-letters).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Silent letters
- Explanation: Some English words contain letters that are written but not pronounced. Learning these silent letters helps you spell tricky words correctly.
- Memory hook: The k in knife is silent, just like the w in write.

## What to write (exactly these numbers)
- examples: 32 in total: 14 "correct", 18 "incorrect".
- exercises: 42 in total: 8 multiple_choice, 34 correct_word.

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

Format examples of existing exercises (copy the shape, not the content):
```
{"type":"multiple_choice","prompt":"Choose the correct spelling of the day between Tuesday and Thursday.","answer":"Wednesday","choices":["Wensday","Wednesday","Wedensday"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling of the place where you keep plates.","answer":"cupboard","choices":["cupbord","cupboard","cubboard"]}
{"type":"correct_word","prompt":"rong","answer":"wrong"}
{"type":"correct_word","prompt":"sord","answer":"sword"}
{"type":"correct_word","prompt":"colum","answer":"column"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"silent-letters","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "silent-letters".

## Already exists (16 examples, 10 known exercises; do not repeat)
Examples:
- She decided to write a letter to her friend.
- The chef used a sharp knife to cut the bread.
- rite  -> write
- nife  -> knife
- lam  -> lamb
- The lamb slept beside the old fence.
- I always listen to music on the bus.
- She wrote her answer on the board.
- They live on a small island near the coast.
- We climb the hill every Sunday morning.
- Let's lisen to the radio.  -> Let's listen to the radio.
- They live on a small iland.  -> They live on a small island.
- She hurt her rist playing tennis.  -> She hurt her wrist playing tennis.
- I have no dout about his plan.  -> I have no doubt about his plan.
- She shares her nowledge of music with us.  -> She shares her knowledge of music with us.
- Mum bought a gitar for my birthday.  -> Mum bought a guitar for my birthday.

Exercise prompts:
- rong  [wrong]
- sord  [sword]
- colum  [column]
- onest  [honest]
- casle  [castle]
- thum  [thumb]
- gost  [ghost]
- autum  [autumn]
- Choose the correct spelling of the day between Tuesday and Thursday.  [Wednesday]
- Choose the correct spelling of the place where you keep plates.  [cupboard]
