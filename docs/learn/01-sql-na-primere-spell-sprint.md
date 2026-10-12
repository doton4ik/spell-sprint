# SQL на примере Spell Sprint

Курс для начинающего. Все примеры берут настоящие таблицы вашего проекта (Supabase, проект **SpellSprint**).
Результаты, которые указаны в тексте, проверены на живой базе 12 октября 2026; у вас числа могут чуть отличаться,
если вы добавили правила.

## Как пользоваться

1. Откройте Supabase, проект **SpellSprint**, слева **SQL Editor**, кнопка **New query**.
2. Вставьте запрос и нажмите **Run** (Ctrl+Enter). Внизу появится таблица результата.
3. В разделе 1–7 все запросы начинаются со слова `select`. Они только читают данные и ничего не меняют, их
   безопасно запускать сколько угодно раз.
4. Менять данные (раздел 8) пробуйте только так, как там показано: внутри `begin; … rollback;`, который отменяет всё.
5. Читайте ошибки. В SQL ошибка почти всегда указывает на строку и слово, которое не понравилось.

Запрос заканчивается точкой с запятой `;`. Регистр слов `select` и `SELECT` не важен. Текст в строках пишется в
одинарных кавычках: `'public'`. Двойные кавычки нужны только для необычных имён.

---

## 1. База данных, таблица, строка, столбец

База данных — набор **таблиц**. Таблица похожа на лист Excel: **столбцы** (поля) описывают, что хранится, **строки**
(записи) — сами данные. В проекте таблицы такие:

| Таблица | Что хранит |
|---|---|
| `rules` | правила: «A or an», «Lose vs loose» … (41 штука) |
| `rule_examples` | примеры к правилам (правильные и неправильные) |
| `rule_exercises` | упражнения к правилам (вопрос, ответ, варианты) |
| `rule_word_links` | какие слова из библиотеки относятся к правилу |
| `mistake_events` | ваши ошибки (по одной строке на ошибку) |
| `user_rule_progress` | ваш прогресс по каждому правилу |

Описание всех таблиц лежит в файле `database/rules-schema.sql`. Откройте его рядом: там видно, как каждая таблица
создаётся.

### Запрос 1.1 — посмотреть таблицу

```sql
select * from public.rules limit 5;
```

- `select` — «покажи».
- `*` — все столбцы.
- `from public.rules` — из таблицы `rules` в схеме `public` (схема — как папка для таблиц).
- `limit 5` — не больше пяти строк.

Вы увидите столбцы `id`, `slug`, `title`, `category`, `rule_type`, `short_explanation` и другие.

### Запрос 1.2 — только нужные столбцы

```sql
select slug, title, rule_type, source, visibility, is_active
from public.rules
order by created_at
limit 5;
```

Первая строка результата: `vowel-order-ei-ie | Vowel order: i and e | exception | built-in | public | true`.
`order by created_at` сортирует по дате создания (от старых к новым). Для обратного порядка — `order by created_at desc`.

**Упражнение 1.** Покажите `title` и `short_explanation` пяти самых новых правил.

### Проверьте себя (раздел 1)

1. Чем строка таблицы отличается от столбца? Что в таблице `rules` одна строка, а что один столбец?
2. Что делает `limit 5` и зачем он нужен, когда вы смотрите незнакомую таблицу?
3. Что значит `public` в записи `public.rules`?

<details>
<summary>Ответы</summary>

1. Строка — одна запись (одно правило), столбец — одно свойство, которое есть у всех записей (например `title`).
2. Оставляет в ответе не больше пяти строк. Так не загружаются тысячи строк, пока вы только знакомитесь с таблицей.
3. Это схема, «папка», в которой лежит таблица. `public` — стандартная схема для таблиц приложения.

</details>

---

## 2. Типы данных и ограничения

Посмотрите на `database/rules-schema.sql`, таблица `rules`:

```sql
id uuid primary key default gen_random_uuid(),
slug text not null unique,
rule_type text not null check (rule_type in ('language_rule', 'exception', 'confusing_words', 'personal_note')),
visibility text not null default 'private' check (visibility in ('public', 'private')),
is_active boolean not null default true,
metadata jsonb not null default '{}'::jsonb,
created_at timestamptz not null default now()
```

Это главный урок про устройство данных:

| Слово | Что значит |
|---|---|
| `uuid` | длинный уникальный идентификатор вроде `3f2b…`, его создаёт сама база |
| `text` | строка любой длины |
| `boolean` | `true` или `false` |
| `jsonb` | вложенные данные в формате JSON (список, набор полей) |
| `timestamptz` | дата и время с часовым поясом |
| `primary key` | главный ключ: значение уникально и однозначно называет строку |
| `not null` | поле нельзя оставить пустым |
| `unique` | двух одинаковых значений в столбце быть не может |
| `default …` | значение по умолчанию, если его не указали |
| `check (…)` | правило-страж: туда нельзя записать ничего другого |

Благодаря `check` невозможно создать правило с `visibility = 'secret'`: база откажет. Приложение защищено не только
кодом, но и самой базой.

**Упражнение 2.** Какое значение у столбца `source` по умолчанию? Где вы это видите? (Ответ в конце.)

### Проверьте себя (раздел 2)

1. Что означает `not null` у столбца и что будет, если вставить строку без этого значения?
2. Почему в таблицу `rules` нельзя записать `visibility = 'secret'`?
3. Почему у правил `id` типа `uuid`, а не 1, 2, 3?

<details>
<summary>Ответы</summary>

1. Поле нельзя оставить пустым. База откажет и вернёт ошибку, строка не сохранится (если нет `default`, который подставит значение).
2. Ограничение `check (visibility in ('public', 'private'))` пропускает только эти два значения.
3. Такой идентификатор уникален во всём мире и его нельзя угадать. Его можно создать на любом устройстве, не спрашивая базу, не боясь совпадений.

</details>

---

## 3. Фильтрация: `where`

```sql
select title, category
from public.rules
where category = 'english_grammar'
order by title;
```

Вернёт 8 правил про артикли, которые вы добавляли. Условия соединяют `and` / `or`, отрицание — `not` или `<>`.

```sql
-- Публичные правила на тему "confusing_words" или "plural_forms"
select title
from public.rules
where visibility = 'public'
  and category in ('confusing_words', 'plural_forms');

-- Поиск по части текста: like и знак % ("любое количество символов")
select title
from public.rules
where title ilike '%vs%';
```

`ilike` — как `like`, но без различия регистра. Сравнивать с пустым значением нужно через `is null` / `is not null`,
а не через `= null`.

**Упражнение 3.** Найдите правила, в названии которых есть слово `Plural`.

### Проверьте себя (раздел 3)

1. Как выбрать правила, у которых категория не `confusing_words`?
2. Чем `like` отличается от `ilike`?
3. Почему `where mnemonic = null` ничего не находит и как правильно?

<details>
<summary>Ответы</summary>

1. `where category <> 'confusing_words'` (или `not category = …`).
2. `ilike` не различает заглавные и строчные буквы, `like` различает.
3. `null` значит «неизвестно», сравнение с ним не бывает истинным. Правильно: `where mnemonic is null` или `is not null`.

</details>

---

## 4. Агрегаты: `count`, `group by`, `having`

Агрегат сворачивает много строк в одно число.

```sql
select count(*) from public.rules;
```

Ответ: **41**.

`group by` делит строки на группы и считает отдельно в каждой:

```sql
select category, count(*) as rules
from public.rules
group by category
order by rules desc;
```

Результат (начало): `confusing_words 15`, `english_grammar 8`, `prefixes_and_suffixes 5`, `irregular_forms_and_exceptions 3`…
`as rules` даёт столбцу имя.

`where` отбирает строки до подсчёта, `having` отбирает группы после подсчёта:

```sql
select r.category, count(x.id) as exercises
from public.rules r
join public.rule_exercises x on x.rule_id = r.id
group by r.category
having count(x.id) > 50
order by exercises desc;
```

Ответ: `confusing_words 146`, `english_grammar 80`, `prefixes_and_suffixes 52`. Сначала это упражнения, затем они
сгруппированы по теме правила и остались только темы, где больше 50 упражнений. Что такое `join`, будет в разделе 5.

Другие агрегаты: `sum`, `avg`, `min`, `max`, `count(distinct …)`.

```sql
-- Сколько у вас ошибок всего и на скольких разных словах
select count(*) as mistakes_total, count(distinct word_id) as different_words
from public.mistake_events;
```

(Сейчас: 230 ошибок на 159 словах.)

**Упражнение 4.** Сколько упражнений каждого типа (`exercise_type`) в базе? (Подсказка: `group by exercise_type`.)

### Проверьте себя (раздел 4)

1. Что делает `group by category`? Что будет в результате без него, если написать `select category, count(*)`?
2. Чем `where` отличается от `having`?
3. Чем `count(*)` отличается от `count(distinct word_id)`?

<details>
<summary>Ответы</summary>

1. Делит строки на группы по категории и считает отдельно в каждой. Без него база выдаст ошибку: нельзя смешивать обычный столбец и агрегат без группировки.
2. `where` отбирает строки до подсчёта, `having` отбирает группы после (по результату агрегата, например `count(*) > 50`).
3. Первое считает все строки, второе только разные значения `word_id`. Поэтому «230 ошибок, но 159 разных слов».

</details>

---

## 5. Связи между таблицами: `join`

Данные разложены по разным таблицам, чтобы не повторяться. В таблице `rule_examples` нет названия правила, только
`rule_id`. Это **внешний ключ** (`foreign key`): он ссылается на `rules(id)`.

В схеме это записано так:

```sql
rule_id uuid not null references public.rules(id) on delete cascade
```

- `references` — значение обязано существовать в `rules.id`. Нельзя добавить пример к правилу, которого нет.
- `on delete cascade` — если правило удалить, его примеры удалятся вместе с ним.

Чтобы собрать данные вместе, используют `join`:

```sql
select r.title, e.example_type, e.text, e.correction
from public.rule_examples e
join public.rules r on r.id = e.rule_id
where r.slug like '%a-or-an%'
order by e.example_type
limit 6;
```

- `rule_examples e` и `rules r` — короткие имена («алиасы»), чтобы не писать длинно.
- `on r.id = e.rule_id` — как строки двух таблиц связаны.

Результат: правило «A or an: the sound decides» и примеры: `an hour`, `a university`, `She is a honest person.` →
`She is an honest person.`

### `join` и `left join`

`join` (то же, что `inner join`) оставляет только строки, у которых нашлась пара. `left join` оставляет **все** строки
левой таблицы, а где пары нет, подставляет пустое значение.

```sql
select r.title, count(x.id) as exercises
from public.rules r
left join public.rule_exercises x on x.rule_id = r.id
where r.visibility = 'public'
group by r.id, r.title
order by exercises desc, r.title
limit 8;
```

Начало: `Double consonants 14`, `Lose vs loose 14`, `Vowel order: i and e 14`… Правило без упражнений вернулось бы
с нулём. С обычным `join` оно бы пропало из ответа. Это самая частая причина «потерявшихся» строк.

**Упражнение 5.** Найдите правила, у которых нет ни одного примера. (Подсказка: `left join`, затем `where e.id is null`.)

### Проверьте себя (раздел 5)

1. Что такое внешний ключ и что он гарантирует?
2. Что случится с примерами правила, если удалить само правило? Какая строка схемы за это отвечает?
3. Когда нужен `left join`, а не `join`? Приведите пример из проекта.

<details>
<summary>Ответы</summary>

1. Столбец, значение которого обязано существовать в другой таблице (`rule_id` → `rules.id`). Нельзя добавить пример к правилу, которого нет.
2. Они удалятся вместе с ним: `on delete cascade`.
3. Когда нужны все строки левой таблицы, даже без пары. Например, показать все правила и число упражнений, включая те, где их 0.

</details>

---

## 6. Подзапросы и `with`

Запрос можно вставлять в запрос.

```sql
with per_rule as (
  select rule_id, count(*) as examples
  from public.rule_examples
  group by rule_id
)
select r.title, p.examples
from per_rule p
join public.rules r on r.id = p.rule_id
where p.examples > (select avg(examples) from per_rule)
order by p.examples desc
limit 5;
```

`with per_rule as (…)` — это временная именованная таблица («CTE»), которая существует только внутри этого запроса.
Затем берутся правила, у которых примеров больше среднего. Результат: `Forming adverbs with -ly 8`,
`Dropping the silent e 8` и ещё три правила.

Читайте такие запросы **изнутри наружу**: сначала что делает `with`, потом основной `select`.

### Проверьте себя (раздел 6)

1. Что такое `with per_rule as (…)` и как долго «живёт» эта таблица?
2. В каком порядке читать запрос с `with` и подзапросом в `where`?
3. Зачем в примере нужно `(select avg(examples) from per_rule)`?

<details>
<summary>Ответы</summary>

1. Именованный подзапрос (CTE). Он существует только внутри этого запроса.
2. Изнутри наружу: сначала что считает `with` и подзапрос, потом основной `select`.
3. Чтобы сравнить число примеров правила со средним по всем правилам, не вычисляя его вручную.

</details>

---

## 7. JSON внутри базы

У упражнений есть столбец `choices` типа `jsonb`: список вариантов ответа.

```sql
select prompt, choices, answer
from public.rule_exercises
where exercise_type = 'multiple_choice'
limit 2;
```

Первая строка: `Choose the correct word: He tends to ___ interest quickly.` | `["lose","loose"]` | `lose`.

Работа с JSON:

```sql
select r.title, jsonb_array_length(x.choices) as choices_count
from public.rule_exercises x
join public.rules r on r.id = x.rule_id
where x.exercise_type = 'multiple_choice'
order by choices_count desc
limit 3;
```

Для объектов: `metadata->>'ключ'` достаёт значение как текст.

### Прочитайте ошибку

Запустите:

```sql
select title, choices, answer from public.rule_exercises limit 1;
```

Ответ: `ERROR: column "title" does not exist`. У упражнений нет столбца `title` (он есть у правил). Хорошая привычка:
открыть `rules-schema.sql` и свериться, какие столбцы в какой таблице.

### Проверьте себя (раздел 7)

1. Зачем в таблице хранить варианты ответа в `jsonb`, а не в отдельной таблице?
2. Что делает `metadata->>'set'`?
3. Как понять ошибку «column "title" does not exist» и что проверить?

<details>
<summary>Ответы</summary>

1. Варианты всегда читаются вместе с вопросом, их немного и они меняются целиком. Список в одном поле проще, чем таблица и `join`.
2. Достаёт значение ключа `set` из JSON-поля `metadata` как текст.
3. В этой таблице нет такого столбца. Открыть `rules-schema.sql` и свериться, какие столбцы у таблицы (у упражнений нет `title`, но есть `prompt`).

</details>

---

## 8. Изменение данных: `insert`, `update`, `delete`

Пока вы читали. Вот как данные меняют. **Не запускайте это без `rollback`**: так вы увидите результат и ничего не
сохраните.

```sql
begin;

-- 1. добавить строку
insert into public.rules (slug, title, category, rule_type, short_explanation)
values ('demo-rule', 'Demo rule', 'english_spelling', 'language_rule', 'Just a test.');

-- 2. изменить
update public.rules set title = 'Demo rule (edited)' where slug = 'demo-rule';

-- 3. посмотреть, что получилось
select slug, title, source, visibility from public.rules where slug = 'demo-rule';

-- 4. удалить
delete from public.rules where slug = 'demo-rule';

rollback;   -- отменить всё, как будто ничего не было
```

Запомните два правила:

- В `update` и `delete` **всегда** нужен `where`. Без него изменятся или удалятся все строки таблицы.
- Сначала напишите `select` с тем же `where` и посмотрите, какие строки попадут под изменение.

В строке 1 вы не указали `source` и `visibility`, но они заполнились по `default` (`'personal'` и `'private'`).
Это видно в шаге 3.

`begin; … commit;` (так начинаются файлы в `database/`) — **транзакция**: пачка команд, которая либо проходит целиком,
либо не проходит вообще. `commit` сохраняет, `rollback` отменяет. Поэтому в README написано: «оберните в
`begin; … commit;`, чтобы при ошибке ничего не изменилось».

### Проверьте себя (раздел 8)

1. Почему `update` или `delete` без `where` опасны?
2. Что делает `rollback` и когда он нужен при учёбе?
3. Зачем файлы в `database/` обёрнуты в `begin; … commit;`?
4. После `insert` без `source` и `visibility` эти поля всё равно заполнены. Откуда значения?

<details>
<summary>Ответы</summary>

1. Изменятся или удалятся все строки таблицы.
2. Отменяет все изменения транзакции. Нужен, чтобы пробовать `insert`/`update`/`delete` и ничего не сохранить.
3. Транзакция проходит целиком или не проходит вообще: при ошибке посередине база не остаётся в половинчатом состоянии.
4. Из `default` в схеме: `'personal'` и `'private'`.

</details>

---

## 9. Как устроены файлы в `database/`

Откройте любой файл, например `database/word-reports.sql`, и найдите знакомое:

| Что видите | Что значит |
|---|---|
| `create table if not exists …` | создать таблицу, если её ещё нет (поэтому файл можно запускать снова) |
| `on conflict do nothing` | при вставке: если такая строка уже есть, пропустить |
| `alter table … enable row level security` | включить защиту строк (раздел ниже) |
| `create policy …` | правило, кто какие строки видит и меняет |
| `create index …` | «оглавление» для быстрого поиска по столбцу |

### Индекс

Без индекса база просматривает таблицу строка за строкой. Индекс — как алфавитный указатель в конце книги:

```sql
create index if not exists rule_examples_rule_id_idx on public.rule_examples(rule_id);
```

Теперь «все примеры правила №X» находятся быстро. Индексы ставят на столбцы, по которым часто ищут и связывают
(`rule_id`, `user_id`).

### RLS: защита на уровне строк

В приложении вы видите только свои ошибки и свой прогресс, хотя они лежат в общих таблицах. Это делает RLS
(Row Level Security). Политика примерно такая: «показывать только строки, где `user_id = auth.uid()`», то есть
идентификатор вошедшего человека.

Важный момент: в **SQL Editor** вы заходите как администратор базы, и RLS вас не ограничивает. Поэтому запрос
`select count(*) from public.mistake_events` показал 230 ошибок: так вы видите все строки всех учеников. А приложение
подключается с публичным ключом и видит только строки владельца. Поэтому ключ `service_role` (обходит RLS) нельзя
класть в приложение: любой, кто откроет код страницы, получил бы доступ ко всей базе.

### Проверьте себя (раздел 9)

1. Зачем нужен индекс и чем он похож на алфавитный указатель книги?
2. Что такое RLS и почему SQL Editor видит все 230 ошибок, а приложение только ваши?
3. Почему ключ `service_role` нельзя класть в приложение?
4. Что значит `on conflict do nothing` и почему файлы можно запускать повторно?

<details>
<summary>Ответы</summary>

1. Чтобы не просматривать таблицу строка за строкой: база по индексу сразу находит нужные строки, как вы находите страницу по указателю.
2. Row Level Security: политики, кто какие строки видит. В SQL Editor вы работаете как администратор базы, RLS вас не ограничивает, а приложение подключается с публичным ключом и видит только свои строки.
3. Он обходит RLS. Любой, кто откроет код страницы, получил бы доступ ко всей базе.
4. Если такая строка уже есть, вставка пропускается без ошибки. Поэтому повторный запуск ничего не удваивает.

</details>

---

## Дополнительные упражнения

Теперь без подсказок по разделам: выберите нужные приёмы сами. Числа в ответах даны на день написания, после
добавления новых правил они могут вырасти, поэтому сверяйте не только число, но и логику запроса.

**Упражнение 6.** Сколько разных правил имеют хотя бы одно упражнение типа `spell`?

**Упражнение 7.** Сколько всего в базе примеров с типом `incorrect` (неверный пример) и у скольких разных правил они есть?

**Упражнение 8.** Покажите три правила с самым длинным `short_explanation` (название и длина текста). Подсказка: функция `length(...)`.

**Упражнение 9.** Сколько правил каждого типа `rule_type`? Отсортируйте от большего к меньшему.

**Упражнение 10.** Найдите все правила, у которых `slug` начинается на `the-`.

**Упражнение 11.** Сколько в среднем упражнений приходится на одно правило категории `english_grammar`?

**Упражнение 12.** У скольких правил заполнено поле `mnemonic` (запоминалка)?

---

## Ответы на упражнения

**1.**
```sql
select title, short_explanation from public.rules order by created_at desc limit 5;
```

**2.** `'personal'`. В `rules-schema.sql` в строке `source text not null default 'personal' check (…)`.

**3.**
```sql
select title from public.rules where title ilike '%plural%';
```

**4.**
```sql
select exercise_type, count(*) as n from public.rule_exercises group by exercise_type order by n desc;
```
Ответ: `multiple_choice 166`, `fill_gap 142`, `correct_word 62`, `spell 46`.

**5.**
```sql
select r.title
from public.rules r
left join public.rule_examples e on e.rule_id = r.id
where e.id is null;
```
Сейчас результат пустой: у каждого правила есть хотя бы один пример. Пустой результат тоже ответ. Чтобы убедиться,
что запрос работает, замените `rule_examples` на `rule_word_links` и посмотрите, у каких правил нет связанных слов.


**6.**
```sql
select count(distinct rule_id) from public.rule_exercises where exercise_type = 'spell';
```
Сейчас: 17.

**7.**
```sql
select count(*) as incorrect_examples, count(distinct rule_id) as rules_with_them
from public.rule_examples where example_type = 'incorrect';
```
Сейчас: 101 пример у 41 правила (у каждого правила есть хотя бы один).

**8.**
```sql
select title, length(short_explanation) as chars
from public.rules order by chars desc limit 3;
```
В начале: «The with rivers, seas, mountain ranges and plural countries» (337), «Routine places and transport…» (275), «A / an with jobs, per, and quantity words» (262).

**9.**
```sql
select rule_type, count(*) as n from public.rules group by rule_type order by n desc;
```
Сейчас: `language_rule` 22, `confusing_words` 15, `exception` 4.

**10.**
```sql
select slug from public.rules where slug like 'the-%' order by slug;
```
Результат: `the-geography`, `the-one-of-a-kind`. Если в `like` забыть знак `%`, не найдётся ничего: без него ищется точное совпадение.

**11.**
```sql
select round(avg(c), 1)
from (
  select count(*) as c
  from public.rule_exercises x join public.rules r on r.id = x.rule_id
  where r.category = 'english_grammar'
  group by r.id
) t;
```
Сейчас: 10.0. Читайте изнутри: сначала число упражнений на каждое правило, потом среднее по ним.

**12.**
```sql
select count(*) from public.rules where mnemonic is not null;
```
Сейчас: 41 (у всех правил есть запоминалка).

---

## Что дальше

1. Прочитайте `database/rules-schema.sql` целиком и объясните себе каждую строку, используя разделы 2 и 5.
2. Придумайте свои вопросы к данным и найдите ответ запросом: «какие правила про артикли имеют упражнений меньше
   10?», «сколько правил в каждом типе `rule_type`?».
3. Следующий шаг (по желанию): как приложение (TypeScript) обращается к этим таблицам через `supabase.from('rules')…` —
   то же самое `select`, записанное методами. Посмотрите `src/services/rulesService.ts`.
