'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Trophy } from 'lucide-react'
import type { Match } from '@/types/tournament'
import { useBracketStore, type ActiveTab } from '@/store/bracketStore'
import { BracketMatch } from './BracketMatch'
import { TrophyAnimation } from '@/components/effects/TrophyAnimation'
import { isRoundComplete } from '@/lib/knockout'

// Match dates for the real 2026 WC schedule
const MATCH_DATES: Record<string, string> = {
  'r32-m1': 'Mon, Jun 29 · 23:30',
  'r32-m2': 'Tue, Jun 30 · 02:00',
  'r32-m3': 'Wed, Jul 1 · 00:00',
  'r32-m4': 'Wed, Jul 1 · 02:30',
  'r32-m5': 'Thu, Jul 1 · 22:00',
  'r32-m6': 'Fri, Jul 2 · 00:30',
  'r32-m7': 'Thu, Jul 2 · 22:00',
  'r32-m8': 'Fri, Jul 2 · 03:00',
  'r32-m9': 'Fri, Jul 3 · 02:00',
  'r32-m10': 'Sat, Jul 3 · 22:00',
  'r32-m11': 'Sat, Jul 4 · 20:00',
  'r32-m12': 'Sun, Jul 4 · 20:00',
  'r32-m13': 'Sun, Jun 28 · 22:00',
  'r32-m14': 'Tue, Jun 30 · 04:00',
  'r32-m15': 'Tue, Jun 30 · 04:00',
  'r32-m16': 'Mon, Jun 29 · 22:00',
  'round_of_16-m1': 'Sun, Jul 5 · 00:00',
  'round_of_16-m2': 'Sun, Jul 5 · 23:00',
  'round_of_16-m3': 'Sat, Jul 4 · 20:00',
  'round_of_16-m4': 'Mon, Jul 6 · 22:00',
  'round_of_16-m5': 'Mon, Jul 6 · 03:00',
  'round_of_16-m6': 'Tue, Jul 7 · 03:00',
  'round_of_16-m7': 'Sun, Jul 5 · 23:00',
  'round_of_16-m8': 'Tue, Jul 7 · 19:00',
  'quarter_final-m1': 'Thu, Jul 9 · 23:00',
  'quarter_final-m2': 'Fri, Jul 10 · 22:00',
  'quarter_final-m3': 'Tue, Jul 14 · 22:00',
  'quarter_final-m4': 'Wed, Jul 15 · 22:00',
  'semi_final-m1': 'Tue, Jul 14 · 22:00',
  'semi_final-m2': 'Wed, Jul 15 · 22:00',
  'final-m1': 'Sun, Jul 19 · 22:00',
  'third-place-m1': 'Sun, Jul 19 · 00:00',
}

type RoundDef = {
  tab: ActiveTab
  roundKey: string
  label: string
  nextRoundKey?: string
  nextLabel?: string
}

const ROUND_DEFS: RoundDef[] = [
  { tab: 'R32', roundKey: 'roundOf32', label: 'Round of 32', nextRoundKey: 'roundOf16', nextLabel: 'Round of 16' },
  { tab: 'R16', roundKey: 'roundOf16', label: 'Round of 16', nextRoundKey: 'quarterFinals', nextLabel: 'Quarter-Finals' },
  { tab: 'QF', roundKey: 'quarterFinals', label: 'Quarter-Finals', nextRoundKey: 'semiFinals', nextLabel: 'Semi-Finals' },
  { tab: 'SF', roundKey: 'semiFinals', label: 'Semi-Finals', nextRoundKey: 'final', nextLabel: 'Final' },
  { tab: 'F', roundKey: 'final', label: 'Final' },
]

export function BracketView({ activeTab }: { activeTab: ActiveTab }) {
  const { tournament, simulateRound, generateKnockout } = useBracketStore()
  if (!tournament) return null

  const knockout = tournament.knockout
  const hasR32 = knockout.roundOf32.length > 0

  if (!hasR32) {
    return <NoBracketState onGenerate={generateKnockout} />
  }

  if (activeTab === 'F') {
    return <FinalView />
  }

  const def = ROUND_DEFS.find(r => r.tab === activeTab)
  if (!def) return null

  const currentMatches = (knockout as any)[def.roundKey] as Match[]
  const nextMatches = def.nextRoundKey
    ? ((knockout as any)[def.nextRoundKey] as Match[])
    : []

  return (
    <StaggeredBracket
      currentMatches={currentMatches}
      nextMatches={nextMatches}
      currentRoundKey={def.roundKey}
      nextRoundKey={def.nextRoundKey ?? ''}
      currentLabel={def.label}
      nextLabel={def.nextLabel ?? ''}
      onSimulateAll={() => simulateRound(def.roundKey)}
    />
  )
}

type StaggeredBracketProps = {
  currentMatches: Match[]
  nextMatches: Match[]
  currentRoundKey: string
  nextRoundKey: string
  currentLabel: string
  nextLabel: string
  onSimulateAll: () => void
}

function StaggeredBracket({
  currentMatches,
  nextMatches,
  currentRoundKey,
  nextRoundKey,
  currentLabel,
  nextLabel,
  onSimulateAll,
}: StaggeredBracketProps) {
  const { simulateRound } = useBracketStore()
  const hasUnplayed = currentMatches.some(m => m.status === 'not_played')
  const roundDone = isRoundComplete(currentMatches)

  // Pair up current matches: [0,1] -> next[0], [2,3] -> next[1], etc.
  const pairs: { left: [Match, Match | null]; right: Match | null }[] = []
  for (let i = 0; i < currentMatches.length; i += 2) {
    pairs.push({
      left: [currentMatches[i], currentMatches[i + 1] ?? null],
      right: nextMatches[Math.floor(i / 2)] ?? null,
    })
  }

  return (
    <div className="px-4 pb-8">
      {/* Round header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{currentLabel}</div>
          <div className="text-white/25 text-[10px]">
            {currentMatches.filter(m => m.status === 'played').length}/{currentMatches.length} decided
          </div>
        </div>
        {hasUnplayed && (
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onSimulateAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <Shuffle size={12} className="text-white/70" />
            <span className="text-white/70">Sim All</span>
          </motion.button>
        )}
      </div>

      {/* Staggered bracket pairs */}
      <div className="space-y-3">
        {pairs.map((pair, pairIdx) => (
          <BracketPair
            key={pairIdx}
            leftMatch1={pair.left[0]}
            leftMatch2={pair.left[1]}
            rightMatch={pair.right}
            leftRoundKey={currentRoundKey}
            rightRoundKey={nextRoundKey}
          />
        ))}
      </div>

      {/* Next round CTA */}
      <AnimatePresence>
        {roundDone && nextMatches.length === 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => simulateRound(currentRoundKey)}
            className="w-full mt-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm"
            style={{
              background: 'rgba(212,168,67,0.2)',
              border: '1px solid rgba(212,168,67,0.4)',
            }}
          >
            <Trophy size={16} className="text-[#D4A843]" />
            <span className="text-[#D4A843]">Generate {nextLabel || 'Next Round'}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

type BracketPairProps = {
  leftMatch1: Match
  leftMatch2: Match | null
  rightMatch: Match | null
  leftRoundKey: string
  rightRoundKey: string
}

function BracketPair({
  leftMatch1,
  leftMatch2,
  rightMatch,
  leftRoundKey,
  rightRoundKey,
}: BracketPairProps) {
  const date1 = MATCH_DATES[leftMatch1.id] ?? ''
  const date2 = leftMatch2 ? (MATCH_DATES[leftMatch2.id] ?? '') : ''
  const dateRight = rightMatch ? (MATCH_DATES[rightMatch.id] ?? '') : ''

  return (
    <div className="flex gap-2 items-stretch">
      {/* Left column: two stacked matches */}
      <div className="flex-1 flex flex-col gap-2">
        <BracketMatch
          match={leftMatch1}
          roundKey={leftRoundKey}
          dateLabel={date1}
          showHypeOnHover
        />
        {leftMatch2 && (
          <BracketMatch
            match={leftMatch2}
            roundKey={leftRoundKey}
            dateLabel={date2}
            showHypeOnHover
          />
        )}
      </div>

      {/* Connector area - thin vertical line */}
      <div className="w-3 flex flex-col items-center justify-center py-6 pointer-events-none">
        <div
          className="w-px flex-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        />
      </div>

      {/* Right column: one match, centered */}
      <div className="flex-1 flex flex-col justify-center">
        {rightMatch ? (
          <BracketMatch
            match={rightMatch}
            roundKey={rightRoundKey}
            dateLabel={dateRight}
            showHypeOnHover
          />
        ) : (
          <div
            className="rounded-xl p-3 flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.08)',
              minHeight: 76,
            }}
          >
            <span className="text-white/20 text-[11px]">Locked</span>
          </div>
        )}
      </div>
    </div>
  )
}

function FinalView() {
  const { tournament, simulateRound } = useBracketStore()
  if (!tournament) return null

  const finalMatch = tournament.knockout.final[0]
  const thirdPlace = tournament.knockout.thirdPlace[0]
  const sfDone = isRoundComplete(tournament.knockout.semiFinals)

  return (
    <div className="px-4 pb-8">
      <TrophyAnimation />

      {finalMatch ? (
        <>
          {/* Third place */}
          {thirdPlace && (
            <div className="mb-5">
              <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">
                Third Place Match
              </div>
              <BracketMatch
                match={thirdPlace}
                roundKey="thirdPlace"
                dateLabel={MATCH_DATES['third-place-m1'] ?? 'Sun, Jul 19 · 00:00'}
              />
            </div>
          )}

          {/* The Final */}
          <div className="mb-3">
            <div className="text-[#D4A843]/80 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Trophy size={10} className="text-[#D4A843]" />
              Final
            </div>
            <BracketMatch
              match={finalMatch}
              roundKey="final"
              dateLabel={MATCH_DATES['final-m1'] ?? 'Sun, Jul 19 · 22:00'}
            />
          </div>

          {finalMatch.status === 'not_played' && (
            <button
              onClick={() => simulateRound('final')}
              className="w-full mt-3 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{
                background: 'rgba(212,168,67,0.2)',
                border: '1px solid rgba(212,168,67,0.4)',
              }}
            >
              <span className="text-[#D4A843]">Simulate Final</span>
            </button>
          )}
        </>
      ) : !sfDone ? (
        <div className="text-center py-8">
          <p className="text-white/30 text-sm">Complete the Semi-Finals first</p>
        </div>
      ) : null}
    </div>
  )
}

function NoBracketState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="px-4 flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="text-5xl mb-4"
      >
        🔒
      </motion.div>
      <h3 className="text-white font-bold text-base mb-2">Bracket Locked</h3>
      <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
        Complete all 72 group stage matches to unlock the Round of 32.
      </p>
      <button
        onClick={onGenerate}
        className="px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2"
        style={{
          background: 'rgba(10,132,255,0.15)',
          border: '1px solid rgba(10,132,255,0.3)',
          color: '#0A84FF',
        }}
      >
        Quick-Generate Bracket
      </button>
    </div>
  )
}
