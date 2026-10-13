-- Security hardening, part 2: closes the last Supabase security warnings about a function.
-- Run once in the Supabase SQL Editor (project "SpellSprint"). Changes no data and no table.
--
-- What it does: public.limit_client_errors() is a TRIGGER function (it limits error reports to 50 per learner per
-- day, see client-errors.sql). It was also callable from outside as /rest/v1/rpc/limit_client_errors by signed-out
-- and signed-in visitors (the advisor warnings "anon/authenticated can execute a SECURITY DEFINER function").
-- Nobody should call it directly. A trigger runs the function itself, without checking who has EXECUTE, so the
-- limit keeps working; only the direct call is closed. Safe to run more than once.
--
-- HOW TO UNDO:
--   grant execute on function public.limit_client_errors() to anon, authenticated;
--
-- Check afterwards (read-only): Supabase -> Advisors -> Security: the two "SECURITY DEFINER function" warnings are gone.

begin;

revoke execute on function public.limit_client_errors() from public, anon, authenticated;

commit;
