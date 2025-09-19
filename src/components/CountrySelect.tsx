import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { flagEmojiForName } from '@/lib/flagEmoji'

interface CountrySelectProps {
  options: string[]
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

// Lightweight custom country picker: fixed-height dropdown with scrollable list and A–Z index
export const CountrySelect: React.FC<CountrySelectProps> = ({ options, value, onChange, placeholder = 'Select Country/Region' }) => {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Build grouped list by first letter
  const groups = useMemo(() => {
    const m: Record<string, string[]> = {}
    const norm = (s: string) => s.normalize ? s.normalize('NFKD') : s
    for (const name of options.slice().sort((a, b) => a.localeCompare(b))) {
      const t = norm(name)
      const ch = t.trim().charAt(0).toUpperCase()
      const key = /[A-Z]/.test(ch) ? ch : '#'
      if (!m[key]) m[key] = []
      m[key].push(name)
    }
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const out: { letter: string; items: string[] }[] = []
    for (const L of letters) { if (m[L]) out.push({ letter: L, items: m[L] }) }
    if (m['#']) out.push({ letter: '#', items: m['#'] })
    return out
  }, [options])

  const letters = useMemo(() => groups.map(g => g.letter), [groups])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (panelRef.current && panelRef.current.contains(target)) return
      if (triggerRef.current && triggerRef.current.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    // Lock body scroll when modal open
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const scrollToLetter = (L: string) => {
    const el = sectionRefs.current[L]
    if (!el || !scrollRef.current) return
    const container = scrollRef.current
    const top = el.offsetTop
    container.scrollTo({ top, behavior: 'smooth' })
  }

  const selectedLabel = value ? `${flagEmojiForName(value)} ${value}` : ''

  // On open, scroll to current selection's letter section
  useEffect(() => {
    if (!open) return
    const letterFrom = (name: string) => {
      if (!name) return 'A'
      const t = name.normalize ? name.normalize('NFKD') : name
      const ch = t.trim().charAt(0).toUpperCase()
      return /[A-Z]/.test(ch) ? ch : '#'
    }
    const L = letterFrom(value)
    requestAnimationFrame(() => scrollToLetter(L))
  }, [open])

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-left transition-all ${
          value ? 'text-gray-900' : 'text-gray-500'
        } border-gray-200 focus:border-yellow-400 focus:outline-none`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value ? selectedLabel : placeholder}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[1000]" aria-modal="true" role="dialog" style={{ padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          {/* Centered modal panel */}
          <div
            ref={panelRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl flex flex-col"
            style={{ width: 'min(88vw, 360px)', maxWidth: 420, height: 'min(78vh, 520px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-none rounded-t-2xl">
              <div className="text-sm font-semibold text-gray-800">Select Country/Region</div>
              <button
                type="button"
                aria-label="Close"
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            {/* Scrollable content */}
            <div className="relative flex-1 overflow-hidden">
              <div
                ref={scrollRef}
                className="h-full overflow-y-auto pr-5"
                style={{ WebkitOverflowScrolling: 'touch' as any }}
                role="listbox"
              >
                {groups.map(g => (
                  <div key={g.letter}>
                    <div
                      ref={(el) => { sectionRefs.current[g.letter] = el }}
                      className="px-4 py-2 text-xs font-semibold text-gray-500 sticky top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70"
                    >
                      {g.letter}
                    </div>
                    {g.items.map(item => (
                      <button
                        key={item}
                        type="button"
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${value === item ? 'bg-yellow-50' : ''}`}
                        onClick={() => { onChange(item); setOpen(false) }}
                        role="option"
                        aria-selected={value === item}
                      >
                        <span className="mr-2">{flagEmojiForName(item)}</span>
                        <span className="text-gray-900">{item}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              {/* A–Z index bar inside panel */}
              <div className="absolute top-2 bottom-2 right-1 flex flex-col items-center justify-center select-none">
                {letters.map(L => (
                  <button
                    key={L}
                    type="button"
                    className="text-[10px] text-gray-500 px-1 py-0.5 hover:text-gray-900"
                    onClick={(e) => { e.preventDefault(); scrollToLetter(L) }}
                  >
                    {L}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>, document.body)}
    </div>
  )
}
