'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useBracketStore, type ActiveTab } from '@/store/bracketStore'

const TEXT_TABS: { id: ActiveTab; label: string }[] = [
  { id: 'GS', label: 'GS' },
  { id: 'R32', label: 'R32' },
  { id: 'R16', label: 'R16' },
  { id: 'QF', label: 'QF' },
  { id: 'SF', label: 'SF' },
  { id: 'F', label: 'F' },
]

// Icon tabs represent bracket stages visually
// Each shows lines of different density = different bracket stages
const ICON_TABS: { id: ActiveTab; lines: number }[] = [
  { id: 'GS', lines: 5 },
  { id: 'R32', lines: 4 },
  { id: 'R16', lines: 3 },
  { id: 'QF', lines: 2 },
  { id: 'SF', lines: 1 },
  { id: 'F', lines: 0 }, // trophy icon for Final
]

export function SegmentedTabs() {
  const { activeTab, setActiveTab, tournament } = useBracketStore()
  const iconScrollRef = useRef<HTMLDivElement>(null)

  const knockout = tournament?.knockout
  const isLocked = (tab: ActiveTab) => {
    if (tab === 'GS') return false
    if (tab === 'R32') return (knockout?.roundOf32?.length ?? 0) === 0
    if (tab === 'R16') return (knockout?.roundOf16?.length ?? 0) === 0
    if (tab === 'QF') return (knockout?.quarterFinals?.length ?? 0) === 0
    if (tab === 'SF') return (knockout?.semiFinals?.length ?? 0) === 0
    if (tab === 'F') return (knockout?.final?.length ?? 0) === 0
    return true
  }

  return (
    <div className="z-40">
      {/* Row 1: Text tabs */}
      <div className="flex items-center px-4 py-2">
        {TEXT_TABS.map((tab) => {
          const active = activeTab === tab.id
          const locked = isLocked(tab.id)
          return (
            <button
              key={tab.id}
              onClick={() => !locked && setActiveTab(tab.id)}
              disabled={locked}
              className="flex-1 relative py-1.5 text-center"
            >
              {active && (
                <motion.div
                  layoutId="text-tab-pill"
                  className="absolute inset-0 rounded-lg bg-white"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
              <span
                className="relative z-10 text-[13px] font-semibold"
                style={{
                  color: active ? '#0A1560' : locked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)',
                }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Row 2: Icon tabs (bracket view selectors) */}
      <div
        ref={iconScrollRef}
        className="flex items-center gap-2 px-4 pb-2 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {ICON_TABS.map((tab) => {
          const active = activeTab === tab.id
          const locked = isLocked(tab.id)
          return (
            <button
              key={tab.id}
              onClick={() => !locked && setActiveTab(tab.id)}
              disabled={locked}
              className="flex-shrink-0 w-14 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: active ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.1)',
                opacity: locked ? 0.3 : 1,
              }}
            >
              {tab.id === 'F' ? (
                <span style={{ fontSize: 16, filter: active ? 'none' : 'grayscale(0.5)' }}>🏆</span>
              ) : (
                <BracketIcon lines={tab.lines} active={active} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BracketIcon({ lines, active }: { lines: number; active: boolean }) {
  const color = active ? '#0A1560' : 'rgba(255,255,255,0.7)'
  const widths = [
    [14, 14, 14, 14, 14],  // GS: 5 equal lines
    [12, 12, 12, 12],       // R32: 4 lines
    [14, 10, 14],           // R16: 3 lines
    [14, 14],               // QF: 2 lines
    [16],                   // SF: 1 line
  ]
  const lineWidths = widths[Math.max(0, 5 - lines - 1)] ?? [16]
  return (
    <div className="flex flex-col gap-1 items-center justify-center">
      {lineWidths.map((w, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{ width: w, height: 2, backgroundColor: color }}
        />
      ))}
    </div>
  )
}
