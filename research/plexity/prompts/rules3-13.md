# NEW, SEPARATE TASK (rules3-13.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Forming adverbs with -ly" (slug: adverbs-ly).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Forming adverbs with -ly
- Explanation: Most adverbs are formed by adding -ly to an adjective, but adjectives ending in y usually change to i before -ly, as in happy becoming happily.
- Memory hook: Happy waves goodbye to y and says hi to ily.

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
{"type":"fill_gap","prompt":"She walked ___ so she would not wake the baby. (quiet)","answer":"quietly"}
{"type":"multiple_choice","prompt":"Choose the correct adverb from gentle.","answer":"gently","choices":["gentlely","gently","gentily"]}
{"type":"multiple_choice","prompt":"Choose the correct adverb from busy.","answer":"busily","choices":["busyly","busily","busly"]}
{"type":"correct_word","prompt":"angryly","answer":"angrily"}
{"type":"correct_word","prompt":"noisyly","answer":"noisily"}
{"type":"correct_word","prompt":"politly","answer":"politely"}
{"type":"spell","prompt":"Spell the word: the adverb from easy.","answer":"easily"}
{"type":"spell","prompt":"Spell the word: the adverb from true.","answer":"truly"}
{"type":"spell","prompt":"Spell the word: the adverb from careful.","answer":"carefully"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"adverbs-ly","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "adverbs-ly".

## Already exists (18 examples, 10 known exercises; do not repeat)
Examples:
- simply
- He easily finished the puzzle in ten minutes.
- She spoke quietly during the meeting.
- finaly  -> finally
- happyly  -> happily
- slowley  -> slowly
- quickley  -> quickly
- She answered the question quickly and clearly.
- The children waited patiently outside.
- He carefully opened the box.
- She spoke angrily to the driver.
- It rained heavily all night.
- She sang beautifuly at the concert.  -> She sang beautifully at the concert.
- She ate her lunch hungryly.  -> She ate her lunch hungrily.
- The baby slept peacefuly.  -> The baby slept peacefully.
- He lazyly opened his eyes.  -> He lazily opened his eyes.
- He completly forgot the date.  -> He completely forgot the date.
- He is truely sorry.  -> He is truly sorry.

Exercise prompts:
- angryly  [angrily]
- noisyly  [noisily]
- politly  [politely]
- dayly  [daily]
- Spell the word: the adverb from easy.  [easily]
- Spell the word: the adverb from true.  [truly]
- Spell the word: the adverb from careful.  [carefully]
- Choose the correct adverb from gentle.  [gently]
- Choose the correct adverb from busy.  [busily]
- She walked ___ so she would not wake the baby. (quiet)  [quietly]
