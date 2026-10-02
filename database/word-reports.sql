-- Word reports: learners flag built-in words that are strange, not worth learning or wrong.
-- The app sends one row per learner and word (a second report of the same word updates it).
-- Learners can add and see only their own reports; you read all of them in the SQL Editor
-- (it bypasses RLS) with the queries at the end of this file.
--
-- Safe to run: it only creates a new table and its policies. Nothing existing is read or changed.
-- Running it twice is harmless.
-- Rollback (deletes all reports):  drop table if exists public.word_reports;

begin;

create table if not exists public.word_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  word_id text not null check (length(word_id) between 1 and 200),
  word text not null check (length(word) between 1 and 120),
  translation text check (length(translation) <= 300),
  library text check (length(library) <= 120),
  reason text not null check (reason in ('strange', 'not-useful', 'too-specialised', 'wrong-translation', 'wrong-spelling', 'other')),
  comment text check (length(comment) <= 500),
  status text not null default 'new' check (status in ('new', 'fixed', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, word_id)
);

alter table public.word_reports enable row level security;

drop policy if exists "Add own word reports" on public.word_reports;
drop policy if exists "Change own new word reports" on public.word_reports;
drop policy if exists "Read own word reports" on public.word_reports;

-- A learner may only report as themselves, and cannot mark a report as fixed / rejected.
create policy "Add own word reports" on public.word_reports
  for insert with check (user_id = auth.uid() and status = 'new');
create policy "Change own new word reports" on public.word_reports
  for update using (user_id = auth.uid() and status = 'new')
  with check (user_id = auth.uid() and status = 'new');
create policy "Read own word reports" on public.word_reports
  for select using (user_id = auth.uid());

commit;

-- Check: should list the three policies.
select policyname, cmd from pg_policies where schemaname = 'public' and tablename = 'word_reports' order by policyname;

-- ---- For you, later (SQL Editor) ----------------------------------------------------------------
-- Most reported words:
--   select word, translation, library, count(*) as reports,
--          string_agg(distinct reason, ', ') as reasons, string_agg(comment, ' | ') as comments
--   from public.word_reports where status = 'new'
--   group by word, translation, library order by reports desc;
-- After fixing or removing a word in the CSV:
--   update public.word_reports set status = 'fixed', updated_at = now() where word = 'household chore';
