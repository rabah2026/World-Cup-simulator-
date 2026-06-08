'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from 'framer-motion'
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

type RoundDef = {
  tab: ActiveTab
  key: string
  nextKey: string | null
  label: string
}

const ROUND_DEFS: RoundDef[] = [
  { tab: 'R32', key: 'roundOf32',     nextKey: 'roundOf16',     label: 'Round of 32'    },
  { tab: 'R16', key: 'roundOf16',     nextKey: 'quarterFinals', label: 'Round of 16'    },
  { tab: 'QF',  key: 'quarterFinals', nextKey: 'semiFinals',    label: 'Quarter-Finals' },
  { tab: 'SF',  key: 'semiFinals',    nextKey: 'final',         label: 'Semi-Finals'    },
  { tab: 'F',   key: 'final',         nextKey: null,            label: 'Final'          },
]

export function BracketCarousel() {
  const { tournament, activeTab, setActiveTab } = useBracketStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageWidth, setPageWidth] = useState(390)
  const [currentIdx, setCurrentIdx] = useState(0)
  const x = useMotionValue(0)
  const isDragging = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setPageWidth(el.offsetWidth)
    update()
    const obs = new ResizeObserver(update)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const knockout = tournament?.knockout
  const available = ROUND_DEFS.filter(
    (r) => ((knockout as any)?.[r.key] as Match[] | undefined)?.length ?? 0 > 0
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const idx = available.findIndex((r) => r.tab === activeTab)
    if (idx >= 0 && idx !== currentIdx && !isDragging.current) {
      setCurrentIdx(idx)
      animate(x, -idx * pageWidth, { type: 'spring', damping: 32, stiffness: 300, restDelta: 0.5 })
    }
  }, [activeTab, pageWidth, available.length])

  const snapTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, available.length - 1))
    setCurrentIdx(clamped)
    const tab = available[clamped]?.tab
    if (tab) setActiveTab(tab)
    animate(x, -clamped * pageWidth, { type: 'spring', damping: 32, stiffness: 300, restDelta: 0.5 })
  }, [available, pageWidth, setActiveTab, x])

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    isDragging.current = false
    const { offset, velocity } = info
    if (offset.x < -pageWidth * 0.22 || velocity.x < -500) snapTo(currentIdx + 1)
    else if (offset.x > pageWidth * 0.22 || velocity.x > 500) snapTo(currentIdx - 1)
    else snapTo(currentIdx)
  }, [currentIdx, pageWidth, snapTo])

  if (!tournament || available.length === 0) return null

  return (
    <div ref={containerRef} className="w-full">
      {/* Round label + dot pills */}
      <div className="px-5 pb-3 flex items-center justify-between">
        <motion.p
          key={currentIdx}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-bold text-[15px]"
        >
          {available[currentIdx]?.label}
        </motion.p>

        <div className="flex items-center gap-1.5">
          {available.map((r, i) => (
            <motion.button
              key={r.key}
              onClick={() => snapTo(i)}
              animate={{ width: i === currentIdx ? 20 : 6, opacity: i === currentIdx ? 1 : 0.35 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              style={{ height: 6, borderRadius: 3, background: 'white', flexShrink: 0 }}
            />
          ))}
        </div>
      </div>

      {/* Draggable track */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -(available.length - 1) * pageWidth, right: 0 }}
        dragElastic={0.06}
        style={{ x, display: 'flex', width: available.length * pageWidth, cursor: 'grab' }}
        onDragStart={() => { isDragging.current = true }}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {available.map((round, i) => {
          const currentMatches = ((knockout as any)[round.key] as Match[]) ?? []
          const nextMatches: Match[] = round.nextKey
            ? (((knockout as any)[round.nextKey] as Match[]) ?? [])
            : []

          return (
            <RoundPage
              key={round.key}
              index={i}
              x={x}
              pageWidth={pageWidth}
              currentMatches={currentMatches}
              nextMatches={nextMatches}
              roundKey={round.key}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

type RoundPageProps = {
  index: number
  x: ReturnType<typeof useMotionValue<number>>
  pageWidth: number
  currentMatches: Match[]
  nextMatches: Match[]
  roundKey: string
}

function RoundPage({ index, x, pageWidth, currentMatches, nextMatches, roundKey }: RoundPageProps) {
  const center = -index * pageWidth

  const scale = useTransform(
    x,
    [center - pageWidth, center, center + pageWidth],
    [0.88, 1.0, 0.88]
  )
  const opacity = useTransform(
    x,
    [center - pageWidth * 1.2, center - pageWidth * 0.4, center, center + pageWidth * 0.4, center + pageWidth * 1.2],
    [0.3, 0.75, 1.0, 0.75, 0.3]
  )

  // Final: single match centered with trophy
  if (currentMatches.length === 1) {
    return (
      <motion.div
        style={{ scale, opacity, width: pageWidth, flexShrink: 0 }}
        className="px-5 pb-6 pointer-events-none select-none"
      >
        <motion.div style={{ pointerEvents: 'auto' }} className="flex flex-col items-center gap-4 py-4">
          <div className="text-4xl mb-2">🏆</div>
          <div className="w-full">
            <BracketMatch
              match={currentMatches[0]}
              dateLabel={DATES[currentMatches[0].id]}
            />
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Build pairs: every 2 current matches → 1 next-round match
  const pairs: { m1: Match; m2: Match | null; next: Match | null }[] = []
  for (let i = 0; i < currentMatches.length; i += 2) {
    pairs.push({
      m1: currentMatches[i],
      m2: currentMatches[i + 1] ?? null,
      next: nextMatches[Math.floor(i / 2)] ?? null,
    })
  }

  return (
    <motion.div
      style={{ scale, opacity, width: pageWidth, flexShrink: 0 }}
      className="pointer-events-none select-none"
    >
      <div
        className="overflow-y-auto px-4 pb-6 space-y-3"
        style={{
          maxHeight: 'calc(100dvh - 260px)',
          pointerEvents: 'auto',
          touchAction: 'pan-y',
        }}
      >
        {pairs.map((pair, pairIdx) => (
          <BracketPair
            key={pairIdx}
            m1={pair.m1}
            m2={pair.m2}
            next={pair.next}
          />
        ))}
      </div>
    </motion.div>
  )
}

type BracketPairProps = {
  m1: Match
  m2: Match | null
  next: Match | null
}

function BracketPair({ m1, m2, next }: BracketPairProps) {
  return (
    <div className="flex gap-2 items-stretch">
      {/* Left: two stacked matches */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <BracketMatch match={m1} dateLabel={DATES[m1.id]} />
        {m2 && <BracketMatch match={m2} dateLabel={DATES[m2.id]} />}
      </div>

      {/* Thin connector */}
      <div className="w-2.5 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-px flex-1 my-4 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* Right: next-round match centered */}
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
