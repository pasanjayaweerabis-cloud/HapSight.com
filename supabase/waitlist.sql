-- Hapsight waitlist table.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.waitlist (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null check (char_length(name) between 1 and 100),
  email           text not null check (char_length(email) between 3 and 254),
  role            text not null check (role in ('blind_or_vi', 'family_or_carer', 'organisation', 'other')),
  consent         boolean not null check (consent = true),
  consent_version text not null
);

-- One row per email address (the site stores emails in lower case).
create unique index if not exists waitlist_email_unique on public.waitlist (lower(email));

-- Row Level Security ON with NO policies: the public (anon) and signed-in (authenticated)
-- API roles can neither read nor write. Only the server, using the secret key, can insert.
alter table public.waitlist enable row level security;

-- Belt and braces: remove the default table grants from the public API roles.
revoke all on table public.waitlist from anon, authenticated;

-- The server's secret key acts as service_role. Newer Supabase projects do not grant it table
-- rights automatically, so allow it to add rows (insert only: the site never reads the list).
grant insert on table public.waitlist to service_role;

-- Tell the Data API about the new table straight away.
notify pgrst, 'reload schema';

-- Helper for the privacy promise "deleted no later than 12 months after sign-up".
-- Run it by hand, or schedule it with the pg_cron extension (see README).
create or replace function public.purge_old_waitlist_rows()
returns integer
language sql
security definer
set search_path = public
as $$
  with deleted as (
    delete from public.waitlist where created_at < now() - interval '12 months' returning 1
  )
  select count(*)::integer from deleted;
$$;
revoke all on function public.purge_old_waitlist_rows() from public, anon, authenticated;
