-- Upgrade existing schema to latest analytics shape
-- Safe to run multiple times (idempotent where possible)

-- 1) Add IP column if missing
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'events' and column_name = 'ip'
  ) then
    alter table public.events add column ip inet;
  end if;
end $$;

-- 2) Trigger to set IP from x-forwarded-for
create or replace function public.set_request_ip()
returns trigger language plpgsql as $$
begin
  if NEW.ip is null then
    begin
      NEW.ip := nullif(split_part((current_setting('request.headers', true)::json->>'x-forwarded-for'), ',', 1),'')::inet;
    exception when others then
      NEW.ip := null;
    end;
  end if;
  return NEW;
end $$;

drop trigger if exists trg_set_ip on public.events;
create trigger trg_set_ip before insert on public.events
for each row execute function public.set_request_ip();

-- Drop old view to avoid column-rename conflicts, then recreate
drop view if exists public.v_user_summary;
create view public.v_user_summary as
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
    coalesce(props->>'email', props->>'email_hash') as email,
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
answers as (
  select
    session_id,
    max((props->>'option_id')::int) filter (where (props->>'question_id')::int = 1) as q1_option,
    max((props->>'option_id')::int) filter (where (props->>'question_id')::int = 2) as q2_option,
    max((props->>'option_id')::int) filter (where (props->>'question_id')::int = 3) as q3_option,
    max((props->>'option_id')::int) filter (where (props->>'question_id')::int = 4) as q4_option,
    max((props->>'option_id')::int) filter (where (props->>'question_id')::int = 5) as q5_option,
    max((props->>'option_id')::int) filter (where (props->>'question_id')::int = 6) as q6_option,
    max((props->>'option_id')::int) filter (where (props->>'question_id')::int = 7) as q7_option,
    max((props->>'option_id')::int) filter (where (props->>'question_id')::int = 8) as q8_option
  from public.events
  where name = 'question_answered'
  group by session_id
),
score_sum as (
  select
    session_id,
    coalesce(sum((props->'scores'->>'MAKER')::numeric),0)::float as score_maker,
    coalesce(sum((props->'scores'->>'TIDY')::numeric),0)::float as score_tidy,
    coalesce(sum((props->'scores'->>'ILLUMA')::numeric),0)::float as score_illuma,
    coalesce(sum((props->'scores'->>'REFORM')::numeric),0)::float as score_reform,
    coalesce(sum((props->'scores'->>'NOMAD')::numeric),0)::float as score_nomad,
    coalesce(sum((props->'scores'->>'VISUAL')::numeric),0)::float as score_visual
  from public.events
  where name = 'question_answered'
  group by session_id
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
  i.email,
  i.region,
  i.email_subscription,
  r.result_type,
  a.q1_option, a.q2_option, a.q3_option, a.q4_option, a.q5_option, a.q6_option, a.q7_option, a.q8_option,
  s.score_maker, s.score_tidy, s.score_illuma, s.score_reform, s.score_nomad, s.score_visual,
  exists (select 1 from public.events e where e.session_id = b.session_id and e.name = 'save_result_success') as saved_result,
  b.link_id, b.utm_source, b.utm_medium, b.utm_campaign
from base b
left join info i using (session_id)
left join result r using (session_id)
left join answers a using (session_id)
left join score_sum s using (session_id)
left join q using (session_id)
order by b.first_seen desc;
