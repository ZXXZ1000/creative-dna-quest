import { supabase } from './supabaseClient'

export type AnalyticsEventName =
  | 'link_opened'
  | 'start_test'
  | 'question_answered'
  | 'info_submitted'
  | 'result_computed'
  | 'save_result_success'
  | 'explore_hoto_clicked'

// Simple UUID v4 (RFC4122 variant)
const uuid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`

const storage = window.localStorage

const STORAGE_KEYS = {
  sid: 'cdna.sid',
  openedFlagPrefix: 'cdna.opened.',
  queue: 'cdna.queue',
  utmFirstTouch: 'cdna.utm.first',
} as const

const UTM_KEY_MAP: Record<string, string[]> = {
  utm_source: ['utm_source', 'source', 'src', 'channel'],
  utm_medium: ['utm_medium', 'medium', 'med'],
  utm_campaign: ['utm_campaign', 'campaign', 'camp'],
  utm_content: ['utm_content', 'content', 'cnt', 'creative'],
  utm_term: ['utm_term', 'term', 'keyword', 'kw'],
  lid: ['lid', 'link', 'link_id', 'ref', 'ref_id', 'qr', 'qr_id'],
};

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

function normalizeValue(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function extractMappedParams(search: URLSearchParams): Record<string, string | null> {
  const result: Record<string, string | null> = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    lid: null,
  }

  Object.entries(UTM_KEY_MAP).forEach(([key, aliases]) => {
    for (const alias of aliases) {
      const value = normalizeValue(search.get(alias))
      if (value) {
        result[key] = value
        break
      }
    }
  })

  return result
}

function parseReferrerUtm(): Record<string, string | null> {
  const ref = document.referrer
  if (!ref) {
    return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null, lid: null }
  }
  try {
    const url = new URL(ref)
    return extractMappedParams(url.searchParams)
  } catch {
    return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null, lid: null }
  }
}

function hasAnyValue(obj: Record<string, string | null>): boolean {
  return Object.values(obj).some((value) => Boolean(value))
}

function readStoredUtm(): Record<string, string | null> | null {
  try {
    const raw = storage.getItem(STORAGE_KEYS.utmFirstTouch)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      utm_source: normalizeValue(parsed.utm_source),
      utm_medium: normalizeValue(parsed.utm_medium),
      utm_campaign: normalizeValue(parsed.utm_campaign),
      utm_content: normalizeValue(parsed.utm_content),
      utm_term: normalizeValue(parsed.utm_term),
      lid: normalizeValue(parsed.lid),
    }
  } catch {
    return null
  }
}

function persistFirstTouchUtm(utm: Record<string, string | null>) {
  try {
    if (!hasAnyValue(utm)) return
    const existing = readStoredUtm()
    if (existing && hasAnyValue(existing)) return
    storage.setItem(STORAGE_KEYS.utmFirstTouch, JSON.stringify(utm))
  } catch {}
}

function readUtm(): Record<string, string | null> {
  const current = extractMappedParams(new URLSearchParams(window.location.search))
  const stored = readStoredUtm()
  const referrer = parseReferrerUtm()

  const merged: Record<string, string | null> = {
    utm_source: current.utm_source || stored?.utm_source || referrer.utm_source,
    utm_medium: current.utm_medium || stored?.utm_medium || referrer.utm_medium,
    utm_campaign: current.utm_campaign || stored?.utm_campaign || referrer.utm_campaign,
    utm_content: current.utm_content || stored?.utm_content || referrer.utm_content,
    utm_term: current.utm_term || stored?.utm_term || referrer.utm_term,
    lid: current.lid || stored?.lid || referrer.lid,
  }

  if (!stored && hasAnyValue(merged)) {
    persistFirstTouchUtm(merged)
  }

  return merged
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
