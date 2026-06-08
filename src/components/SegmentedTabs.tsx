'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBracketStore, type ActiveTab } from '@/store/bracketStore'

type TabConfig = {
  id: ActiveTab
  label: string
  shortLabel: string
  locked: boolean
  completed: boolean
}

export function SegmentedTabs() {
  const { activeTab, setActiveTab, tournament } = useBracketStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  const knockout = tournament?.knockout
  const gsComplete = tournament?.stage === 'group_stage_complete' || tournament?.stage === 'knockout' || tournament?.stage === 'complete'
  const hasR32 = (knockout?.roundOf32?.length ?? 0) > 0
  const hasR16 = (knockout?.roundOf16?.length ?? 0) > 0
  const hasQF = (knockout?.quarterFinals?.length ?? 0) > 0
  const hasSF = (knockout?.semiFinals?.length ?? 0) > 0
  const hasF = (knockout?.final?.length ?? 0) > 0

  const isRoundDone = (matches: any[] | undefined) =>
    (matches?.length ?? 0) > 0 && matches!.every((m: any) => m.status === 'played')

  const tabs: TabConfig[] = [
    { id: 'GS', label: 'Groups', shortLabel: 'GS', locked: false, completed: gsComplete },
    { id: 'R32', label: 'Round of 32', shortLabel: 'R32', locked: !hasR32, completed: isRoundDone(knockout?.roundOf32) },
    { id: 'R16', label: 'Round of 16', shortLabel: 'R16', locked: !hasR16, completed: isRoundDone(knockout?.roundOf16) },
    { id: 'QF', label: 'Quarter-Finals', shortLabel: 'QF', locked: !hasQF, completed: isRoundDone(knockout?.quarterFinals) },
    { id: 'SF', label: 'Semi-Finals', shortLabel: 'SF', locked: !hasSF, completed: isRoundDone(knockout?.semiFinals) },
    { id: 'F', label: 'Final', shortLabel: 'F', locked: !hasF, completed: isRoundDone(knockout?.final) },
    { id: 'MY', label: 'My Bracket', shortLabel: 'My', locked: false, completed: false },
  ]

  // Auto-scroll active tab into view
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const activeEl = container.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement
    if (activeEl) {
      const left = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2
      container.scrollTo({ left, behavior: 'smooth' })
    }
  }, [activeTab])

  return (
    <div className="sticky top-14 z-30 bg-gradient-to-b from-[#050A18] to-transparent pb-2">
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 px-4 overflow-x-auto py-2"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isLocked = tab.locked

          return (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => !isLocked && setActiveTab(tab.id)}
              disabled={isLocked}
              className="relative flex-shrink-0 rounded-full transition-all duration-200"
              style={{ scrollSnapAlign: 'center' }}
            >
              <div
                className="px-3.5 py-1.5 rounded-full flex items-center gap-1.5"
                style={{
                  background: isActive
                    ? '#FFFFFF'
                    : isLocked
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(255,255,255,0.07)',
                  border: isActive
                    ? 'none'
                    : isLocked
                    ? '1px solid rgba(255,255,255,0.05)'
                    : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Completion dot */}
                {tab.completed && !isActive && !isLocked && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] flex-shrink-0" />
                )}

                <span
                  className="text-[12px] font-bold whitespace-nowrap"
                  style={{
                    color: isActive ? '#020815' : isLocked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {tab.shortLabel}
                </span>
              </div>

              {/* Active indicator spring */}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-full bg-white"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
