# Промт для Perplexity: качество слов в Spell Sprint

Как пользоваться (самый простой способ):
1. Откройте файл `research/plexity/prompts/word-quality/prompt-01.txt` — в нём уже всё: задание + 40 слов.
2. Выделите всё (Ctrl+A), скопируйте (Ctrl+C).
3. В Perplexity включите **Deep Research**, вставьте (Ctrl+V) и отправьте.
4. Perplexity ответит таблицей. Скопируйте её в новый файл `research/plexity/answers/word-quality/batch-01.csv`
   (или просто пришлите её мне в чат — я сохраню сам).
5. Повторите с `prompt-02.txt`, `prompt-03.txt` … до `prompt-25.txt`.

Ниже — тот же промт без слов (для справки; файлы в `research/plexity/prompts/word-quality/` собраны из него и из `research/plexity/inputs/word-quality-batches/`).
5. Когда наберётся несколько файлов, скажите мне «влей ответы» — я проверю каждую строку (формат, длина, что слово стоит в примере, британское написание, нет ли копий из словарей) и только потом обновлю библиотеку.

Один пакет за раз — так Perplexity не обрезает ответ и не придумывает данные.

---

## PROMPT

```
You are helping to improve the word data of "Spell Sprint", a spelling and vocabulary trainer
for Russian-speaking learners of English (levels A2–C1). The app uses each word in several tasks:
- the learner sees the Russian translation and types the English word;
- dictation (the learner hears the word);
- choosing the correct spelling among misspellings;
- after answering, the learner sees an example sentence and a short English definition;
- a hint about the spelling trap of the word.

Below is a batch of words (CSV). For EACH row, research how the word is really used and return
improved data. Use your research tools: learner dictionaries, corpora and word lists, to check
meaning, typical collocations, CEFR level and spelling difficulty.

=== SOURCES AND COPYRIGHT (important) ===
- Use dictionaries and corpora as EVIDENCE only (Cambridge, Oxford Learner's, Longman, Collins,
  Macmillan, English Vocabulary Profile, BNC, COCA, SkELL, Ludwig, Google Ngram).
- Do NOT copy their example sentences or definitions word for word: they are copyrighted.
  Write ORIGINAL sentences and definitions that follow the typical usage you found.
- You MAY copy sentences from openly licensed sources (Tatoeba – CC BY 2.0 FR; Wiktionary –
  CC BY-SA) — then put the exact URL in "source".
- Never invent statistics or levels. If you are not sure, leave the field empty and explain in "notes".

=== RULES FOR EACH FIELD ===
translation_check:
  "ok" if the Russian translation matches the main everyday meaning; otherwise a better Russian
  translation (several meanings separated by ", "; a clarification in brackets, e.g.
  "больной, ноющий (о горле, мышцах)"). Watch for false friends and for a translation that
  belongs to another English word (e.g. "болезненный" is "painful", not "sore").
example:
  ONE natural sentence, 8–16 words, everyday situation (home, study, work, travel, friends).
  - uses the word exactly in the meaning of the Russian translation;
  - contains the word in the given form (a verb may change form: go → went is fine);
  - British spelling and vocabulary (colour, organise, flat, mobile);
  - no real people, brands, politics, religion, violence, alcohol or adult topics;
  - not about logistics or warehouses unless the topic column says so;
  - the sentence must make the meaning clear even without the translation
    ("She paid the bill" is weak; "After dinner, the waiter brought us the bill" is good).
example_2, example_3:
  Two more sentences of the same quality in different situations (for future gap-fill and
  proofreading tasks). A different collocation in each, if possible.
definition:
  Learner-friendly English definition, max 15 words, using only words easier than the headword.
  Do not start with the headword. Nouns: "a/an …", verbs: "to …".
cefr:
  A1/A2/B1/B2/C1/C2 — the level of THIS meaning, from English Vocabulary Profile or Oxford 3000/5000.
  Empty if not found.
collocations:
  3–5 most frequent collocations or phrases with this meaning, separated by "; "
  (e.g. "pay the bill; split the bill; the bill came to").
spelling_trap:
  Short hint (max 60 characters) about WHY the word is hard to spell for a Russian speaker,
  e.g. "double c, double m", "silent b at the end", "-ence, not -ance",
  "ei after c". Empty if the word has no real trap.
common_misspellings:
  2–4 real misspellings that learners actually produce (search learner-error data, spelling
  lists, "commonly misspelled words" lists, Ludwig/Google results). Separated by "; ".
  Every item must be a non-word (never a real English word).
alternatives:
  Other English words or spellings that are ALSO a correct answer for the same Russian prompt
  and should be accepted (e.g. rubbish → "trash; garbage"; mobile phone → "mobile; cell phone").
  Only true equivalents, separated by "; ". Empty if none.
source:
  URL(s) used as evidence for the meaning / level (and the licence URL if a sentence was copied).
notes:
  Anything the editor should know: the word is too rare or too specialised for its level, the
  translation is ambiguous, the word should rather be removed, etc. Otherwise empty.

=== OUTPUT FORMAT ===
Return ONLY one CSV code block, UTF-8, comma-separated, every field in double quotes, a header
row and exactly one row per input row, in the same order, with these columns:

"word_id","word","translation_check","example","example_2","example_3","definition","cefr","collocations","spelling_trap","common_misspellings","alternatives","source","notes"

Keep word_id and word exactly as in the input. Do not skip rows. Do not add commentary
outside the code block.

=== INPUT BATCH ===
<<PASTE BATCH HERE>>
```

---

## Отдельный промт: источники данных (один раз)

Если хотите не заполнять слова, а найти готовые открытые наборы данных для будущих функций:

```
I am building a free spelling and vocabulary trainer for Russian-speaking learners of English
(A2–C1). Find openly licensed or free-to-use datasets and research I can use, with links and
licence for each:
1. Learner spelling-error corpora or lists of the most common English misspellings, ideally by
   speakers of Russian or other Slavic languages (e.g. learner corpora, Birkbeck spelling error
   corpus, Wikipedia "lists of common misspellings").
2. Word lists with CEFR levels (Oxford 3000/5000, English Vocabulary Profile, CEFR-J, Kelly
   list) — what may be used freely and under which conditions.
3. Open sentence collections for example sentences (Tatoeba, Wiktionary, OpenSubtitles,
   Simple English Wikipedia) — licence, quality, how to filter by level.
4. Lists of confusable words / homophones for learners (their/there, affect/effect) with
   example sentences.
5. Typical grammar errors of Russian speakers in English writing (articles, tenses,
   prepositions) — research papers or corpora with error statistics.
For each item: what it contains, size, licence, download link, and how reliable it is.
Present the result as a table, then a short recommendation of the 5 best sources.
```
