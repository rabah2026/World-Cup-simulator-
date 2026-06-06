'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import type { Tournament, KnockoutRound } from '@/types/tournament'
import { simulateKnockoutMatch } from '@/lib/simulator'
import { advanceKnockout, isRoundComplete } from '@/lib/knockout'
import { MatchCard } from './MatchCard'
import { EmptyState } from './EmptyState'
import { getKnockoutRoundShort, getKnockoutRoundLabel } from '@/lib/utils'

type KnockoutScreenProps = {
  tournament: Tournament
  onUpdate: (t: Tournament) => void
  showToast: (msg: string) => void
}

type RoundKey = keyof typeof roundKeyMap
const roundKeyMap = {
  round_of_32: 'roundOf32',
  round_of_16: 'roundOf16',
  quarter_final: 'quarterFinals',
  semi_final: 'semiFinals',
  third_place: 'thirdPlace',
  final: 'final',
} as const

const rounds: KnockoutRound[] = ['round_of_32', 'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final']

export function KnockoutScreen({ tournament, onUpdate, showToast }: KnockoutScreenProps) {
  const [activeRound, setActiveRound] = useState<KnockoutRound>('round_of_32')

  const { knockout } = tournament

  const roundMatches = useMemo(() => {
    const key = roundKeyMap[activeRound]
    return knockout[key] ?? []
  }, [knockout, activeRound])

  const isRoundAvailable = (r: KnockoutRound): boolean => {
    const key = roundKeyMap[r]
    return (knockout[key] ?? []).length > 0
  }

  const handleSimulate = (matchId: string) => {
    const key = roundKeyMap[activeRound]
    const updatedMatches = knockout[key].map((m) =>
      m.id === matchId ? simulateKnockoutMatch(m) : m
    )
    let updated: Tournament = {
      ...tournament,
      knockout: { ...knockout, [key]: updatedMatches },
      updatedAt: new Date().toISOString(),
    }
    // Advance if round complete
    updated = advanceKnockout(updated)
    onUpdate(updated)

    if (isRoundComplete(updatedMatches)) {
      if (activeRound === 'semi_final') {
        showToast('Semi-finals complete. Final unlocked.')
        setActiveRound('final')
      } else if (activeRound === 'final') {
        showToast('Champion crowned!')
      }
    }
  }

  const handleSimulateAll = () => {
    const key = roundKeyMap[activeRound]
    const updatedMatches = knockout[key].map((m) =>
      m.status === 'not_played' ? simulateKnockoutMatch(m) : m
    )
    let updated: Tournament = {
      ...tournament,
      knockout: { ...knockout, [key]: updatedMatches },
      updatedAt: new Date().toISOString(),
    }
    updated = advanceKnockout(updated)
    onUpdate(updated)
    showToast(`${getKnockoutRoundLabel(activeRound)} complete.`)
  }

  if (knockout.roundOf32.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon="🏆"
          title="Bracket Not Generated"
          description="Complete all 72 group-stage matches and then generate the Round of 32 from the Groups screen."
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="px-5 pt-12 pb-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D6A84F] animate-pulse" />
            <span className="text-xs text-[#D6A84F] font-semibold uppercase tracking-widest">Knockout Stage</span>
          </div>
          <h1 className="text-2xl font-black text-white">The Bracket</h1>
        </motion.div>
      </div>

      {/* Round selector */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {rounds.map((r) => {
            const available = isRoundAvailable(r)
            const active = activeRound === r
            return (
              <button
                key={r}
                onClick={() => available && setActiveRound(r)}
                disabled={!available}
                className={`
                  shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                  ${active ? 'bg-[#00D084] text-black' : ''}
                  ${!active && available ? 'glass text-white/70 hover:text-white' : ''}
                  ${!available ? 'text-white/20 cursor-not-allowed' : ''}
                `}
              >
                {!available && <Lock size={10} className="inline mr-1" />}
                {getKnockoutRoundShort(r)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Round label */}
      <div className="px-5 mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-white">{getKnockoutRoundLabel(activeRound)}</h2>
        {roundMatches.some((m) => m.status === 'not_played') && (
          <button
            onClick={handleSimulateAll}
            className="text-xs text-[#D6A84F] font-semibold glass px-3 py-1.5 rounded-lg"
          >
            Simulate All
          </button>
        )}
      </div>

      {/* Match cards */}
      <div className="px-5 flex flex-col gap-3 pb-6">
        {roundMatches.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <MatchCard
              match={match}
              onSimulate={() => handleSimulate(match.id)}
              knockout
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
