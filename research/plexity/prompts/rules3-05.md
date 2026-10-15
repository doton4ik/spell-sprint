# NEW, SEPARATE TASK (rules3-05.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Advice or advise" (slug: advice-vs-advise).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Advice or advise
- Explanation: Advice is a noun for a suggestion. Advise is a verb meaning to give a suggestion.
- Memory hook: Advice is a thing; advise is an action.
- Confusable words: advice, advise.

## What to write (exactly these numbers)
- examples: 34 in total: 16 "correct", 18 "incorrect".
- exercises: 48 in total: 24 fill_gap, 24 multiple_choice.

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
{"type":"fill_gap","prompt":"She asked her friend for ___ about the exam.","answer":"advice"}
{"type":"fill_gap","prompt":"I would ___ you not to wait.","answer":"advise"}
{"type":"fill_gap","prompt":"That is a good piece of ___.","answer":"advice"}
{"type":"multiple_choice","prompt":"Choose the word: Thank you for your ___.","answer":"advice","choices":["advice","advise"]}
{"type":"multiple_choice","prompt":"Choose the word: The doctor will ___ you what to eat.","answer":"advise","choices":["advice","advise"]}
{"type":"multiple_choice","prompt":"Choose the word: My grandmother always gives good ___.","answer":"advice","choices":["advice","advise"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"advice-vs-advise","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "advice-vs-advise".

## Already exists (17 examples, 16 known exercises; do not repeat)
Examples:
- Her advice helped me choose a course.
- I need your advise.  -> I need your advice.
- I advise you to check the details.
- Please advice me.  -> Please advise me.
- My teacher gave me useful advice.
- Can you advise me which book to buy?
- He gave me good advise.  -> He gave me good advice.
- I advice you to start early.  -> I advise you to start early.
- She always gives me sensible advice.
- The doctor will advise him to rest.
- Thanks for the advice about the interview.
- I would advise you to leave early.
- Can I ask you for some advise?  -> Can I ask you for some advice?
- He advices me to study every day.  -> He advises me to study every day.
- My brother never takes my advise.  -> My brother never takes my advice.
- Please advice us what to do next.  -> Please advise us what to do next.
- The lawyer gave us free advise.  -> The lawyer gave us free advice.

Exercise prompts:
- She asked her friend for ___ about the exam.  [advice]
- I would ___ you not to wait.  [advise]
- Choose the word: Thank you for your ___.  [advice]
- Choose the word: The doctor will ___ you what to eat.  [advise]
- That is a good piece of ___.  [advice]
- Who can ___ me on the best route?  [advise]
- We need some ___ about which phone to buy.  [advice]
- She will ___ him to see a doctor.  [advise]
- Can you give me a piece of ___ about my CV?  [advice]
- I strongly ___ you to read the contract.  [advise]
- Choose the word: My grandmother always gives good ___.  [advice]
- Choose the word: The coach will ___ the team before the match.  [advise]
- Choose the word: I took her ___ and stayed at home.  [advice]
- Choose the word: What would you ___ me to do?  [advise]
- Choose the word: His ___ saved me a lot of money.  [advice]
- Choose the word: The bank can ___ you on loans.  [advise]
