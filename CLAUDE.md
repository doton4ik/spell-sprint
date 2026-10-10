# Spell Sprint — working rules

English-spelling trainer for Russian-speaking learners. React 19, Vite 8, TypeScript 7 (tsgo), Supabase,
pnpm 11. Hash routing; data is local-first in localStorage with a cloud snapshot (`src/services/cloudSync.ts`).
Deployed on Netlify from GitHub `doton4ik/spell-sprint`, branch `main`.

## Talking to the user

- The user is a student and writes in Russian. Answer in Russian; keep code, commands and file names in English.
- Write content yourself (words, examples, texts); don't hand it off to another assistant.
- Before a big or unclear task, say the plan in a few lines; for "делай" just do it.

## Three models: Sonnet builds, Haiku explores, Opus reviews

This project runs with Sonnet as the main model, Opus as the advisor and Haiku for subagents
(`.claude/settings.json`). Use them like this:

- **Explore with Haiku, in parallel.** Before changing code you don't know yet, send 1–3 subagents (Explore or
  general-purpose) to find the files, read docs and report back — e.g. one maps the code involved, one finds the
  tests and checks, one looks for similar existing code. Give each a self-contained prompt and ask for a short
  report with file:line. Keep exploration out of the main context; read only the files you will edit.
- **Build with Sonnet.** You write the code, run the checks and commit.
- **Review with Opus (advisor).** Call the advisor: before committing to a plan on any non-trivial task; when the
  same error comes back twice or the approach isn't converging; and before saying a multi-step task is done
  (after the work is committed). Skip it for one-line fixes and plain questions.
- Subagents are weaker (Haiku): don't let them decide or edit; verify anything important they report. For a
  serious audit the user may ask for subagents on sonnet or opus — pass `model` to the Agent tool then.

## Commits and pushes

- You commit (clear message, what changed and why). The user runs `git push` — never push yourself.
- Netlify build minutes are limited: batch work into few pushes. Changes outside the site
  (research/, database/, scripts/, docs) don't trigger a build (`ignore` rule in `netlify.toml`).
- Before saying "done": `pnpm check` must pass; for UI or flow changes also `pnpm test:e2e`
  (builds, then Playwright on desktop and phone). If something fails, say so and fix it.

## Safety (always)

- Never delete or overwrite without explicit confirmation: the project folder, `src`, `public`, `package.json`,
  `pnpm-lock.yaml`, `vite.config.ts`, `index.html`, `.env*`, SQL files, Supabase config, `.git`.
  Show the exact command first.
- Never show, print or send keys, tokens, passwords or the contents of `.env` / `.env.local` (only variable names).
  Never use the Supabase `service_role` key in the app.
- Database: no schema, RLS, migration or data changes from here. Write a SQL file in `database/` (with
  `begin; … commit;`, what it does, how to undo) and let the user run it in the SQL Editor. Supabase MCP only
  for read-only `select`, advisors and type generation. Never touch `auth.users`. The project is the one named
  "SpellSprint". See `database/README.md` for which files have been run.
- `sources/` is read-only (synced from another tool). `AGENTS.md` is synced too — don't edit it.
- Don't copy `node_modules`.

## Code map

- `src/pages/*Page.tsx` — pages, lazy-loaded in `App.tsx` (prefetched when idle).
- `src/services/` — logic: `reviewSchedule.ts` (spaced repetition: good days 1/3/7/14/30, due-date rules),
  `learningData.ts` (My Mistakes entries, history, archive), `practiceStorage.ts` (answer log, max 5000),
  `cloudSync.ts` (pull → merge → save over the merged version), `libraryPractice.ts` (tasks per mode),
  `proofreadingEngine.ts`, `pairs.ts`, `yellowCards.ts`, `rulesService.ts` (falls back to `data/builtInRules.json`).
- `src/data/` — content: `spell-sprint-built-in-library.csv` (966 words), `proofreadingTexts.ts`,
  `pairDrills.ts`, `wordAliases.ts` (one id for a word in two libraries), `libraryTaxonomy.ts` (topic merges).
- Styles: colours only from `src/styles/tokens.css` (light + dark theme); shared buttons in `styles/buttons.css`.
  Every font size is `calc(Npx * var(--fs))`.
- Content checks: `scripts/check-*.mjs` (part of `pnpm check`).

## Gotchas

- Windows + Git Bash: heredocs with quotes/backslashes break node scripts — write scripts to a file with the
  Write tool, then run them.
- `String.replace` treats `$&`, `$'` in the replacement as patterns — careful when generating code.
- If the dev server serves a stale module ("X is not defined" while the file is fine), restart it.
- Prettier runs in `pnpm check` (`format:check`); run `pnpm exec prettier --write <files>` after edits.
- Browser checks on the dev server: back up localStorage first and restore it afterwards.
- Typed sentences are compared through `src/services/contractions.ts` (`sameText`): "It's" = "It is", "9" = "nine", case and punctuation do not matter, "its" ≠ "it's". Show sentence differences word by word (`sentenceDiff.ts`), single words letter by letter. For every new answer check, list the equivalent writings and add tests (the user tests such cases on purpose).
