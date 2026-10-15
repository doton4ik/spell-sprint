# NEW, SEPARATE TASK (rules3-32.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Vowel order: i and e" (slug: vowel-order-ei-ie).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Vowel order: i and e
- Explanation: The order of i and e changes the spelling of a word. After c, most words use ei.
- Memory hook: After c, use ei: receive.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 18 "incorrect", 2 "exception".
- exercises: 48 in total: 22 multiple_choice, 26 correct_word.

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
{"type":"multiple_choice","prompt":"Choose the correct spelling: a person you like and know well.","answer":"friend","choices":["freind","friend","frend"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: to get something that is given to you.","answer":"receive","choices":["recieve","receive","reseive"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: the top surface inside a room.","answer":"ceiling","choices":["cieling","ceiling","seiling"]}
{"type":"correct_word","prompt":"wierd","answer":"weird"}
{"type":"correct_word","prompt":"neice","answer":"niece"}
{"type":"correct_word","prompt":"acheive","answer":"achieve"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"vowel-order-ei-ie","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "vowel-order-ei-ie".

## Already exists (18 examples, 11 known exercises; do not repeat)
Examples:
- recieve  -> receive
- believe
- seize
- My friend waited near the entrance.
- freind  -> friend
- She received a letter from her niece.
- The ceiling was painted white.
- We need to wiegh the bag.  -> We need to weigh the bag.
- Please keep the receipt for your new shoes.
- I believe that she will win the race.
- He ate a big piece of cake.
- Do not try to deceive your friends.
- Keep the reciept in case you need to return it.  -> Keep the receipt in case you need to return it.
- I beleive you are right.  -> I believe you are right.
- She ate a peice of pizza.  -> She ate a piece of pizza.
- The cows are in the feild.  -> The cows are in the field.
- Please do not decieve me.  -> Please do not deceive me.
- We saw the cheif of the village.  -> We saw the chief of the village.

Exercise prompts:
- wierd  [weird]
- neice  [niece]
- acheive  [achieve]
- reciept  [receipt]
- decieve  [deceive]
- breif  [brief]
- Choose the correct spelling: a person you like and know well.  [friend]
- Choose the correct spelling: to get something that is given to you.  [receive]
- Choose the correct spelling: the top surface inside a room.  [ceiling]
- Choose the correct spelling: the leader of a group or a tribe.  [chief]
- Choose the correct spelling: a part of a larger thing.  [piece]
