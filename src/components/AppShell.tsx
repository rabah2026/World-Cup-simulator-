'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBracketStore } from '@/store/bracketStore'
import { Header } from './Header'
import { SegmentedTabs } from './SegmentedTabs'
import { GroupStageView } from './groups/GroupStageView'
import { BracketView } from './bracket/BracketView'
import { MyBracket } from './MyBracket'
import { CelebrationOverlay } from './effects/CelebrationOverlay'

const KNOCKOUT_TABS = ['R32', 'R16', 'QF', 'SF', 'F'] as const

export function AppShell() {
  const { tournament, activeTab, loadSaved } = useBracketStore()

  // Load or init tournament on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadSaved() }, [])

  // Loading state
  if (!tournament) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-5xl"
        >
          ⚽
        </motion.div>
      </div>
    )
  }

  const isKnockout = KNOCKOUT_TABS.includes(activeTab as any)

  return (
    <div className="min-h-dvh max-w-lg mx-auto relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #0A84FF 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-8"
          style={{
            background: 'radial-gradient(circle, #D4A843 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* App header */}
      <Header />

      {/* Tab bar */}
      <SegmentedTabs />

      {/* Content area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {activeTab === 'GS' && <GroupStageView />}
          {isKnockout && <BracketView activeTab={activeTab} />}
          {activeTab === 'MY' && <MyBracket />}
        </motion.div>
      </AnimatePresence>

      {/* Celebration overlay — full screen, z-top */}
      <CelebrationOverlay />
    </div>
  )
}
