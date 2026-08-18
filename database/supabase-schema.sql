-- Run this in the Supabase SQL Editor before enabling cloud synchronisation.
create table if not exists public.learning_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learning_snapshots enable row level security;

create policy "Users can read their own learning snapshot"
  on public.learning_snapshots for select using (auth.uid() = user_id);

create policy "Users can create their own learning snapshot"
  on public.learning_snapshots for insert with check (auth.uid() = user_id);

create policy "Users can update their own learning snapshot"
  on public.learning_snapshots for update using (auth.uid() = user_id);
