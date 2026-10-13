# NEW, SEPARATE TASK (rules-19)
Ignore every earlier message in this chat and do not repeat earlier answers. This round covers EXACTLY these items and nothing else: no-article-in-general, no-article-names-meals-languages.
Your answer must contain these items only.

You are writing content for "Spell Sprint", an English spelling trainer for Russian-speaking learners (levels A2-B2). Each spelling or grammar RULE has examples (shown on the rule page) and exercises (practice tasks).
Answer with JSON only: one JSON array, no text outside it, no comments. Write everything yourself. Avoid British/American differences (colour/color, theatre/theater, practise as verb): use standard British spelling only when the rule itself is about it.

## Your task in this round

For each of the 2 rules below write **10 new examples and 10 new exercises**. Do not repeat anything that is listed (the listing shows what exists). The rule text tells you what the rule teaches: every example and exercise must be provably right or wrong by THAT rule.

### no-article-in-general — No article for things in general  (article rule)
Rule: When you talk about a whole group or an idea in general, use no article with plural and uncountable nouns: I love music. Cats are independent. Life is not easy. Use the only when you mean something specific: The music at the party was too loud.
Memory hint: In general: nothing. Specific: the.
Existing examples (do not repeat; 9):
    - [correct] I love music.
    - [correct] Children need love and attention.
    - [correct] The music at the party was too loud.
    - [incorrect] The life is not easy.  ->  Life is not easy.
    - [incorrect] I like the apples.  ->  I like apples.
    - [exception] a cat / cats / the cat
    - [correct] Dogs are loyal animals.
    - [correct] Honesty matters more than money.
    - [incorrect] I am afraid of the spiders.  ->  I am afraid of spiders.
Existing exercises (do not repeat; showing 14 of 14):
    - [multiple_choice] I love ___ music.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] ___ cats are independent animals.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] ___ life is not easy.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] She drinks ___ water every morning.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] ___ honesty is very important in business.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] I like ___ apples.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] ___ music at the party was too loud.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] ___ children need love and attention.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] Be careful: ___ water in this bottle is dirty.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] Do you like ___ coffee?  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] ___ money does not buy happiness.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] ___ books on that shelf are old.  =>  the  (choices: a / an / the / no article)
    - [multiple_choice] ___ cats sleep a lot.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] Please pass ___ sugar; it is next to you.  =>  the  (choices: a / an / the / no article)

### no-article-names-meals-languages — No article: names, meals, languages, sports  (article rule)
Rule: Use no article with names of people, most cities and countries, languages, sports and the meals: Paris, Canada, French, football, breakfast. If you add an adjective to a meal, you need a: We had a wonderful lunch.
Memory hint: Names, languages, games and meals walk alone.
Existing examples (do not repeat; 9):
    - [correct] I usually have breakfast at seven.
    - [correct] She speaks French and Spanish.
    - [correct] We had a wonderful lunch at the beach.
    - [incorrect] I live in the Paris.  ->  I live in Paris.
    - [incorrect] He plays the chess very well.  ->  He plays chess very well.
    - [exception] the Browns
    - [correct] We play tennis every Saturday.
    - [correct] Dinner is at eight.
    - [incorrect] The Maria is my sister.  ->  Maria is my sister.
Existing exercises (do not repeat; showing 14 of 14):
    - [multiple_choice] I usually have ___ breakfast at seven.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] She speaks ___ French and Spanish.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] We play ___ football on Sundays.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] I live in ___ Paris.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] We had ___ wonderful lunch at the beach.  =>  a  (choices: a / an / the / no article)
    - [multiple_choice] He plays ___ chess very well.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] My friend works in ___ Canada.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] ___ Spanish is easy for her.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] We had ___ lunch at noon.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] ___ Mr Brown is my English teacher.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] She is learning ___ German.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] We had ___ breakfast in bed.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] He plays ___ basketball after school.  =>  no article  (choices: a / an / the / no article)
    - [multiple_choice] They invited us to ___ lovely dinner.  =>  a  (choices: a / an / the / no article)

## Examples (10 per rule)

- 4 of type "correct": a natural sentence that uses the rule correctly. 6 of type "incorrect": a sentence with the typical mistake learners make, and the same sentence corrected in "correction" (only the mistake changes). One mistake per sentence.
- "note": a short reason, at most 80 characters, naming the point of the rule ("Soft c before e: city, not sity").
- Sentences of 5-14 words, everyday topics, different words and structures. Easy words except the target of the rule.
- A word that is spelled wrongly must be a spelling mistake a real learner makes, not a random typo.

## Exercises (10 per rule), mix of these types

- "fill_gap": a sentence with one ___ and one correct word as "answer". The context must allow exactly one answer.
- "multiple_choice": a prompt with ___ (or "Choose the correct spelling: ...") and "choices" (2-4 options, all different, "answer" is exactly one of them).
- "correct_word": "prompt" is a wrongly spelled word, "answer" is the correct spelling (use only for spelling rules, not for the confusable-word or article rules).
- "spell": "prompt" like "Spell the word: the plural of baby." and "answer" the one correct word (use only for rules where a form is built: plural, past tense, comparative, suffix).
Choose the types that fit the rule: spelling-form rules mostly correct_word, spell and multiple_choice; confusable pairs mostly fill_gap and multiple_choice; article rules fill_gap and multiple_choice with the options a / an / the / no article ("no article" written exactly that way).
Every exercise is independent: no "see the sentence above". Every answer must be unambiguous.

## Output format

One array with one object per rule listed in this round. The shape (the values are placeholders, NOT content to copy):

[
  {"slug": "<a slug from the list above>",
   "examples": [{"type": "correct", "text": "<sentence>", "note": "<short reason>"},
                {"type": "incorrect", "text": "<sentence with the typical mistake>", "correction": "<the same sentence corrected>", "note": "<short reason>"}],
   "exercises": [{"type": "fill_gap", "prompt": "<sentence with one ___>", "answer": "<word>"},
                 {"type": "multiple_choice", "prompt": "<sentence with ___>", "answer": "<word>", "choices": ["<word>", "<word>"]}]}
]

Use the slug exactly as written. Before you answer, check every item against the rule above: wrong sentences must really be wrong, correct ones really correct, each exercise has exactly one answer.

## How to answer (important)

- Put the WHOLE answer in ONE code block (three backticks + json). Outside a code block the chat removes the underscores of the gaps (___) and breaks the JSON.
- Compact JSON: one item per line, no comments, no text before or after the code block.
- Never stop in the middle of an item. If you run out of room, end after the last COMPLETE item and close all brackets; I will ask you to continue.
