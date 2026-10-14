-- Feedback: learners tell us what is broken, what to improve or what is wrong in the content
-- (src/services/feedback.ts, the "Feedback" button in the menu).
-- Run once in the Supabase SQL Editor (project "SpellSprint"). Additive only: one table, one trigger function and
-- their policies. Nothing existing is read or changed. Safe to run more than once.
--
-- Rules:
--  - Only a signed-in learner can add a message, only as themselves and only with status 'new'. Nobody can read
--    other people's messages through the app; a learner sees only their own. You read all of them in the Supabase
--    dashboard (Table Editor -> feedback) or with the queries at the end (the SQL Editor uses the admin role).
--  - At most 10 messages per learner per day (a trigger), so a broken loop cannot fill the table.
--  - The checks below match the app exactly (src/services/feedback.ts): same kinds, 5-1000 characters.
--
-- HOW TO UNDO (deletes every message):
--   drop table if exists public.feedback; drop function if exists public.limit_feedback();

begin;

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null check (kind in ('bug', 'idea', 'content', 'other')),
  message text not null check (length(message) between 5 and 1000),
  page text not null check (length(page) <= 80),
  app_version text not null check (length(app_version) <= 40),
  user_agent text check (length(user_agent) <= 300),
  status text not null default 'new' check (status in ('new', 'seen', 'done', 'rejected')),
  created_at timestamptz not null default now()
);
create index if not exists feedback_user_id_idx on public.feedback (user_id);
create index if not exists feedback_status_created_idx on public.feedback (status, created_at desc);

alter table public.feedback enable row level security;
revoke all on public.feedback from anon;

drop policy if exists "Add own feedback" on public.feedback;
drop policy if exists "Read own feedback" on public.feedback;
create policy "Add own feedback" on public.feedback
  for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'new');
create policy "Read own feedback" on public.feedback
  for select to authenticated
  using (user_id = (select auth.uid()));

-- At most 10 messages per learner per day.
create or replace function public.limit_feedback()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.feedback where user_id = new.user_id and created_at > now() - interval '1 day') >= 10 then
    raise exception 'Too many feedback messages today.';
  end if;
  return new;
end;
$$;
-- The trigger runs the function itself; nobody should call it directly (see security-hardening-2.sql).
revoke execute on function public.limit_feedback() from public, anon, authenticated;

drop trigger if exists feedback_limit on public.feedback;
create trigger feedback_limit before insert on public.feedback
  for each row execute function public.limit_feedback();

commit;

-- Check: should list the two policies.
select policyname, cmd from pg_policies where schemaname = 'public' and tablename = 'feedback' order by policyname;

-- ---- For you, later (SQL Editor) ----------------------------------------------------------------
-- New messages, newest first:
--   select created_at, kind, page, app_version, message from public.feedback where status = 'new' order by created_at desc;
-- Count by kind:
--   select kind, count(*) from public.feedback group by kind order by 2 desc;
-- After you have dealt with a message:
--   update public.feedback set status = 'done' where id = '<id>';
