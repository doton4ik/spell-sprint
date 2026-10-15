# NEW, SEPARATE TASK (rules3-35.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Your vs you're" (slug: your-vs-youre).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Your vs you're
- Explanation: Your shows that something belongs to you. You're is short for you are.
- Memory hook: If you can say "you are", use you're.
- Confusable words: your, you're.

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
{"type":"fill_gap","prompt":"I hope ___ feeling better today.","answer":"you're"}
{"type":"fill_gap","prompt":"___ going to love this film.","answer":"You're"}
{"type":"fill_gap","prompt":"Please write ___ name on the form.","answer":"your"}
{"type":"multiple_choice","prompt":"Choose the word: I think ___ right about the price.","answer":"you're","choices":["your","you're"]}
{"type":"multiple_choice","prompt":"Choose the word: What is ___ favourite colour?","answer":"your","choices":["your","you're"]}
{"type":"multiple_choice","prompt":"Choose the word: ___ very good at drawing.","answer":"You're","choices":["Your","You're"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"your-vs-youre","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "your-vs-youre".

## Already exists (18 examples, 11 known exercises; do not repeat)
Examples:
- Your welcome.  -> You're welcome.
- Your invoice is ready.
- Your very kind.  -> You're very kind.
- You're bag is heavy.  -> Your bag is heavy.
- Your brother said you're coming soon.
- You're welcome to stay.
- Your answer is correct.
- Is that you're coat?  -> Is that your coat?
- Is this your umbrella?
- You're right about the time.
- I think you're ready for the test.
- Your teacher called while you were out.
- Your late again, and the lesson has started.  -> You're late again, and the lesson has started.
- You're phone is ringing.  -> Your phone is ringing.
- I hope your enjoying the trip.  -> I hope you're enjoying the trip.
- Do not forget you're ticket.  -> Do not forget your ticket.
- Your not allowed to park here.  -> You're not allowed to park here.
- Is this you're first time in London?  -> Is this your first time in London?

Exercise prompts:
- I hope ___ feeling better today.  [you're]
- ___ going to love this film.  [You're]
- Please write ___ name on the form.  [your]
- Choose the word: I think ___ right about the price.  [you're]
- Choose the word: What is ___ favourite colour?  [your]
- Call me when ___ ready to leave.  [you're]
- Do not forget ___ keys on the table.  [your]
- Choose the word: ___ very good at drawing.  [You're]
- Choose the word: Is this ___ first visit to our city?  [your]
- I can see that ___ tired after the trip.  [you're]
- Choose the word: Thank you for ___ help yesterday.  [your]
