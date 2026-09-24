-- Rules module schema. Run this once in the Supabase SQL Editor.
-- Every statement is additive: "create table if not exists", nothing is dropped,
-- and this file never touches auth.users or the existing learning_snapshots table.

-- 1. Catalogue tables (built-in rules are public; personal rules are private to their creator).
create table if not exists public.rules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  rule_type text not null check (rule_type in ('language_rule', 'exception', 'confusing_words', 'personal_note')),
  short_explanation text not null,
  tts_text text,
  mnemonic text,
  source text not null default 'personal' check (source in ('built-in', 'personal')),
  visibility text not null default 'private' check (visibility in ('public', 'private')),
  created_by uuid references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rule_examples (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references public.rules(id) on delete cascade,
  example_type text not null check (example_type in ('correct', 'incorrect', 'exception')),
  text text not null,
  correction text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.rule_word_links (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references public.rules(id) on delete cascade,
  word_id text not null, -- stable LibraryWord.wordId; words themselves are not stored in Supabase
  relation text not null default 'primary' check (relation in ('primary', 'related')),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.rule_exercises (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references public.rules(id) on delete cascade,
  exercise_type text not null check (exercise_type in ('spell', 'correct_word', 'multiple_choice', 'fill_gap', 'grammar')),
  prompt text not null,
  answer text not null,
  choices jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rule_relationships (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references public.rules(id) on delete cascade,
  related_rule_id uuid not null references public.rules(id) on delete cascade,
  relation_type text,
  created_at timestamptz not null default now(),
  check (rule_id <> related_rule_id)
);

-- 2. Personal, per-user data (mistakes, links, progress, practice, notes).
create table if not exists public.mistake_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text,
  task_id text,
  user_answer text,
  correct_answer text,
  error_type text,
  error_category text,
  category text not null default 'Unclassified',
  created_at timestamptz not null default now()
);

create table if not exists public.mistake_rule_links (
  id uuid primary key default gen_random_uuid(),
  mistake_event_id uuid not null references public.mistake_events(id) on delete cascade,
  rule_id uuid not null references public.rules(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.user_rule_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rule_id uuid not null references public.rules(id) on delete cascade,
  status text not null default 'new' check (status in ('new', 'learning', 'repeat_later', 'mastered', 'archived')),
  priority text not null default 'practice' check (priority in ('critical', 'practice', 'stable')),
  mistake_count integer not null default 0,
  correct_count integer not null default 0,
  correct_calendar_days text[] not null default '{}', -- distinct 'YYYY-MM-DD' days with a correct answer, for the 5-day mastered rule
  last_result_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, rule_id)
);

create table if not exists public.rule_practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rule_id uuid not null references public.rules(id) on delete cascade,
  exercise_id uuid references public.rule_exercises(id) on delete set null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_rule_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rule_id uuid not null references public.rules(id) on delete cascade,
  note text not null,
  updated_at timestamptz not null default now(),
  unique (user_id, rule_id)
);

-- 3. Helpful indexes (read patterns: by user, by rule, by word).
create index if not exists rule_examples_rule_id_idx on public.rule_examples(rule_id);
create index if not exists rule_word_links_rule_id_idx on public.rule_word_links(rule_id);
create index if not exists rule_word_links_word_id_idx on public.rule_word_links(word_id);
create index if not exists rule_exercises_rule_id_idx on public.rule_exercises(rule_id);
create index if not exists mistake_events_user_id_idx on public.mistake_events(user_id);
create index if not exists mistake_rule_links_user_id_idx on public.mistake_rule_links(user_id);
create index if not exists mistake_rule_links_rule_id_idx on public.mistake_rule_links(rule_id);
create index if not exists user_rule_progress_user_id_idx on public.user_rule_progress(user_id);
create index if not exists rule_practice_attempts_user_id_idx on public.rule_practice_attempts(user_id);

-- 4. Row level security.
alter table public.rules enable row level security;
alter table public.rule_examples enable row level security;
alter table public.rule_word_links enable row level security;
alter table public.rule_exercises enable row level security;
alter table public.rule_relationships enable row level security;
alter table public.mistake_events enable row level security;
alter table public.mistake_rule_links enable row level security;
alter table public.user_rule_progress enable row level security;
alter table public.rule_practice_attempts enable row level security;
alter table public.user_rule_notes enable row level security;

-- rules: anyone signed in can read public rules or their own private rules;
-- only the creator can write their own rules.
create policy "Read public or own rules" on public.rules
  for select using (visibility = 'public' or created_by = auth.uid());
create policy "Create own rules" on public.rules
  for insert with check (created_by = auth.uid());
create policy "Update own rules" on public.rules
  for update using (created_by = auth.uid());
create policy "Delete own rules" on public.rules
  for delete using (created_by = auth.uid());

-- rule_examples / rule_word_links / rule_exercises / rule_relationships:
-- readable when the parent rule is readable; writable when the parent rule belongs to the user.
create policy "Read examples of visible rules" on public.rule_examples
  for select using (exists (select 1 from public.rules r where r.id = rule_id and (r.visibility = 'public' or r.created_by = auth.uid())));
create policy "Write examples of own rules" on public.rule_examples
  for all using (exists (select 1 from public.rules r where r.id = rule_id and r.created_by = auth.uid()))
  with check (exists (select 1 from public.rules r where r.id = rule_id and r.created_by = auth.uid()));

create policy "Read word links of visible rules" on public.rule_word_links
  for select using (exists (select 1 from public.rules r where r.id = rule_id and (r.visibility = 'public' or r.created_by = auth.uid())));
create policy "Write word links of own rules" on public.rule_word_links
  for all using (exists (select 1 from public.rules r where r.id = rule_id and r.created_by = auth.uid()))
  with check (exists (select 1 from public.rules r where r.id = rule_id and r.created_by = auth.uid()));

create policy "Read exercises of visible rules" on public.rule_exercises
  for select using (exists (select 1 from public.rules r where r.id = rule_id and (r.visibility = 'public' or r.created_by = auth.uid())));
create policy "Write exercises of own rules" on public.rule_exercises
  for all using (exists (select 1 from public.rules r where r.id = rule_id and r.created_by = auth.uid()))
  with check (exists (select 1 from public.rules r where r.id = rule_id and r.created_by = auth.uid()));

create policy "Read relationships of visible rules" on public.rule_relationships
  for select using (exists (select 1 from public.rules r where r.id = rule_id and (r.visibility = 'public' or r.created_by = auth.uid())));
create policy "Write relationships of own rules" on public.rule_relationships
  for all using (exists (select 1 from public.rules r where r.id = rule_id and r.created_by = auth.uid()))
  with check (exists (select 1 from public.rules r where r.id = rule_id and r.created_by = auth.uid()));

-- Personal data: strictly one's own rows only.
create policy "Manage own mistake events" on public.mistake_events
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Manage own mistake rule links" on public.mistake_rule_links
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Manage own rule progress" on public.user_rule_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Manage own rule practice attempts" on public.rule_practice_attempts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Manage own rule notes" on public.user_rule_notes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
