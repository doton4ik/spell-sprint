-- Automatic mistake classification: schema additions. Run this once in the Supabase SQL Editor,
-- AFTER rules-schema.sql. Every statement is additive and safe to re-run:
--   * "create table if not exists" / "create index if not exists"
--   * policies are created inside a block that ignores "already exists"
-- Nothing is dropped or altered, and existing tables (mistake_events, rules, ...) are not touched.

-- 1. Catalogue of error patterns: a short, fixed list — never one category per word.
--    tier 'technical' = what happened to the letters; tier 'learning' = which spelling pattern it is.
create table if not exists public.error_patterns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  tier text not null check (tier in ('technical', 'learning')),
  label text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. The tags found for one mistake (many tags per mistake, many mistakes per tag).
create table if not exists public.mistake_error_patterns (
  id uuid primary key default gen_random_uuid(),
  mistake_event_id uuid not null references public.mistake_events(id) on delete cascade,
  error_pattern_id uuid not null references public.error_patterns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  confidence real not null default 1.0, -- 1.0 = certain; weak guesses (e.g. 0.5) are stored but do not link a rule
  detail text, -- short human-readable note, e.g. 'cc→c; mm→m'
  created_at timestamptz not null default now(),
  unique (mistake_event_id, error_pattern_id)
);

-- 3. Which Rules teach which pattern. This table is the extensible mapping: add a row to connect a
--    pattern to a rule, no code change needed.
create table if not exists public.error_pattern_rule_links (
  id uuid primary key default gen_random_uuid(),
  error_pattern_id uuid not null references public.error_patterns(id) on delete cascade,
  rule_id uuid not null references public.rules(id) on delete cascade,
  weight real not null default 1.0,
  note text,
  created_at timestamptz not null default now(),
  unique (error_pattern_id, rule_id)
);

create index if not exists mistake_error_patterns_user_id_idx on public.mistake_error_patterns(user_id);
create index if not exists mistake_error_patterns_mistake_id_idx on public.mistake_error_patterns(mistake_event_id);
create index if not exists mistake_error_patterns_pattern_id_idx on public.mistake_error_patterns(error_pattern_id);
create index if not exists error_pattern_rule_links_pattern_id_idx on public.error_pattern_rule_links(error_pattern_id);
create index if not exists error_pattern_rule_links_rule_id_idx on public.error_pattern_rule_links(rule_id);

-- 4. Row level security.
alter table public.error_patterns enable row level security;
alter table public.mistake_error_patterns enable row level security;
alter table public.error_pattern_rule_links enable row level security;

-- error_patterns and error_pattern_rule_links are shared reference data: everyone may read them,
-- and there is deliberately NO insert/update/delete policy, so the app cannot change them —
-- only you, from the SQL Editor / Table Editor.
do $$ begin
  create policy "Anyone can read error patterns" on public.error_patterns for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Anyone can read pattern-rule links" on public.error_pattern_rule_links for select using (true);
exception when duplicate_object then null; end $$;

-- Personal data: strictly one's own rows, and a row may only point at one's own mistake event.
do $$ begin
  create policy "Manage own mistake error patterns" on public.mistake_error_patterns
    for all
    using (user_id = auth.uid())
    with check (
      user_id = auth.uid()
      and exists (select 1 from public.mistake_events e where e.id = mistake_event_id and e.user_id = auth.uid())
    );
exception when duplicate_object then null; end $$;
