# NEW, SEPARATE TASK (rules3-33.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "Weather or whether" (slug: weather-vs-whether).

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: Weather or whether
- Explanation: Weather is the condition outside. Whether introduces a question or a choice.
- Memory hook: Weather is outside; whether is a choice.
- Confusable words: weather, whether.

## What to write (exactly these numbers)
- examples: 36 in total: 16 "correct", 20 "incorrect".
- exercises: 48 in total: 30 fill_gap, 18 multiple_choice.

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
{"type":"fill_gap","prompt":"We do not know ___ the train is late.","answer":"whether"}
{"type":"fill_gap","prompt":"The ___ was windy all week.","answer":"weather"}
{"type":"fill_gap","prompt":"She cannot decide ___ to stay or leave.","answer":"whether"}
{"type":"multiple_choice","prompt":"Choose the word: Nobody knows ___ he will come.","answer":"whether","choices":["weather","whether"]}
{"type":"multiple_choice","prompt":"Choose the word: Today’s ___ forecast says rain.","answer":"weather","choices":["weather","whether"]}
{"type":"multiple_choice","prompt":"Choose the word: I wonder ___ it will snow tomorrow.","answer":"whether","choices":["weather","whether"]}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"weather-vs-whether","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after.

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "weather-vs-whether".

## Already exists (18 examples, 16 known exercises; do not repeat)
Examples:
- The weather improved before our walk.
- I asked whether the shop was open.
- The whether is cold today.  -> The weather is cold today.
- I wonder weather she is home.  -> I wonder whether she is home.
- The weather is sunny today.
- I am not sure whether it will rain.
- I asked weather it was ready.  -> I asked whether it was ready.
- The whether is nice in spring.  -> The weather is nice in spring.
- The weather was warm during our trip.
- I do not know whether to go or stay.
- Check the weather before you leave.
- She asked whether I wanted some tea.
- I am not sure weather he is ready.  -> I am not sure whether he is ready.
- The whether forecast says snow.  -> The weather forecast says snow.
- Nobody knows weather the shop is open.  -> Nobody knows whether the shop is open.
- We enjoyed the sunny whether on holiday.  -> We enjoyed the sunny weather on holiday.
- She cannot decide weather to buy it.  -> She cannot decide whether to buy it.
- Bad whether stopped the flights.  -> Bad weather stopped the flights.

Exercise prompts:
- We do not know ___ the train is late.  [whether]
- The ___ was windy all week.  [weather]
- Choose the word: Nobody knows ___ he will come.  [whether]
- Choose the word: Today’s ___ forecast says rain.  [weather]
- She cannot decide ___ to stay or leave.  [whether]
- In hot ___ we drink more water.  [weather]
- Ask her ___ she needs a lift.  [whether]
- Cold ___ makes me sleepy.  [weather]
- Choose the word: I wonder ___ it will snow tomorrow.  [whether]
- Choose the word: The ___ was lovely at the beach.  [weather]
- He is not sure ___ to call or write.  [whether]
- We stayed inside because of the stormy ___.  [weather]
- Choose the word: Tell me ___ you like the film.  [whether]
- Choose the word: What is the ___ like in Spain in July?  [weather]
- She asked ___ the bus was late.  [whether]
- The ___ report says it will be hot.  [weather]
