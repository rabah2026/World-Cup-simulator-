'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Tournament, AppScreen } from '@/types/tournament'
import { createTournament } from '@/lib/tournament'
import { saveTournament, loadTournament, hasSavedTournament } from '@/lib/storage'
import { advanceKnockout } from '@/lib/knockout'
import { areAllGroupMatchesPlayed } from '@/lib/standings'
import { HomeScreen } from './HomeScreen'
import { GroupsScreen } from './GroupsScreen'
import { ThirdPlaceScreen } from './ThirdPlaceScreen'
import { KnockoutScreen } from './KnockoutScreen'
import { ChampionScreen } from './ChampionScreen'
import { BottomNav } from './BottomNav'
import { Toast } from './Toast'

const screenVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export function AppShell() {
  const [screen, setScreen] = useState<AppScreen>('home')
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [hasSaved, setHasSaved] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })

  useEffect(() => {
    setHasSaved(hasSavedTournament())
  }, [])

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message })
  }, [])

  const save = useCallback((t: Tournament) => {
    saveTournament(t)
    setHasSaved(true)
  }, [])

  const handleStart = useCallback(() => {
    const t = createTournament()
    setTournament(t)
    save(t)
    setScreen('groups')
    showToast('The road begins. Matchday is live.')
  }, [save, showToast])

  const handleContinue = useCallback(() => {
    const saved = loadTournament()
    if (saved) {
      setTournament(saved)
      const stage = saved.stage
      if (stage === 'complete') setScreen('champion')
      else if (stage === 'knockout') setScreen('knockout')
      else setScreen('groups')
      showToast('Tournament restored.')
    }
  }, [showToast])

  const handleTournamentUpdate = useCallback((updated: Tournament) => {
    setTournament(updated)
    save(updated)
  }, [save])

  const handleGenerateKnockout = useCallback(() => {
    if (!tournament) return
    const advanced = advanceKnockout(tournament)
    handleTournamentUpdate(advanced)
    setScreen('knockout')
    showToast('Round of 32 unlocked.')
  }, [tournament, handleTournamentUpdate, showToast])

  const handleReset = useCallback(() => {
    const t = createTournament()
    setTournament(t)
    save(t)
    setScreen('groups')
    showToast('New simulation started.')
  }, [save, showToast])

  const groupStageComplete = tournament ? areAllGroupMatchesPlayed(tournament.groups) : false
  const knockoutReady = tournament ? tournament.knockout.roundOf32.length > 0 : false
  const isComplete = tournament?.stage === 'complete'

  const availability = {
    groups: !!tournament,
    thirds: groupStageComplete,
    knockout: knockoutReady || groupStageComplete,
    champion: isComplete,
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          variants={screenVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className={screen !== 'home' ? 'pb-28' : ''}
        >
          {screen === 'home' && (
            <HomeScreen hasSaved={hasSaved} onStart={handleStart} onContinue={handleContinue} />
          )}
          {screen === 'groups' && tournament && (
            <GroupsScreen
              tournament={tournament}
              onUpdate={handleTournamentUpdate}
              onGenerateKnockout={handleGenerateKnockout}
              showToast={showToast}
            />
          )}
          {screen === 'third-place' && tournament && <ThirdPlaceScreen tournament={tournament} />}
          {screen === 'knockout' && tournament && (
            <KnockoutScreen tournament={tournament} onUpdate={handleTournamentUpdate} showToast={showToast} />
          )}
          {screen === 'champion' && tournament && (
            <ChampionScreen tournament={tournament} onReset={handleReset} showToast={showToast} />
          )}
          {!tournament && screen !== 'home' && (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <p className="text-white/40 text-sm">No tournament active.</p>
                <button onClick={() => setScreen('home')} className="mt-4 px-5 py-2 glass rounded-xl text-sm text-white/70">
                  Go Home
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {screen !== 'home' && (
        <BottomNav currentScreen={screen} onChange={setScreen} availability={availability} />
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  )
}
