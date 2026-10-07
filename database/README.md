# Database (Supabase)

All SQL is run by hand in the Supabase SQL Editor (project **SpellSprint**). Every file is written to be
safe to run again (`if not exists`, `on conflict do nothing`) and never deletes data.

Status checked against the live database on 7 October 2026 (read-only queries).

## Order and status

| # | File | What it does | Status |
|---|------|--------------|--------|
| 1 | `supabase-schema.sql` | `learning_snapshots` — the cloud backup of each learner's progress | ✅ applied |
| 2 | `rules-schema.sql` | Rules module: rules, examples, exercises, word links, mistakes, progress, notes + RLS | ✅ applied |
| 3 | `rules-seed.sql` | First built-in rules with examples and word links | ✅ applied |
| 4 | `rules-seed-exercises.sql` | Exercises for the first rules | ✅ applied |
| 5 | `error-classification-schema.sql` | Error patterns and links from mistakes to patterns + RLS | ✅ applied |
| 6 | `error-classification-seed.sql` | Error patterns (35) and their rules | ✅ applied |
| 7 | `rules-seed-challenge.sql` | 15 rules and the "challenge-v1" exercise set | ✅ applied |
| 8 | `content-pack-2.sql` *or* `content-pack-2-part1…4.sql` | More rules, examples, exercises, word links (the parts are the same pack split in four for the editor's size limit) | ✅ applied |
| 9 | `rules-private-only.sql` | Learners may only create **private** rules (nobody can publish to everyone) | ✅ applied |
| 10 | `word-reports.sql` | `word_reports` — learners report strange words | ✅ applied |
| 11 | `security-hardening.sql` | No writes for signed-out visitors, size limits, stricter mistake links, report limit | ✅ applied |
| 12 | `client-errors.sql` | `client_errors` — errors from learners' devices (src/services/errorLog.ts) | ⏳ **not yet** |

`rules-import/` holds CSV exports of the rules tables (reference only, not run).

## Adding a change

1. Create a new file with the next number in the name, e.g. `13-something.sql`, and describe at the top
   what it does, that it keeps data, and how to undo it.
2. Wrap it in `begin; … commit;` so a failure changes nothing.
3. Run it in the SQL Editor, then add a row to the table above.
4. If tables or columns changed, regenerate `src/types/database.ts`
   (`npx supabase gen types typescript --project-id <id>`) so the app's types match.

## Rules of thumb

- Every table with user data has RLS with `user_id = auth.uid()`; public reference tables are read-only.
- Never use the `service_role` key in the app. The app only has the public anon key.
- Check after a change: Supabase → Advisors → Security should show no errors.
