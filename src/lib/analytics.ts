import { supabase } from './supabaseClient'

export type AnalyticsEventName =
  | 'link_opened'
  | 'start_test'
  | 'question_answered'
  | 'info_submitted'
  | 'result_computed'
  | 'save_result_success'

// Simple UUID v4 (RFC4122 variant)
const uuid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`

const storage = window.localStorage

const STORAGE_KEYS = {
  sid: 'cdna.sid',
  openedFlagPrefix: 'cdna.opened.',
  queue: 'cdna.queue',
} as const

export interface TrackContext {
  session_id: string
  url: string
  referrer?: string
  utm?: Record<string, string | null>
  user_agent: string
  language: string
  timezone: string
  viewport: { w: number; h: number; dpr: number }
}

export interface TrackPayload {
  name: AnalyticsEventName
  props?: Record<string, any>
}

function getOrCreateSessionId(): string {
  let sid = storage.getItem(STORAGE_KEYS.sid)
  if (!sid) {
    sid = uuid()
    storage.setItem(STORAGE_KEYS.sid, sid)
  }
  return sid
}

function readUtm(): Record<string, string | null> {
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get('utm_source'),
    utm_medium: p.get('utm_medium'),
    utm_campaign: p.get('utm_campaign'),
    utm_content: p.get('utm_content'),
    utm_term: p.get('utm_term'),
    lid: p.get('lid') || p.get('link') || p.get('ref'),
  }
}

function buildContext(): TrackContext {
  return {
    session_id: getOrCreateSessionId(),
    url: window.location.href,
    referrer: document.referrer || undefined,
    utm: readUtm(),
    user_agent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio || 1 },
  }
}

// Offline queue (best-effort)
function enqueue(evt: any) {
  try {
    const raw = storage.getItem(STORAGE_KEYS.queue)
    const arr = raw ? JSON.parse(raw) : []
    arr.push(evt)
    storage.setItem(STORAGE_KEYS.queue, JSON.stringify(arr))
  } catch {}
}

async function flushQueue() {
  const raw = storage.getItem(STORAGE_KEYS.queue)
  if (!raw) return
  try {
    const arr: any[] = JSON.parse(raw)
    if (!Array.isArray(arr) || arr.length === 0) return
    for (const evt of arr) {
      // eslint-disable-next-line no-await-in-loop
      await insertEvent(evt)
    }
    storage.removeItem(STORAGE_KEYS.queue)
  } catch {}
}

window.addEventListener('online', () => { void flushQueue() })

async function insertEvent(row: any) {
  // Inserts into Supabase table `events`
  // Expect RLS policy to allow anon insert.
  return supabase.from('events').insert(row)
}

export async function track({ name, props = {} }: TrackPayload) {
  const ctx = buildContext()
  const event_id = uuid()
  const ts = new Date().toISOString()
  const row = {
    event_id,
    session_id: ctx.session_id,
    name,
    ts,
    url: ctx.url,
    referrer: ctx.referrer || null,
    user_agent: ctx.user_agent,
    language: ctx.language,
    timezone: ctx.timezone,
    viewport: ctx.viewport,
    utm: ctx.utm,
    props,
  }
  try {
    const { error } = await insertEvent(row)
    if (error) throw error
  } catch {
    enqueue(row)
  }
}

// Track link_opened once per link id per session
export function trackLinkOpenedOnce() {
  const ctx = buildContext()
  const linkId = ctx.utm?.lid || 'default'
  const key = `${STORAGE_KEYS.openedFlagPrefix}${linkId}`
  if (storage.getItem(key)) return
  storage.setItem(key, '1')
  void track({ name: 'link_opened', props: { link_id: linkId } })
}

