'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Trophy, ChevronRight, Zap } from 'lucide-react'
import type { Match } from '@/types/tournament'
import { useBracketStore, type ActiveTab } from '@/store/bracketStore'
import { BracketMatch } from './BracketMatch'
import { getKnockoutRoundLabel } from '@/lib/utils'
import { isRoundComplete } from '@/lib/knockout'
import { TrophyAnimation } from '@/components/effects/TrophyAnimation'

type RoundConfig = {
  tab: ActiveTab
  roundKey: string
  label: string
  shortLabel: string
  emoji: string
}

const ROUNDS: RoundConfig[] = [
  { tab: 'R32', roundKey: 'roundOf32', label: 'Round of 32', shortLabel: 'R32', emoji: '32' },
  { tab: 'R16', roundKey: 'roundOf16', label: 'Round of 16', shortLabel: 'R16', emoji: '16' },
  { tab: 'QF', roundKey: 'quarterFinals', label: 'Quarter-Finals', shortLabel: 'QF', emoji: '8' },
  { tab: 'SF', roundKey: 'semiFinals', label: 'Semi-Finals', shortLabel: 'SF', emoji: '4' },
  { tab: 'F', roundKey: 'final', label: 'Final', shortLabel: 'F', emoji: '🏆' },
]

export function BracketView({ activeTab }: { activeTab: ActiveTab }) {
  const { tournament, setActiveTab, simulateRound, generateKnockout, mode } = useBracketStore()

  if (!tournament) return null

  const knockout = tournament.knockout
  const hasR32 = knockout.roundOf32.length > 0

  if (!hasR32) {
    return <NoBracketState onGenerate={generateKnockout} />
  }

  // Final tab shows full trophy + bracket summary
  if (activeTab === 'F') {
    const finalMatches = knockout.final
    const sfDone = isRoundComplete(knockout.semiFinals)
    const thirdPlaceMatch = knockout.thirdPlace[0]

    return (
      <div className="px-4 pb-8">
        <TrophyAnimation />

        {/* Third place */}
        {thirdPlaceMatch && (
          <div className="mb-6">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
              Third Place Play-off
            </div>
            <BracketMatch
              match={thirdPlaceMatch}
              roundKey="thirdPlace"
            />
          </div>
        )}

        {/* Final */}
        {finalMatches.length > 0 ? (
          <div>
            <div className="text-[10px] font-bold text-[#D4A843]/70 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Trophy size={10} className="text-[#D4A843]" />
              The Final
            </div>
            {finalMatches.map((m) => (
              <div key={m.id} className="relative">
                <BracketMatch match={m} roundKey="final" />
                {m.status === 'not_played' && (
                  <button
                    onClick={() => simulateRound('final')}
                    className="mt-2 w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.1))',
                      border: '1px solid rgba(212,168,67,0.35)',
                    }}
                  >
                    <span className="text-[#D4A843]">⚽ Simulate Final</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : !sfDone ? (
          <div className="text-center py-8">
            <p className="text-white/30 text-sm">Complete the Semi-Finals first</p>
            <button onClick={() => setActiveTab('SF')} className="mt-3 text-[#0A84FF] text-sm font-semibold">
              Go to Semi-Finals →
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  // Standard knockout round view
  const roundConfig = ROUNDS.find((r) => r.tab === activeTab)
  if (!roundConfig) return null

  const roundMatches = (knockout as any)[roundConfig.roundKey] as Match[]
  const roundDone = isRoundComplete(roundMatches)
  const playedCount = roundMatches.filter((m) => m.status === 'played').length

  // Determine next tab
  const currentIndex = ROUNDS.findIndex((r) => r.tab === activeTab)
  const nextRound = ROUNDS[currentIndex + 1]
  const nextRoundHasMatches = nextRound
    ? ((knockout as any)[nextRound.roundKey] as Match[]).length > 0
    : false

  return (
    <div className="px-4 pb-8">
      {/* Round header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-black text-base">{roundConfig.label}</h2>
          <p className="text-white/35 text-[11px]">
            {playedCount}/{roundMatches.length} decided
            {roundDone && ' · Complete ✓'}
          </p>
        </div>

        {roundMatches.some((m) => m.status === 'not_played') && (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => simulateRound(roundConfig.roundKey)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold"
            style={{
              background: 'rgba(10,132,255,0.1)',
              border: '1px solid rgba(10,132,255,0.25)',
            }}
          >
            <Shuffle size={13} className="text-[#0A84FF]" />
            <span className="text-[#0A84FF]">Sim All</span>
          </motion.button>
        )}
      </div>

      {/* Match list */}
      <div className="space-y-2.5">
        {roundMatches.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.3), ease: 'easeOut' }}
          >
            <BracketMatch match={match} roundKey={roundConfig.roundKey} />
          </motion.div>
        ))}
      </div>

      {/* Advance to next round CTA */}
      <AnimatePresence>
        {roundDone && nextRound && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5"
          >
            {nextRoundHasMatches ? (
              <button
                onClick={() => setActiveTab(nextRound.tab)}
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 glass-gold font-bold text-[#D4A843] text-sm"
              >
                <span>{nextRound.label} →</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => {
                  // Generate next round by simulating
                  simulateRound(roundConfig.roundKey)
                  setActiveTab(nextRound.tab)
                }}
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 glass-gold font-bold text-[#D4A843] text-sm"
              >
                <Trophy size={16} className="text-[#D4A843]" />
                <span>Generate {nextRound.label}</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Predict mode simulate CTA */}
      {mode === 'predict' && !roundDone && roundMatches.some((m) => m.status === 'not_played') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 p-4 rounded-2xl border border-[#0A84FF]/20 bg-[#0A84FF]/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-[#0A84FF]" />
            <span className="text-[12px] font-bold text-[#0A84FF]">Predict Mode Active</span>
          </div>
          <p className="text-[11px] text-white/40 mb-3">
            Tap any match to pick your winner. Or let the simulator decide.
          </p>
          <button
            onClick={() => simulateRound(roundConfig.roundKey)}
            className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white/60 bg-white/5 border border-white/8"
          >
            🎲 Simulate Remaining Matches
          </button>
        </motion.div>
      )}
    </div>
  )
}

function NoBracketState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="px-4 flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl mb-5"
      >
        🔒
      </motion.div>
      <h3 className="text-white font-black text-lg mb-2">Bracket Locked</h3>
      <p className="text-white/40 text-sm text-center leading-relaxed max-w-xs mb-6">
        Complete all 72 group stage matches to unlock the Round of 32 bracket.
      </p>
      <button
        onClick={onGenerate}
        className="px-6 py-3 rounded-2xl glass-blue font-bold text-[#0A84FF] text-sm flex items-center gap-2"
      >
        <span>🎯</span>
        <span>Quick-Generate Bracket</span>
      </button>
    </div>
  )
}
