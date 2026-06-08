'use client'
import { useBracketStore, type ActiveTab } from '@/store/bracketStore'

const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'GS',  label: 'GS'  },
  { id: 'R32', label: 'R32' },
  { id: 'R16', label: 'R16' },
  { id: 'QF',  label: 'QF'  },
  { id: 'SF',  label: 'SF'  },
  { id: 'F',   label: 'F'   },
]
const N = TABS.length

export function SegmentedTabs() {
  const { activeTab, setActiveTab } = useBracketStore()
  const idx = TABS.findIndex(t => t.id === activeTab)
  const span = idx < N - 1 ? 2 : 1

  const pillLeft  = `${(idx / N) * 100}%`
  const pillWidth = `${(span / N) * 100}%`
  const pillTransition = 'left 300ms cubic-bezier(0.34,1.56,0.64,1), width 200ms ease'

  return (
    <div>
      {/* Row 1 — text tabs */}
      <div className="flex items-center px-4 pt-2 pb-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-1 text-center"
          >
            <span
              className="text-[13px]"
              style={{
                color: activeTab === tab.id ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                fontWeight: activeTab === tab.id ? 700 : 500,
              }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Row 2 — icon tabs with sliding pill */}
      <div className="px-3 pb-3">
        <div
          className="relative flex rounded-2xl"
          style={{ background: 'rgba(0,0,0,0.28)' }}
        >
          {/* Sliding pill */}
          <div
            className="absolute inset-y-1 rounded-xl pointer-events-none"
            style={{
              background: 'rgba(255,255,255,0.96)',
              left: pillLeft,
              width: pillWidth,
              transition: pillTransition,
            }}
          />

          {/* ‹ › chevrons inside the pill */}
          <div
            className="absolute inset-y-0 flex items-center justify-between pointer-events-none z-20 px-2"
            style={{ left: pillLeft, width: pillWidth, transition: pillTransition }}
          >
            <span className="text-[11px] font-bold" style={{ color: 'rgba(10,30,100,0.45)' }}>‹</span>
            <span className="text-[11px] font-bold" style={{ color: 'rgba(10,30,100,0.45)' }}>›</span>
          </div>

          {/* Icon buttons */}
          {TABS.map((tab, i) => {
            const inPill = i >= idx && i < idx + span
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 h-11 flex items-center justify-center relative z-10"
              >
                {tab.id === 'F' ? (
                  <span style={{ fontSize: 15, opacity: inPill ? 1 : 0.5 }}>🏆</span>
                ) : (
                  <BracketIcon tab={tab.id} active={inPill} />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BracketIcon({ tab, active }: { tab: ActiveTab; active: boolean }) {
  const color = active ? 'rgba(10,30,100,0.75)' : 'rgba(255,255,255,0.45)'

  const configs: Record<string, number[][]> = {
    GS:  [[14], [14], [14], [14]],
    R32: [[10, 10], [10, 10], [10, 10], [10, 10]],
    R16: [[12, 12], [12, 12], [12, 12]],
    QF:  [[14, 14], [14, 14]],
    SF:  [[16, 16]],
  }

  const rows = configs[tab] ?? [[14]]

  return (
    <div className="flex flex-col gap-[3px] items-center justify-center">
      {rows.map((rowWidths, ri) => (
        <div key={ri} className="flex gap-[3px]">
          {rowWidths.map((w, wi) => (
            <div
              key={wi}
              className="rounded-full"
              style={{ width: w, height: 2, backgroundColor: color }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
