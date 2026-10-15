# NEW, SEPARATE TASK (rules3-16.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Keep e after soft c and g" (slug: soft-c-and-g).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Keep e after soft c and g
- Explanation: Keep e after soft c or g before a suffix beginning with a or o. Notice becomes noticeable, and courage becomes courageous.
- Memory hook: Keep e so c and g stay soft.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 44 in total: 14 multiple_choice, 16 correct_word, 14 spell.

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
{"type":"multiple_choice","prompt":"Choose the correct spelling: able to be pronounced.","answer":"pronounceable","choices":["pronouncable","pronounceable","pronounciable"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: very beautiful.","answer":"gorgeous","choices":["gorgous","gorgeous","gorgius"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: able to be exchanged.","answer":"exchangeable","choices":["exchangable","exchangeable","exchangeible"]}
{"type":"correct_word","prompt":"outragous","answer":"outrageous"}
{"type":"correct_word","prompt":"peacable","answer":"peaceable"}
{"type":"correct_word","prompt":"knowledgable","answer":"knowledgeable"}
{"type":"spell","prompt":"Spell the word: giving you an advantage.","answer":"advantageous"}
{"type":"spell","prompt":"Spell the word: able to be charged to an account.","answer":"chargeable"}
{"type":"spell","prompt":"Spell the word: able to be managed.","answer":"manageable"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"soft-c-and-g","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "soft-c-and-g".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- The change was noticeable after a week.
- noticable  -> noticeable
- It was courageous of her to speak up.
- couragous  -> courageous
- The price was outrageous.
- The stain is hardly noticeable.
- It was an advantagous deal.  -> It was an advantageous deal.
- The rule is not enforcable.  -> The rule is not enforceable.
- The schedule is manageable if we work together.
- She is very knowledgeable about birds.
- The weather here is changeable in spring.
- Every parcel is traceable online.
- The task was not managable for one person.  -> The task was not manageable for one person.
- He is very knowledgable about history.  -> He is very knowledgeable about history.
- The old phone is not replacable.  -> The old phone is not replaceable.
- The weather is changable in April.  -> The weather is changeable in April.
- She wore a gorgous dress to the party.  -> She wore a gorgeous dress to the party.
- Every parcel is tracable online.  -> Every parcel is traceable online.

Exercise prompts:
- outragous  [outrageous]
- peacable  [peaceable]
- Spell the word: giving you an advantage.  [advantageous]
- Spell the word: able to be charged to an account.  [chargeable]
- Choose the correct spelling: able to be pronounced.  [pronounceable]
- Choose the correct spelling: very beautiful.  [gorgeous]
- knowledgable  [knowledgeable]
- replacable  [replaceable]
- tracable  [traceable]
- irreplacable  [irreplaceable]
- Spell the word: able to be managed.  [manageable]
- Spell the word: full of courage.  [courageous]
- Spell the word: able to be changed.  [changeable]
- Choose the correct spelling: able to be exchanged.  [exchangeable]
- Choose the correct spelling: in good enough condition to be used.  [serviceable]
- Choose the correct spelling: easy to see or notice.  [noticeable]
