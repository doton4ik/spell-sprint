-- Reports inbox: everything learners sent, in ONE list. Read-only (only select), changes nothing.
-- Use it in the Supabase SQL Editor (project "SpellSprint"): paste, Run, then "Save" it as a snippet to reuse.
-- It needs database/feedback.sql to have been run (the first part reads the feedback table).
--
-- The three sources:
--   feedback      messages from the "Feedback" button (kind: bug / idea / content / other)
--   word report   a learner flags a library word (reason + comment)
--   error         technical errors from devices, grouped; only real builds of the last 14 days, not the dev server
--
-- Why a saved query and not a database view: a view in the public schema would be reachable from the internet
-- through the API. A query in the editor is only visible to you.

-- 1. INBOX: what is new, newest first -------------------------------------------------------------------------
select * from (
  select f.created_at, 'feedback' as source, f.kind as detail, f.page as place, f.message as text,
         f.id::text as ref, left(f.user_id::text, 8) as who
  from public.feedback f
  where f.status = 'new'

  union all

  select r.created_at, 'word report', r.reason, coalesce(r.library, '-'),
         r.word || coalesce(' = ' || r.translation, '') || coalesce('  | ' || r.comment, ''),
         r.id::text, left(r.user_id::text, 8)
  from public.word_reports r
  where r.status = 'new'

  union all

  select max(e.created_at), 'error', e.page || '  v' || e.app_version,
         count(*) || ' times, ' || count(distinct e.user_id) || ' users',
         e.message, '-', '-'
  from public.client_errors e
  where e.app_version <> 'dev' and e.created_at > now() - interval '14 days'
  group by e.message, e.page, e.app_version
) inbox
order by created_at desc;

-- 2. COUNTS: how much is waiting ------------------------------------------------------------------------------
select 'feedback (new)' as what, count(*) as n from public.feedback where status = 'new'
union all select 'word reports (new)', count(*) from public.word_reports where status = 'new'
union all select 'errors, last 14 days (real builds)', count(*) from public.client_errors
  where app_version <> 'dev' and created_at > now() - interval '14 days';

-- 3. AFTER YOU HAVE DEALT WITH SOMETHING (run one line at a time; change the id or the word) ---------------------
--   update public.feedback set status = 'done' where id = '<ref from the inbox>';        -- or 'seen' / 'rejected'
--   update public.word_reports set status = 'fixed', updated_at = now() where id = '<ref from the inbox>';
--   -- every report of one word at once:
--   update public.word_reports set status = 'fixed', updated_at = now() where word = 'household chore' and status = 'new';

-- 4. TIDYING (optional; deletes rows, so look first) ----------------------------------------------------------
--   -- errors that came from the developer's own machine (version 'dev'):
--   select count(*) from public.client_errors where app_version = 'dev';
--   delete from public.client_errors where app_version = 'dev';
