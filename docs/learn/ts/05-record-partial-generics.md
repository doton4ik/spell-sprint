# Урок 5. `Record`, `Partial`, `as` и дженерики

Цель: читать «шаблонные» типы, которые часто встречаются в проекте, и понимать, зачем в угловых скобках стоят типы.

## 5.1 `Record`: словарь с известными ключами

`Record<Ключи, Значение>` описывает объект, у которого **для каждого ключа есть значение одного и того же типа**.
Откройте `src/data/levelCheckBank.ts`:

```ts
export type Skill = 'spelling' | 'vocabulary' | 'grammar' | 'reading' | 'listening'

export const skillLabels: Record<Skill, string> = {
  spelling: 'Spelling',
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  reading: 'Reading',
  listening: 'Listening',
}
```

Читаем: «для каждого навыка (из пяти) есть строка с названием». Если завтра добавить навык `'writing'` в `Skill`,
но забыть добавить его название в `skillLabels`, TypeScript выдаст ошибку «property 'writing' is missing». Вы не
сможете забыть.

Когда ключи заранее неизвестны, пишут `Record<string, …>`:

```ts
export const PATTERN_RULE_SLUGS: Record<string, string[]> = {
  'grammar:article': ['a-or-an', 'a-or-the', 'the-one-of-a-kind'],
  ...
}
```

Ключ любая строка, значение список строк. Это словарь «какие правила объясняют какую ошибку».

Тот же `Record` используется в `KIND_PLAN: Record<Skill, ItemKind[]>` (`levelCheck.ts`): для каждого навыка список типов
вопросов по порядку.

## 5.2 `Partial`: «все поля необязательные»

`Partial<T>` берёт тип `T` и делает все его поля необязательными. В `levelCheck.ts`:

```ts
export type LevelCheckResult = {
  id: string
  completedAt: string
  // Older checks have only spelling, vocabulary and grammar; a skill that was not measured is missing.
  skills: Partial<Record<Skill, SkillResult>>
  overall: { ability: number; level: string; range?: string }
  answers: CheckAnswer[]
}
```

`Record<Skill, SkillResult>` значило бы «результат есть для **всех пяти** навыков». А `Partial<…>` разрешает любому
навыку отсутствовать. Это нужно потому, что старые проверки уровня (когда было три навыка) лежат у людей в
`localStorage`. Приложение читает их и не падает: для чтения результата по навыку используют `?.` (урок 4).

Вложенность читается изнутри наружу: `Record<Skill, SkillResult>` → «для каждого навыка результат» → `Partial` →
«но не обязательно для каждого».

## 5.3 `Pick` и `Omit`: взять или убрать поля

В `src/services/sprint.ts`:

```ts
const sprintCorrect = (typed: string, word: Pick<LibraryWord, 'word' | 'alternatives'>) => …
```

`Pick<LibraryWord, 'word' | 'alternatives'>` — «тип, в котором только эти два поля слова». У `LibraryWord` их около
двадцати, но функции нужны лишь два, и в таком виде её легко вызвать с любым объектом, где эти поля есть. Так тип
честно показывает, что функции действительно нужно.

`Omit<T, 'поле'>` — наоборот, «всё, кроме».

## 5.4 Приведение `as`

Иногда программист знает про значение больше, чем TypeScript. Тогда пишут `as Тип`. В `rulesService.ts`:

```ts
function toRule(row: Record<string, unknown>): Rule {
  return {
    id: row.id as string,
    slug: row.slug as string,
    ruleType: row.rule_type as Rule['ruleType'],
    isActive: Boolean(row.is_active),
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    ...
  }
}
```

База данных возвращает строку как «набор неизвестных значений» (`unknown`). Код **заверяет** TypeScript: «поле `id`
это строка». Если в базе окажется иное, TypeScript об этом не узнает, потому что `as` проверки не делает.
Поэтому `as` — сознательный риск. Правила:

- Используйте `as` на границе (данные из базы, `JSON.parse`), где типов у вас нет, и в одном месте — как тут, в
  `toRule`. Остальной код получает уже готовый `Rule`.
- Не используйте `as` «чтобы заставить замолчать ошибку»: ошибка обычно говорит о настоящей проблеме.

Функция называется `toRule`, она **переводит** строку базы (поля `snake_case`) в тип приложения (поля `camelCase`).
Это очень распространённая задача: на границе одного мира с другим пишут преобразователь, а внутри остаются свои типы.

## 5.5 `unknown` против `any`

- `unknown` — «неизвестно что»: перед использованием нужно проверить (урок 4). Безопасно.
- `any` — «что угодно, не проверяй». Отключает защиту TypeScript. В проекте `any` избегают.

Всегда выбирайте `unknown`, если сомневаетесь.

## 5.6 Дженерики: тип как параметр

Угловые скобки `<…>` вы видели: `Array<string>`, `Map<string, number>`, `Record<Skill, string>`, `Promise<Rule[]>`.
Это **дженерики**: тип, у которого есть своя «дырка», заполняемая другим типом.

Напишем свой. Функция «первый элемент списка»:

```ts
function first<T>(items: T[]): T | undefined {
  return items[0]
}

first([1, 2, 3])        // тип результата: number | undefined
first(['a', 'b'])       // тип результата: string | undefined
```

`T` — условное имя типа-«заготовки». TypeScript сам подставляет нужный: для списка чисел `T` — это `number`, для
списка строк — `string`. Благодаря этому одна функция работает с любыми списками, не теряя точности типов (вы не
получите «что угодно» на выходе).

Где это в проекте:

- `Promise<Rule[]>` — обещание вернуть список правил (подробнее в уроке 8): `async function getVisibleRules():
  Promise<Rule[]>`.
- `useState<number | 'all'>(10)` в `PracticePage.tsx` — состояние компонента, которое либо число, либо слово `'all'`
  (урок 7).
- `new Map<string, { total: number; count: number }>()` (урок 3).

## Попробуйте сами

1. Опишите `type Level = 'A2' | 'B1'` и `const names: Record<Level, string> = …`. Попробуйте оставить только один ключ
   и прочитайте ошибку.
2. Превратите `names` в `Partial<Record<Level, string>>`. Поменялась ли ошибка? Что нужно сделать при чтении
   `names.A2.length`?
3. Напишите функцию `last<T>(items: T[]): T | undefined`, возвращающую последний элемент.
4. Придумайте `type Word = { text: string; translation: string; level: Level; example?: string }` и функцию,
   принимающую только `Pick<Word, 'text' | 'translation'>`. Вызовите её с полным `Word` — работает ли?

## Вопросы на понимание

1. Что значит `Record<Skill, string>` и как он защищает от забытого названия навыка?
2. Почему в `LevelCheckResult` написано `Partial<Record<Skill, SkillResult>>`, а не просто `Record<…>`?
3. Что делает `Pick<LibraryWord, 'word' | 'alternatives'>` и зачем это функции `sprintCorrect`?
4. Что такое `as` и почему в `toRule` его использование оправдано, а где-то в середине логики было бы опасным?
5. В чём разница между `unknown` и `any`? Что вы будете использовать, если не знаете тип данных?
6. Что означает буква `T` в `function first<T>(items: T[])`? Какой тип будет у `first(['a', 'b'])`?
7. Зачем `toRule` превращает `rule_type` в `ruleType`? Где ещё в проекте так «переводят» данные между мирами?

<details>
<summary>Ответы (откройте после своих)</summary>

1. «Для каждого навыка из `Skill` есть значение строкового типа». Если в `Skill` добавят навык, а в `skillLabels` его
   название забудут, сборка остановится с ошибкой «property is missing».
2. Потому что в хранилище лежат старые результаты, где измерены только три навыка. С `Partial` отсутствие навыка
   разрешено, и тип честно отражает реальность. Поэтому при чтении используют `?.` и `??`.
3. «Только поля `word` и `alternatives` слова». Функции больше ничего не нужно, и её можно вызвать с любым объектом,
   где есть эти поля (например с объектом слова из другого источника).
4. `as` заверяет TypeScript, что значение именно такого типа, и проверки не делает. В `toRule` это единственное место,
   где данные из базы превращаются в `Rule`, после этого остальной код опирается на `Rule`. Если разбросать `as` по
   логике, ошибки будут прятаться и проявляться уже у ученика.
5. `unknown` требует проверки перед использованием (безопасно), `any` отключает проверки (опасно). Когда тип неизвестен,
   берут `unknown`.
6. `T` — «параметр типа»: что передадут, то и подставится. Для `['a', 'b']` это `string`, поэтому результат имеет тип
   `string | undefined`.
7. Потому что в базе принято `snake_case`, а в JavaScript `camelCase`. Преобразователь стоит на границе, а внутри
   приложения все пользуются одним видом. Аналогично данные в localStorage читаются с проверкой, а страница получает
   готовые типы.

</details>
