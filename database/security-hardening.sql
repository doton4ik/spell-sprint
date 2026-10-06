-- Spell Sprint: security hardening (October 2026). Run once in the Supabase SQL Editor.
--
-- Everything here is additive and keeps all data: no table, row or column is dropped.
-- Checked before writing (read-only): all current rows already fit the new limits
-- (longest text in mistake_events is 76 characters, largest learning backup is about 113 KB),
-- and no mistake_rule_links row points to another user's mistake.
-- The whole script runs in one transaction: if any line fails, nothing changes.
-- A rollback script is at the bottom (commented out).

begin;

-- 1. Signed-out visitors (role anon) can no longer write anywhere, and cannot even try to read
--    private tables. RLS already blocked this; removing the grants is a second lock on the door.
--    Public reference tables (rules, examples, exercises, error patterns) stay readable when signed out.
revoke insert, update, delete on all tables in schema public from anon;
revoke select on public.learning_snapshots, public.mistake_events, public.mistake_rule_links,
  public.mistake_error_patterns, public.user_rule_progress, public.rule_practice_attempts,
  public.user_rule_notes, public.word_reports from anon;

-- 2. A mistake can only be linked to a rule through the user's own mistake event.
drop policy if exists "Manage own mistake rule links" on public.mistake_rule_links;
create policy "Manage own mistake rule links" on public.mistake_rule_links
  for all to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.mistake_events e where e.id = mistake_event_id and e.user_id = auth.uid())
  );

-- 3. Size limits, so nobody can fill the database with huge rows.
alter table public.learning_snapshots
  add constraint learning_snapshots_payload_size check (octet_length(payload::text) <= 5000000);
alter table public.mistake_events
  add constraint mistake_events_text_sizes check (
    coalesce(length(word_id), 0) <= 200 and coalesce(length(task_id), 0) <= 300
    and coalesce(length(user_answer), 0) <= 500 and coalesce(length(correct_answer), 0) <= 500
    and coalesce(length(error_type), 0) <= 100 and coalesce(length(error_category), 0) <= 200
    and length(category) <= 100
  );
alter table public.user_rule_notes
  add constraint user_rule_notes_note_size check (length(note) <= 2000);

-- 4. At most 500 word reports per learner (each word once already; this stops scripted spam).
create or replace function public.limit_word_reports()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select count(*) from public.word_reports where user_id = new.user_id) >= 500 then
    raise exception 'Too many word reports for one account.';
  end if;
  return new;
end;
$$;
drop trigger if exists word_reports_limit on public.word_reports;
create trigger word_reports_limit before insert on public.word_reports
  for each row execute function public.limit_word_reports();

commit;

-- Check after running: should list the new policy, the three constraints and the trigger.
--   select policyname, with_check from pg_policies where tablename = 'mistake_rule_links';
--   select conname from pg_constraint where conname in ('learning_snapshots_payload_size', 'mistake_events_text_sizes', 'user_rule_notes_note_size');
--   select tgname from pg_trigger where tgname = 'word_reports_limit';

-- ── Rollback (only if something stops working; run these lines instead) ──────────────────
-- begin;
-- grant insert, update, delete on all tables in schema public to anon;
-- grant select on public.learning_snapshots, public.mistake_events, public.mistake_rule_links,
--   public.mistake_error_patterns, public.user_rule_progress, public.rule_practice_attempts,
--   public.user_rule_notes, public.word_reports to anon;
-- drop policy if exists "Manage own mistake rule links" on public.mistake_rule_links;
-- create policy "Manage own mistake rule links" on public.mistake_rule_links
--   for all using (user_id = auth.uid()) with check (user_id = auth.uid());
-- alter table public.learning_snapshots drop constraint if exists learning_snapshots_payload_size;
-- alter table public.mistake_events drop constraint if exists mistake_events_text_sizes;
-- alter table public.user_rule_notes drop constraint if exists user_rule_notes_note_size;
-- drop trigger if exists word_reports_limit on public.word_reports;
-- drop function if exists public.limit_word_reports();
-- commit;
