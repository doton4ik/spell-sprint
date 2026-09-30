-- Multi-user safety: learners may create and edit only PRIVATE rules.
-- Before this, "Create own rules" / "Update own rules" did not check visibility, so any signed-in
-- user could publish a rule (or flip their own rule to public) that every other learner would see.
-- Built-in rules are not affected: they are managed from the SQL Editor, which bypasses RLS.
--
-- Safe to run: it only replaces two policies, no data is read or changed.
-- Rollback (the previous definitions, from rules-schema.sql):
--   drop policy if exists "Create own private rules" on public.rules;
--   drop policy if exists "Update own private rules" on public.rules;
--   create policy "Create own rules" on public.rules for insert with check (created_by = auth.uid());
--   create policy "Update own rules" on public.rules for update using (created_by = auth.uid());

begin;

drop policy if exists "Create own rules" on public.rules;
drop policy if exists "Update own rules" on public.rules;
-- The new names too, so running this file a second time is harmless.
drop policy if exists "Create own private rules" on public.rules;
drop policy if exists "Update own private rules" on public.rules;

create policy "Create own private rules" on public.rules
  for insert with check (created_by = auth.uid() and visibility = 'private');

create policy "Update own private rules" on public.rules
  for update using (created_by = auth.uid())
  with check (created_by = auth.uid() and visibility = 'private');

commit;

-- Check: should list the two new policies.
select policyname, cmd, with_check from pg_policies where schemaname = 'public' and tablename = 'rules' order by policyname;
