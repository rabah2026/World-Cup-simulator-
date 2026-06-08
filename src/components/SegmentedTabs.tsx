'use client'
import { motion } from 'framer-motion'
import { useBracketStore, type ActiveTab } from '@/store/bracketStore'

const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'R32', label: 'R32' },
  { id: 'R16', label: 'R16' },
  { id: 'QF',  label: 'QF'  },
  { id: 'SF',  label: 'SF'  },
  { id: 'F',   label: 'F'   },
]

export function SegmentedTabs() {
  const { activeTab, setActiveTab } = useBracketStore()

  return (
    <div className="flex items-center px-4 py-2">
      {TABS.map((tab) => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 relative py-1.5 text-center"
          >
            {active && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-lg bg-white"
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              />
            )}
            <span
              className="relative z-10 text-[13px] font-semibold"
              style={{ color: active ? '#0A1560' : 'rgba(255,255,255,0.6)' }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
