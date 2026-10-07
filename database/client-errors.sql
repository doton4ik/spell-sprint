-- Spell Sprint: a log of errors that happen on learners' devices (src/services/errorLog.ts).
-- Run once in the Supabase SQL Editor. Additive only: creates one table, nothing else changes.
--
-- What is stored: the error message and stack (e-mails and tokens masked on the device), the page
-- name, the app version (Netlify commit) and the browser. No answers, no words, no addresses.
-- Learners can only add their own rows; nobody can read them through the app. You read them in the
-- Supabase dashboard (Table Editor → client_errors), which uses the admin role.

begin;

create table if not exists public.client_errors (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null check (length(message) between 1 and 500),
  stack text check (length(stack) <= 4000),
  page text not null check (length(page) <= 80),
  app_version text not null check (length(app_version) <= 40),
  user_agent text check (length(user_agent) <= 300),
  created_at timestamptz not null default now()
);
create index if not exists client_errors_created_at_idx on public.client_errors (created_at desc);
create index if not exists client_errors_user_id_idx on public.client_errors (user_id);

alter table public.client_errors enable row level security;
revoke all on public.client_errors from anon;

drop policy if exists "Add own error reports" on public.client_errors;
create policy "Add own error reports" on public.client_errors
  for insert to authenticated with check (user_id = (select auth.uid()));

-- At most 50 reports per learner per day: a broken loop cannot fill the table.
create or replace function public.limit_client_errors()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.client_errors where user_id = new.user_id and created_at > now() - interval '1 day') >= 50 then
    raise exception 'Too many error reports today.';
  end if;
  return new;
end;
$$;
drop trigger if exists client_errors_limit on public.client_errors;
create trigger client_errors_limit before insert on public.client_errors
  for each row execute function public.limit_client_errors();

commit;

-- Read the newest errors (in the SQL Editor):
--   select created_at, page, app_version, message from public.client_errors order by created_at desc limit 50;
-- Most frequent errors this week:
--   select message, count(*) from public.client_errors where created_at > now() - interval '7 days' group by message order by 2 desc;
-- Rollback:
--   drop table if exists public.client_errors; drop function if exists public.limit_client_errors();
