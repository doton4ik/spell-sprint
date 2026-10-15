# NEW, SEPARATE TASK (rules3-28.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "The suffix -ful has one L" (slug: suffix-ful).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: The suffix -ful has one L
- Explanation: The suffix -ful always has a single l, as in useful and careful, even though the word full has two.
- Memory hook: Ful is never full of extra Ls.

## What to write (exactly these numbers)
- examples: 36 in total: 14 "correct", 20 "incorrect", 2 "exception".
- exercises: 44 in total: 9 multiple_choice, 26 correct_word, 9 spell.

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
{"type":"multiple_choice","prompt":"Choose the correct spelling of the adjective meaning 'full of pain'.","answer":"painful","choices":["painful","painfull","paineful"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling of the adjective meaning 'full of play'.","answer":"playful","choices":["playfull","playful"]}
{"type":"correct_word","prompt":"beautifull","answer":"beautiful"}
{"type":"correct_word","prompt":"gratefull","answer":"grateful"}
{"type":"correct_word","prompt":"peacefull","answer":"peaceful"}
{"type":"spell","prompt":"Spell the word: add -ful to the noun 'joy'.","answer":"joyful"}
{"type":"spell","prompt":"Spell the word: add -ful to the noun 'delight'.","answer":"delightful"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"suffix-ful","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "suffix-ful".

## Already exists (18 examples, 10 known exercises; do not repeat)
Examples:
- carefully
- He gave a truthful answer to the question.
- It was a helpful suggestion from my colleague.
- carefull  -> careful
- usefull  -> useful
- Her cheerful voice made everyone smile.
- hopefull  -> hopeful
- cheerfull  -> cheerful
- The garden is beautiful in spring.
- She was grateful for your help.
- It was a peaceful walk by the river.
- He is a very successful doctor.
- The view was wonderfull.  -> The view was wonderful.
- That medicine can be harmfull.  -> That medicine can be harmful.
- She felt thankfull for the gift.  -> She felt thankful for the gift.
- He had a painfull knee.  -> He had a painful knee.
- Be respectfull to your teachers.  -> Be respectful to your teachers.
- The new engine is very powerfull.  -> The new engine is very powerful.

Exercise prompts:
- beautifull  [beautiful]
- gratefull  [grateful]
- peacefull  [peaceful]
- successfull  [successful]
- forgetfull  [forgetful]
- gracefull  [graceful]
- Spell the word: add -ful to the noun 'joy'.  [joyful]
- Spell the word: add -ful to the noun 'delight'.  [delightful]
- Choose the correct spelling of the adjective meaning 'full of pain'.  [painful]
- Choose the correct spelling of the adjective meaning 'full of play'.  [playful]
