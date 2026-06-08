'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBracketStore } from '@/store/bracketStore'
import { Header } from './Header'
import { SegmentedTabs } from './SegmentedTabs'
import { GroupStageView } from './groups/GroupStageView'
import { BracketCarousel } from './bracket/BracketCarousel'
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
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl"
        >
          ⚽
        </motion.div>
      </div>
    )
  }

  const isKnockout = KNOCKOUT_TABS.includes(activeTab as any)

  return (
    <div className="min-h-dvh max-w-lg mx-auto relative overflow-x-hidden">
      {/* Sticky header — cobalt blue, stays opaque */}
      <div className="sticky top-0 z-40 sticky-header-bg">
        <Header />
        <SegmentedTabs />
      </div>

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab === 'GS' ? 'gs' : 'bracket'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="pt-3"
        >
          {activeTab === 'GS' && <GroupStageView />}

          {/* All knockout tabs share ONE carousel — tabs just jump to the right page */}
          {isKnockout && <BracketCarousel />}
        </motion.div>
      </AnimatePresence>

      <CelebrationOverlay />
    </div>
  )
}
