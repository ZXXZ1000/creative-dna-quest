-- Supabase schema for Creative DNA analytics (minimal viable)

create table if not exists public.events (
  id bigserial primary key,
  event_id uuid not null unique,
  session_id uuid not null,
  name text not null,
  ts timestamptz not null,
  url text,
  referrer text,
  user_agent text,
  language text,
  timezone text,
  viewport jsonb,
  utm jsonb,
  props jsonb,
  received_at timestamptz not null default now()
);

-- Recommended index
create index if not exists idx_events_session on public.events (session_id);
create index if not exists idx_events_name_ts on public.events (name, ts desc);

-- Enable RLS, allow anonymous inserts only
alter table public.events enable row level security;

drop policy if exists "allow_insert_anon" on public.events;
create policy "allow_insert_anon" on public.events
  for insert
  to anon
  with check (true);

-- Optional: deny select to anon (keep analytics private)
revoke all on public.events from anon;
grant insert on public.events to anon;

-- Optionally create a view for export (flatten common fields)
create or replace view public.v_events_flat as
  select
    id,
    event_id,
    session_id,
    name,
    ts,
    (utm ->> 'utm_source') as utm_source,
    (utm ->> 'utm_medium') as utm_medium,
    (utm ->> 'utm_campaign') as utm_campaign,
    (utm ->> 'lid') as link_id,
    url,
    referrer,
    (viewport ->> 'w')::int as viewport_w,
    (viewport ->> 'h')::int as viewport_h,
    (viewport ->> 'dpr')::numeric as dpr,
    props
  from public.events;

-- One-row-per-user(session) summary view
create or replace view public.v_user_summary as
with base as (
  select
    session_id,
    min(ts) as first_seen,
    max(ts) as last_seen,
    count(*) as event_count,
    max(utm->>'lid') as link_id,
    max(utm->>'utm_source') as utm_source,
    max(utm->>'utm_medium') as utm_medium,
    max(utm->>'utm_campaign') as utm_campaign
  from public.events
  group by session_id
),
info as (
  select distinct on (session_id)
    session_id,
    props->>'name' as name,
    props->>'email_hash' as email_hash,
    (props->>'region') as region,
    coalesce((props->>'emailSubscription')::boolean, (props->>'email_subscription')::boolean) as email_subscription,
    ts as info_ts
  from public.events
  where name = 'info_submitted'
  order by session_id, ts desc
),
result as (
  select distinct on (session_id)
    session_id,
    coalesce(props->>'result_type', (props->>'type')) as result_type,
    ts as result_ts
  from public.events
  where name = 'result_computed'
  order by session_id, ts desc
),
q as (
  select session_id, count(*)::int as questions_answered
  from public.events
  where name = 'question_answered'
  group by session_id
)
select
  b.session_id,
  b.first_seen,
  b.last_seen,
  b.event_count,
  coalesce(q.questions_answered, 0) as questions_answered,
  i.name,
  i.email_hash,
  i.region,
  i.email_subscription,
  r.result_type,
  b.link_id,
  b.utm_source,
  b.utm_medium,
  b.utm_campaign
from base b
left join info i using (session_id)
left join result r using (session_id)
left join q using (session_id)
order by b.first_seen desc;
