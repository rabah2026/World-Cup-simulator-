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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadSaved() }, [])

  if (!tournament) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
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
      {/* Sticky header area with cobalt blue bg */}
      <div className="sticky top-0 z-40 sticky-header-bg">
        <Header />
        <SegmentedTabs />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
          className="pt-2"
        >
          {activeTab === 'GS' && <GroupStageView />}
          {isKnockout && <BracketView activeTab={activeTab} />}
          {activeTab === 'MY' && <MyBracket />}
        </motion.div>
      </AnimatePresence>

      <CelebrationOverlay />
    </div>
  )
}
