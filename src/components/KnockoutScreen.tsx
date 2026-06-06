'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Check, Crown } from 'lucide-react'
import type { Tournament, KnockoutRound, Match } from '@/types/tournament'
import { simulateKnockoutMatch } from '@/lib/simulator'
import { advanceKnockout, isRoundComplete } from '@/lib/knockout'
import { MatchCard } from './MatchCard'
import { EmptyState } from './EmptyState'
import { LiveMatchModal } from './LiveMatchModal'
import { TopHeader } from './TopHeader'
import { getKnockoutRoundShort, getKnockoutRoundLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'

type KnockoutScreenProps = {
  tournament: Tournament
  onUpdate: (t: Tournament) => void
  showToast: (msg: string) => void
}

const roundKeyMap = {
  round_of_32: 'roundOf32',
  round_of_16: 'roundOf16',
  quarter_final: 'quarterFinals',
  semi_final: 'semiFinals',
  third_place: 'thirdPlace',
  final: 'final',
} as const

type RoundKey = typeof roundKeyMap[keyof typeof roundKeyMap]

const rounds: KnockoutRound[] = ['round_of_32', 'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final']

export function KnockoutScreen({ tournament, onUpdate, showToast }: KnockoutScreenProps) {
  const { knockout } = tournament

  const deepestAvailable = useMemo<KnockoutRound>(() => {
    const order: KnockoutRound[] = ['final', 'third_place', 'semi_final', 'quarter_final', 'round_of_16', 'round_of_32']
    for (const r of order) {
      if ((knockout[roundKeyMap[r]] ?? []).length > 0) return r
    }
    return 'round_of_32'
  }, [knockout])

  const [activeRound, setActiveRound] = useState<KnockoutRound>(deepestAvailable)
  const [liveMatch, setLiveMatch] = useState<Match | null>(null)
  const [liveKey, setLiveKey] = useState<RoundKey | null>(null)

  const roundMatches = useMemo(() => knockout[roundKeyMap[activeRound]] ?? [], [knockout, activeRound])

  const roundStatus = (r: KnockoutRound): 'locked' | 'active' | 'complete' => {
    const matches = knockout[roundKeyMap[r]] ?? []
    if (matches.length === 0) return 'locked'
    if (matches.every((m) => m.status === 'played')) return 'complete'
    return 'active'
  }

  const handleSimulate = (matchId: string) => {
    const key = roundKeyMap[activeRound]
    const m = knockout[key].find((x) => x.id === matchId)
    if (!m || m.status === 'played') return
    setLiveMatch(simulateKnockoutMatch(m))
    setLiveKey(key)
  }

  const applyLiveResult = () => {
    if (!liveMatch || !liveKey) return
    const updatedMatches = knockout[liveKey].map((m) => (m.id === liveMatch.id ? liveMatch : m))
    let updated: Tournament = {
      ...tournament,
      knockout: { ...knockout, [liveKey]: updatedMatches },
      updatedAt: new Date().toISOString(),
    }
    updated = advanceKnockout(updated)
    onUpdate(updated)

    if (isRoundComplete(updatedMatches)) {
      if (activeRound === 'semi_final') {
        showToast('Semi-finals complete. The Final awaits.')
        setActiveRound('final')
      } else if (activeRound === 'final') {
        showToast('Champion crowned!')
      } else {
        showToast(`${getKnockoutRoundLabel(activeRound)} complete.`)
      }
    }

    setLiveMatch(null)
    setLiveKey(null)
  }

  const handleSimulateAll = () => {
    const key = roundKeyMap[activeRound]
    const updatedMatches = knockout[key].map((m) => (m.status === 'not_played' ? simulateKnockoutMatch(m) : m))
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

  const roundPlayed = roundMatches.filter((m) => m.status === 'played').length

  return (
    <div className="min-h-screen">
      <TopHeader tournament={tournament} eyebrow="Knockout Stage" title="The Bracket" subtitle="32 teams. One trophy." accent="gold" />

      {/* Champion banner */}
      {tournament.stage === 'complete' && tournament.champion && (
        <div className="px-5 mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-gold rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <Crown size={20} className="text-[#D6A84F]" />
            <div>
              <div className="text-[10px] text-[#D6A84F]/70 uppercase tracking-widest font-bold">Champions</div>
              <div className="text-sm font-black text-white">
                {tournament.champion.flagEmoji} {tournament.champion.name}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Round stepper */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between">
          {rounds.map((r, i) => {
            const status = roundStatus(r)
            const active = activeRound === r
            const available = status !== 'locked'
            return (
              <div key={r} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => available && setActiveRound(r)}
                  disabled={!available}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all',
                      active && 'ring-2 ring-offset-2 ring-offset-[#05070D]',
                      status === 'complete' && 'bg-[#00D084]/20 text-[#00D084]',
                      status === 'active' && 'bg-[#D6A84F]/20 text-[#D6A84F]',
                      status === 'locked' && 'bg-white/5 text-white/25',
                    )}
                    style={active ? { boxShadow: '0 0 0 2px #05070D, 0 0 0 4px rgba(0,208,132,0.5)' } : undefined}
                  >
                    {status === 'complete' ? <Check size={13} /> : status === 'locked' ? <Lock size={11} /> : getKnockoutRoundShort(r)}
                  </div>
                  <span className={cn('text-[8px] font-semibold', active ? 'text-white' : 'text-white/35')}>
                    {getKnockoutRoundShort(r)}
                  </span>
                </button>
                {i < rounds.length - 1 && (
                  <div className="flex-1 h-px mx-1 mb-4" style={{ background: status === 'complete' ? 'rgba(0,208,132,0.4)' : 'rgba(255,255,255,0.1)' }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Round label */}
      <div className="px-5 mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">{getKnockoutRoundLabel(activeRound)}</h2>
          <span className="text-[11px] text-white/40">{roundPlayed}/{roundMatches.length} decided</span>
        </div>
        {roundMatches.some((m) => m.status === 'not_played') && (
          <button onClick={handleSimulateAll} className="text-xs text-[#D6A84F] font-semibold glass px-3 py-1.5 rounded-lg">
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
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
          >
            <MatchCard match={match} onSimulate={() => handleSimulate(match.id)} knockout />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {liveMatch && <LiveMatchModal match={liveMatch} onComplete={applyLiveResult} />}
      </AnimatePresence>
    </div>
  )
}
