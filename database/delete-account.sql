-- Spell Sprint: lets a signed-in learner delete their own account (required by Google Play and the App Store).
-- Run once in the Supabase SQL Editor. Additive only: creates one function, nothing else changes.
--
-- What it does: deletes the caller's row in auth.users. Every table that has a user_id column references
-- auth.users with "on delete cascade", so the learner's snapshot, mistakes, reports and private rules go too.
-- It can only delete the caller (auth.uid()); anonymous visitors get an error.
-- To undo: drop function public.delete_my_account();  (accounts that were already deleted do not come back)

begin;

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'Not signed in.';
  end if;
  delete from auth.users where id = uid;
end;
$$;

-- Only signed-in learners may call it (functions are executable by PUBLIC by default).
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

commit;
