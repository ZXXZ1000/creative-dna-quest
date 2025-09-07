Analytics (Supabase) – Minimal Setup
====================================

Overview
- Client-only tracking using Supabase with public anon key.
- Tracks events: link_opened, start_test, question_answered, info_submitted, result_computed, save_result_success.
- Offline queue with localStorage; auto-flush when online.

Steps
1) Create a Supabase project.
2) In SQL editor, run docs/supabase-setup.sql to create `events` table + RLS policy.
3) Capture env vars in your hosting:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4) Deploy. The app will immediately start inserting events.

Data Model (events)
- event_id (uuid): client-generated idempotency key
- session_id (uuid): per-device localStorage id
- name (text): event name (see list above)
- ts (timestamptz): client timestamp
- url/referrer/user_agent/language/timezone: context
- viewport (jsonb): { w, h, dpr }
- utm (jsonb): utm_source/medium/campaign/content/term/lid
- props (jsonb): event-specific payload

Export
- One-row-per-user summary: `public.v_user_summary` (recommended for handoff)
  - Includes first_seen, last_seen, answered count, latest info (name, email_hash, region, subscription) and result_type, plus UTM/link.
  - Export from Dashboard: Table editor → Views → v_user_summary → Export → CSV.
- Raw events flat view: `public.v_events_flat` for deep dives.
  Example SQL:
    select * from public.v_user_summary where first_seen >= now() - interval '30 days';

Notes
- Email handling: front-end hashes the email (sha256 lowercase) and sends `email_hash` only in analytics props.
- If you want to store plain emails, create a separate `users` table with proper RLS and capture it on Info submit via a server-side endpoint. This repo does not include that to reduce scope.
