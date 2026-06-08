'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBracketStore } from '@/store/bracketStore'
import { Header } from './Header'
import { SegmentedTabs } from './SegmentedTabs'
import { GroupStageView } from './groups/GroupStageView'
import { BracketCarousel } from './bracket/BracketCarousel'

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

  return (
    <div className="min-h-dvh max-w-lg mx-auto relative overflow-x-hidden">
      <div className="sticky top-0 z-40 sticky-header-bg">
        <Header />
        <SegmentedTabs />
      </div>

      <div className="pt-2">
        {activeTab === 'GS' ? (
          <GroupStageView />
        ) : (
          <BracketCarousel />
        )}
      </div>
    </div>
  )
}
