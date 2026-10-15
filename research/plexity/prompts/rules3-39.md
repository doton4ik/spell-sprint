# NEW, SEPARATE TASK (rules3-39.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "No article for things in general" (slug: no-article-in-general).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: No article for things in general
- Explanation: When you talk about a whole group or an idea in general, use no article with plural and uncountable nouns: I love music. Cats are independent. Life is not easy. Use the only when you mean something specific: The music at the party was too loud.
- Memory hook: In general: nothing. Specific: the.

## What to write (exactly these numbers)
- examples: 18 in total: 10 "correct", 6 "incorrect", 2 "exception".
- exercises: 28 in total: 28 multiple_choice.

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

Format examples of existing exercises (copy the shape, not the content):
```
{"type":"multiple_choice","prompt":"I love ___ music.","answer":"no article","choices":["a","an","the","no article"]}
{"type":"multiple_choice","prompt":"___ cats are independent animals.","answer":"no article","choices":["a","an","the","no article"]}
{"type":"multiple_choice","prompt":"___ life is not easy.","answer":"no article","choices":["a","an","the","no article"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"no-article-in-general","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "no-article-in-general".

## Already exists (9 examples, 14 known exercises; do not repeat)
Examples:
- I love music.
- Children need love and attention.
- The music at the party was too loud.
- The life is not easy.  -> Life is not easy.
- I like the apples.  -> I like apples.
- a cat / cats / the cat
- Dogs are loyal animals.
- Honesty matters more than money.
- I am afraid of the spiders.  -> I am afraid of spiders.

Exercise prompts:
- I love ___ music.  [no article]
- ___ cats are independent animals.  [no article]
- ___ life is not easy.  [no article]
- She drinks ___ water every morning.  [no article]
- ___ honesty is very important in business.  [no article]
- I like ___ apples.  [no article]
- ___ music at the party was too loud.  [the]
- ___ children need love and attention.  [no article]
- Be careful: ___ water in this bottle is dirty.  [the]
- Do you like ___ coffee?  [no article]
- ___ money does not buy happiness.  [no article]
- ___ books on that shelf are old.  [the]
- ___ cats sleep a lot.  [no article]
- Please pass ___ sugar; it is next to you.  [the]
