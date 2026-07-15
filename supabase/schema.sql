-- REVORA owner console — run this in the Supabase SQL editor.
-- STEP 1: replace both occurrences of OWNER_EMAIL_HERE with your owner email (lowercase).

create table if not exists public.demo_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  venue      text,
  email      text not null,
  message    text,
  plan       text,
  status     text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.demo_requests enable row level security;

-- anyone on the site may submit a demo request
drop policy if exists "public can submit" on public.demo_requests;
create policy "public can submit"
  on public.demo_requests for insert
  to anon, authenticated
  with check (true);

-- only the owner may read the requests
drop policy if exists "owner reads" on public.demo_requests;
create policy "owner reads"
  on public.demo_requests for select
  to authenticated
  using (lower(auth.jwt() ->> 'email') = 'OWNER_EMAIL_HERE');

-- only the owner may update status
drop policy if exists "owner updates" on public.demo_requests;
create policy "owner updates"
  on public.demo_requests for update
  to authenticated
  using (lower(auth.jwt() ->> 'email') = 'OWNER_EMAIL_HERE');

-- let the dashboard receive new requests in realtime
alter publication supabase_realtime add table public.demo_requests;
