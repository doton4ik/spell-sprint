# Как начать новую сессию (состояние на 19 октября 2026)

Новую сессию можно открывать на каждую задачу: проект помнит всё сам (`CLAUDE.md`, git, эти файлы). В первой фразе достаточно одной строки
задачи. Перед закрытием сессии всё закоммичено, поэтому `git log --oneline -20` показывает, на чём остановились.

## Что уже сделано (кратко)
- **Библиотека:** 964 слова, 26 тем в 8 разделах, у каждого слова уровень A2–C1 (`src/data/libraryTopics.ts`, `scripts/library-topics.mjs`).
- **Проверка уровня:** формат Oxford/Cambridge, 30 вопросов и быстрая версия на 16, подуровни («upper B1»).
- **Дизайн:** бумажный, единые отступы (`--page-*`), скрываемое меню, правая панель практики с разбором ответа.
- **Правила:** 63 правила в базе, после запуска пака 11 активных 57 (6 правил про артикли слиты в `a-or-the`, `node scripts/merge-article-rules.mjs`; гонять его заново после `build-articles-pack` / `build-more-practice-pack`). Ответы ассистента для слитых slug `merge-rule-answers.mjs` сам направляет в `a-or-the`. Паки 6–10 применены в базе (63 правила, 2448 примеров и 3113 упражнений там сейчас); пак 8 добавил 8 новых правил, пак 9 ещё 12 (`node scripts/build-new-rules-pack.mjs 8|9` собирает SQL и офлайн-копию из `database/rules-import/`).

## Что ждёт пользователя (не делается из Claude Code)
1. **Запустить `database/content-pack-11-merge-articles.sql`** в SQL Editor (откат: `content-pack-11-undo.sql`): 6 правил про артикли сливаются в `a-or-the` («Articles: the, a / an or no article»), старые правила выключаются, а не удаляются. До запуска приложение онлайн показывает старые правила, офлайн-копия уже новая.
   Остальное в базе совпадало с кодом на 20 октября. Следующий SQL появится, когда будут новые правила: `node scripts/build-new-rules-pack.mjs N` собирает пак из `database/rules-import/`.
2. `pnpm test:e2e` в своём терминале (в песочнице Claude часть тестов падает из-за сети, см. ниже) и `git push`, если есть незапушенные коммиты.
3. Разобрать входящие: `database/reports-inbox.sql` (в базе были 12 записей client_errors и 6 word_reports).

## Что дальше (по порядку полезности)
1. **Новые слова для библиотеки.** Задания `research/plexity/prompts/newwords-01…33.md` отдать ассистенту (новый чат на каждое), ответы сохранять в
   `research/plexity/answers/newwords/newwords-NN.json`; проверка и добавление: `node scripts/merge-newwords.mjs` (без `--apply` показывает,
   что примет), затем `--apply`, `pnpm check`. Цель: около 2300 слов. Каждое слово приходит с седьмым полем «subtopic» из фиксированного списка темы (`scripts/library-subtopics.mjs`); `merge-newwords.mjs` пропускает только имена из списка (регистр не важен) и пишет их в CSV, а `pnpm check:library` следит за этим. Новая подтема: добавить в список и снова `node scripts/make-newword-prompts.mjs`. Opus просматривает выборку перед коммитом.
2. **Размер бандла (сделано 19 октября).** Первый чанк `index.js` был 607 КБ (197 КБ gzip), стал 334 КБ (110 КБ gzip): тексты пар (`pairDrills.ts`) и банк проверки уровня теперь грузятся только со своими страницами. Первый экран читает лёгкие `src/data/pairIndex.ts` и `levelItemKindsData.ts`. Остался общий чанк `Icon-*.js` (около 380 КБ, из них около 310 КБ это CSV библиотеки) и `mistakeGuides.ts` (26 КБ). **После добавления новой пары:** `node scripts/build-pair-index.mjs`. **После изменения вопросов проверки уровня:** `UPDATE_LEVEL_KINDS=1 pnpm exec vitest run src/data/levelItemKindsGenerate.test.ts && pnpm exec prettier --write src/data/levelItemKindsData.ts` (тесты подскажут, если список устарел).
3. **Чистка кода** (нужно подтверждение пользователя на удаление в `src/`): файлы без импортов `src/components/libraries/LibraryCard.tsx`,
   `src/data/personalMistakes.ts`; около 40 неиспользуемых экспортов; одноразовые SQL `content-pack-2-part1…4.sql`.
4. **Идеи из `research/competitors.md`:** «заморозка» серии, слова ниже вашего уровня как «уже знаю».

## Как возобновить каждую задачу (команды)
| Задача | Команды |
|---|---|
| Слова | `node scripts/merge-newwords.mjs [--apply]` |
| Темы и уровни слов | `node scripts/merge-topics.mjs [--apply]`, `node scripts/apply-topic-map.mjs --write` |
| Примеры и упражнения правил | `node scripts/merge-rule-answers.mjs [--apply] [--pack N]`, `node scripts/build-more-practice-pack.mjs` |
| Отбраковка после проверки Opus | `node scripts/apply-rule-drops.mjs <пакет.json> <файлы drop>` (хранится в `research/plexity/rules3-rejected.json`) |
| Все проверки | `pnpm check` (обязательно перед «готово»), `pnpm test:e2e` для интерфейса |

Подробнее про конвейер с ассистентом: `research/plexity/README.md`. Какие SQL запускались: `database/README.md`.

## Известные особенности среды
- **e2e на Windows:** раньше около трети тестов были «шаткими» (30-секундные зависания, `ERR_NETWORK_ACCESS_DENIED`, `ERR_CONNECTION_REFUSED`). Причина не в приложении: Windows время от времени отказывает в одном соединении браузера с локальным сервером (WSAEACCES, примерно 1 запрос из 500, пачками при большом числе соединений); страница без одного скрипта остаётся пустой, и тест ждёт таймаут. Плюс `vite preview` слушал только IPv6 (`::1`), а `localhost` мог идти в IPv4. Сейчас: адрес `127.0.0.1` везде (`playwright.config.ts`), а запросы к серверу идут через `e2e/fixtures.ts`, который повторяет отказавший запрос. Нормальный прогон `pnpm test:e2e` занимает около 40 секунд, а не 3,5 минуты. При 8 и больше воркерах отказы возможны чаще.
- Скрипты, где есть обратные слеши, писать через инструмент Write, а не heredoc (оболочка их съедает).
- Ночью заголовок дашборда «Good night»: тесты это учитывают.
