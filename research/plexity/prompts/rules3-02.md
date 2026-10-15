# NEW, SEPARATE TASK (rules3-02.md)
Ignore every earlier message in this chat and do not repeat earlier answers. This round is ONLY for the rule "-able versus -ible endings" (slug: able-vs-ible), exercises only.

You are writing practice material for an English-spelling app for Russian-speaking learners (levels A2-B1). Write NEW material for this rule. The rule already has some; you add more, so the learner does not run out.

## The rule
- Title: -able versus -ible endings
- Explanation: Some adjectives end in -able and others in -ible, and there is no simple rule, so these words are often best learned individually, like available and possible.
- Memory hook: Able is common; ible likes to hide in short roots.

## What to write (exactly these numbers)
- exercises: 60 in total: 36 multiple_choice, 24 correct_word.

## Rules for every item
- British English spelling. Everyday sentences of 5-12 words, plain words (A2-B1), natural, grammatical, no slang, no proper names that are hard to spell.
- Vary the topics, subjects, tenses and sentence shapes (home, school, work, travel, food, family, hobbies). Do not start many sentences the same way.
- Do not repeat or lightly reword any sentence in "Already exists" below, and do not repeat a sentence inside your own answer.
- Every item must be unambiguous: for a gap or a choice exactly ONE answer is correct. If two answers could fit the sentence, change the sentence.
- The sentence itself must test THIS rule, not another one.

## Exercises (each item: {"type","prompt","answer"} and "choices" for multiple_choice)
- multiple_choice: a sentence with one gap ___ ; "prompt" starts with "Choose the word: "; "choices" has the right answer and 1-2 wrong options; "answer" is exactly one of the choices.
- correct_word: "prompt" is ONE misspelled or wrong word, "answer" is the correct word (no sentence).

Format examples of existing exercises (copy the shape, not the content):
```
{"type":"multiple_choice","prompt":"Choose the correct spelling: The road is ___ after heavy rain.","answer":"passable","choices":["passable","passible"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: The building is ___ by wheelchair.","answer":"accessible","choices":["accessible","accessable"]}
{"type":"multiple_choice","prompt":"Choose the correct spelling: This jacket is ___ for cold weather.","answer":"suitable","choices":["suitable","suitible"]}
{"type":"correct_word","prompt":"accessable","answer":"accessible"}
{"type":"correct_word","prompt":"suitible","answer":"suitable"}
{"type":"correct_word","prompt":"visable","answer":"visible"}
```

## Output format
ONE code block (three backticks + json) holding one JSON object: {"slug":"able-vs-ible","examples":[...],"exercises":[...]}. One item per line, compact JSON, no comments, no text before or after. Use "examples":[].

Before you answer, check: the exact numbers above; no sentence from "Already exists"; every fill_gap and multiple_choice sentence has exactly one ___ ; every multiple_choice answer is one of its choices; every "incorrect" example has a correction; the key "slug" is exactly "able-vs-ible".

## Already exists (34 examples, 20 known exercises; do not repeat)
Examples:
- It is possible to finish the project early.
- The tickets are still available online.
- responsable  -> responsible
- availible  -> available
- The menu was readable even in poor light.
- accessable  -> accessible
- readible  -> readable
- The hotel is accessible from the main road.
- This bag is suitable for school.
- The instructions were understandable and clear.
- It is impossible to park near the station.
- The website is accessable on any phone.  -> The website is accessible on any phone.
- This shirt is suitible for warm weather.  -> This shirt is suitable for warm weather.
- The story was understandible for beginners.  -> The story was understandable for beginners.
- The answer was not visable on the screen.  -> The answer was not visible on the screen.
- The old letter was barely readable.
- Fresh vegetables are available at the market.
- The damage to the car was visible.
- This route is passable by car.
- The tickets are availible at the office.  -> The tickets are available at the office.
- The sign was not readible from the road.  -> The sign was not readable from the road.
- The stain was still visable after washing.  -> The stain was still visible after washing.
- The path is accessable only in summer.  -> The path is accessible only in summer.
- This plan is not workible for our team.  -> This plan is not workable for our team.
- The result was predictible after the test.  -> The result was predictable after the test.
- The new app is available for all students.
- The handwriting was clear and readable.
- The small print was visible under the lamp.
- The mountain path is passable in dry weather.
- The form is availible at reception.  -> The form is available at reception.
- The label was not readible in the dark.  -> The label was not readable in the dark.
- The crack was visable on the wall.  -> The crack was visible on the wall.
- The garden is accessable through the side gate.  -> The garden is accessible through the side gate.
- The mistake was preventible with better planning.  -> The mistake was preventable with better planning.

Exercise prompts:
- accessable  [accessible]
- suitible  [suitable]
- visable  [visible]
- understandible  [understandable]
- Choose the correct spelling: The road is ___ after heavy rain.  [passable]
- Choose the correct spelling: The building is ___ by wheelchair.  [accessible]
- Choose the correct spelling: This jacket is ___ for cold weather.  [suitable]
- Choose the correct spelling: The text was small but still ___.  [readable]
- availible  [available]
- readible  [readable]
- predictible  [predictable]
- Choose the correct spelling: The road is ___ after the storm.  [passable]
- Choose the correct spelling: This plan is ___ for small teams.  [workable]
- Choose the correct spelling: The answer is ___ on the website.  [available]
- Choose the correct spelling: The moon was ___ in the clear sky.  [visible]
- preventible  [preventable]
- Choose the correct spelling: The entrance is ___ for visitors.  [accessible]
- Choose the correct spelling: The map is ___ at the tourist office.  [available]
- Choose the correct spelling: The road is ___ after repairs.  [passable]
- Choose the correct spelling: The name was ___ on the badge.  [visible]
