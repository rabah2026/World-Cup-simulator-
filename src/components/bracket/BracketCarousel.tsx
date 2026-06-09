'use client'
import { useRef, useEffect } from 'react'
import type { Match } from '@/types/tournament'
import { useBracketStore, type ActiveTab } from '@/store/bracketStore'
import { BracketMatch } from './BracketMatch'

const DATES: Record<string, string> = {
  'r32-m1':  'Mon, Jun 29 · 23:30', 'r32-m2':  'Tue, Jun 30 · 02:00',
  'r32-m3':  'Wed, Jul 1 · 00:00',  'r32-m4':  'Wed, Jul 1 · 02:30',
  'r32-m5':  'Thu, Jul 1 · 22:00',  'r32-m6':  'Fri, Jul 2 · 00:30',
  'r32-m7':  'Thu, Jul 2 · 22:00',  'r32-m8':  'Fri, Jul 2 · 03:00',
  'r32-m9':  'Fri, Jul 3 · 02:00',  'r32-m10': 'Sat, Jul 3 · 22:00',
  'r32-m11': 'Sat, Jul 4 · 20:00',  'r32-m12': 'Sun, Jul 4 · 20:00',
  'r32-m13': 'Sun, Jun 28 · 22:00', 'r32-m14': 'Tue, Jun 30 · 04:00',
  'r32-m15': 'Tue, Jun 30 · 04:00', 'r32-m16': 'Mon, Jun 29 · 22:00',
  'round_of_16-m1': 'Sun, Jul 5 · 00:00', 'round_of_16-m2': 'Sun, Jul 5 · 23:00',
  'round_of_16-m3': 'Sat, Jul 4 · 20:00', 'round_of_16-m4': 'Mon, Jul 6 · 22:00',
  'round_of_16-m5': 'Mon, Jul 6 · 03:00', 'round_of_16-m6': 'Tue, Jul 7 · 03:00',
  'round_of_16-m7': 'Sun, Jul 5 · 23:00', 'round_of_16-m8': 'Tue, Jul 7 · 19:00',
  'quarter_final-m1': 'Thu, Jul 9 · 23:00', 'quarter_final-m2': 'Fri, Jul 10 · 22:00',
  'quarter_final-m3': 'Sat, Jul 12 · 00:00', 'quarter_final-m4': 'Sat, Jul 12 · 04:00',
  'semi_final-m1': 'Tue, Jul 14 · 22:00', 'semi_final-m2': 'Wed, Jul 15 · 22:00',
  'final-m1': 'Sun, Jul 19 · 22:00', 'third-place-m1': 'Sun, Jul 19 · 00:00',
}

type RoundDef = { tab: ActiveTab; key: string; nextKey: string | null }

const ROUND_DEFS: RoundDef[] = [
  { tab: 'R32', key: 'roundOf32',     nextKey: 'roundOf16'     },
  { tab: 'R16', key: 'roundOf16',     nextKey: 'quarterFinals' },
  { tab: 'QF',  key: 'quarterFinals', nextKey: 'semiFinals'    },
  { tab: 'SF',  key: 'semiFinals',    nextKey: 'final'         },
  { tab: 'F',   key: 'final',         nextKey: null            },
]

export function BracketCarousel() {
  const { tournament, activeTab, setActiveTab } = useBracketStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const isProgrammaticRef = useRef(false)
  const activeTabRef = useRef(activeTab)
  activeTabRef.current = activeTab
  const mountedRef = useRef(false)

  const knockout = tournament?.knockout
  const available = ROUND_DEFS.filter(
    (r) => ((knockout as any)?.[r.key] as Match[] | undefined)?.length ?? 0 > 0
  )
  const availableRef = useRef(available)
  availableRef.current = available

  // Sync activeTab → scroll position (tab bar click or initial mount)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const idx = available.findIndex((r) => r.tab === activeTab)
    if (idx < 0) return
    const w = el.offsetWidth || window.innerWidth
    const target = idx * w
    if (Math.abs(el.scrollLeft - target) < 2) { mountedRef.current = true; return }
    if (!mountedRef.current) {
      mountedRef.current = true
      el.scrollLeft = target // instant on first mount — no flash
    } else {
      isProgrammaticRef.current = true
      el.scrollTo({ left: target, behavior: 'smooth' })
      const t = setTimeout(() => { isProgrammaticRef.current = false }, 700)
      return () => clearTimeout(t)
    }
  }, [activeTab, available.length])

  // Sync user swipe → activeTab (debounced so we read after snap settles)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const scrollEl = el
    let timer: ReturnType<typeof setTimeout>
    function onScroll() {
      if (isProgrammaticRef.current) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        const w = scrollEl.offsetWidth || window.innerWidth
        const idx = Math.round(scrollEl.scrollLeft / w)
        const tab = availableRef.current[idx]?.tab
        if (tab && tab !== activeTabRef.current) setActiveTab(tab)
      }, 80)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(timer); el.removeEventListener('scroll', onScroll) }
  }, [setActiveTab])

  if (!tournament || available.length === 0) return null

  return (
    // Native CSS scroll-snap — the browser handles the swipe gesture in hardware.
    // This bypasses the passive-listener restrictions that blocked our JS approach on iOS.
    <div
      ref={containerRef}
      className="[&::-webkit-scrollbar]:hidden"
      style={{
        display: 'flex',
        overflowX: 'scroll',
        overflowY: 'hidden',  // explicit axis — iOS routes horizontal gestures here
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      } as React.CSSProperties}
    >
      {available.map((round) => {
        const currentMatches = ((knockout as any)[round.key] as Match[]) ?? []
        const nextMatches: Match[] = round.nextKey
          ? (((knockout as any)[round.nextKey] as Match[]) ?? [])
          : []
        const thirdPlaceMatch: Match | null =
          round.key === 'semiFinals' ? ((knockout as any).thirdPlace?.[0] ?? null) : null
        return (
          <RoundPage
            key={round.key}
            currentMatches={currentMatches}
            nextMatches={nextMatches}
            thirdPlaceMatch={thirdPlaceMatch}
            roundKey={round.key}
          />
        )
      })}
    </div>
  )
}

type RoundPageProps = {
  currentMatches: Match[]
  nextMatches: Match[]
  thirdPlaceMatch: Match | null
  roundKey: string
}

function RoundPage({ currentMatches, nextMatches, thirdPlaceMatch, roundKey }: RoundPageProps) {
  const pageStyle: React.CSSProperties = {
    flexShrink: 0,
    width: '100%',
    scrollSnapAlign: 'start',
  }

  if (currentMatches.length === 1) {
    return (
      <div style={pageStyle} className="px-5 pb-6">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-4xl mb-2">🏆</div>
          <div className="w-full">
            <BracketMatch match={currentMatches[0]} dateLabel={DATES[currentMatches[0].id]} />
          </div>
        </div>
      </div>
    )
  }

  if (roundKey === 'semiFinals') {
    return (
      <div style={pageStyle}>
        <div
          className="overflow-y-auto px-4 pb-6"
          style={{ maxHeight: 'calc(100dvh - 220px)' }}
        >
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {currentMatches.map((m) => (
                <BracketMatch key={m.id} match={m} dateLabel={DATES[m.id]} />
              ))}
            </div>
            <div className="w-2.5 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-px flex-1 my-6 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <div className="flex-1 flex flex-col gap-4 min-w-0 justify-center">
              {nextMatches[0] && (
                <div>
                  <div className="text-[10px] font-bold mb-1 px-0.5" style={{ color: '#D4A843' }}>Final</div>
                  <BracketMatch match={nextMatches[0]} dateLabel={DATES[nextMatches[0].id]} />
                </div>
              )}
              {thirdPlaceMatch && (
                <div>
                  <div className="text-[10px] font-bold text-white/45 mb-1 px-0.5">Third Place Match</div>
                  <BracketMatch match={thirdPlaceMatch} dateLabel={DATES[thirdPlaceMatch.id]} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const pairs: { m1: Match; m2: Match | null; next: Match | null }[] = []
  for (let i = 0; i < currentMatches.length; i += 2) {
    pairs.push({
      m1: currentMatches[i],
      m2: currentMatches[i + 1] ?? null,
      next: nextMatches[Math.floor(i / 2)] ?? null,
    })
  }

  return (
    <div style={pageStyle}>
      <div
        className="overflow-y-auto px-4 pb-6 space-y-3"
        style={{ maxHeight: 'calc(100dvh - 220px)' }}
      >
        {pairs.map((pair, pairIdx) => (
          <BracketPair key={pairIdx} m1={pair.m1} m2={pair.m2} next={pair.next} />
        ))}
      </div>
    </div>
  )
}

function BracketPair({ m1, m2, next }: { m1: Match; m2: Match | null; next: Match | null }) {
  return (
    <div className="flex gap-2 items-stretch">
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <BracketMatch match={m1} dateLabel={DATES[m1.id]} />
        {m2 && <BracketMatch match={m2} dateLabel={DATES[m2.id]} />}
      </div>
      <div className="w-2.5 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-px flex-1 my-4 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {next ? (
          <BracketMatch match={next} dateLabel={DATES[next.id]} />
        ) : (
          <div
            className="rounded-xl flex items-center justify-center"
            style={{
              minHeight: 72,
              background: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.07)',
            }}
          >
            <span className="text-white/15 text-[10px]">TBD</span>
          </div>
        )}
      </div>
    </div>
  )
}
