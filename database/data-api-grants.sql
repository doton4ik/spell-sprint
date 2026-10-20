-- Data API grants for every table of the app (Supabase, project "SpellSprint").
--
-- Why: from 30 October 2026 Supabase no longer grants Data API access (supabase-js, PostgREST, GraphQL) to NEW tables in the
-- "public" schema on its own. A table needs an explicit GRANT, or the API answers "permission denied". The tables that exist
-- today keep the grants they have, so running this file on the live database changes nothing: it writes down what is already
-- there. It matters when the database is built again from these files (a new project, a preview branch, `supabase db reset`).
--
-- Who may do what (the row level security policies in rules-schema.sql and the other files still decide WHICH rows):
--   signed-in learners (role authenticated): select, insert, update, delete on every table;
--   signed-out visitors (role anon): select only, and only on the public reference tables (rules and what belongs to them).
-- security-hardening.sql removes writes for anon and reads of personal tables; this file never grants them.
--
-- Safe to run more than once. To undo one grant, use `revoke ... from <role>` for that table.
-- A NEW table needs its own lines here (or in its own file): see "Adding a change" in README.md.

begin;

-- Personal and private tables: signed-in learners only.
grant select, insert, update, delete on
  public.learning_snapshots,
  public.mistake_events,
  public.mistake_rule_links,
  public.mistake_error_patterns,
  public.user_rule_notes,
  public.user_rule_progress,
  public.rule_practice_attempts,
  public.word_reports,
  public.client_errors,
  public.feedback
to authenticated;

-- Public reference tables: everyone may read, signed-in learners may also write (the policies allow only their own private rules).
grant select on
  public.rules,
  public.rule_examples,
  public.rule_exercises,
  public.rule_relationships,
  public.rule_word_links,
  public.error_patterns,
  public.error_pattern_rule_links
to anon;

grant select, insert, update, delete on
  public.rules,
  public.rule_examples,
  public.rule_exercises,
  public.rule_relationships,
  public.rule_word_links,
  public.error_patterns,
  public.error_pattern_rule_links
to authenticated;

commit;
