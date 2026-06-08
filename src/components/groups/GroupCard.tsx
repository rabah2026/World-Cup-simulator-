'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Group } from '@/types/tournament'
import { calculateStandings } from '@/lib/standings'
import { cn } from '@/lib/utils'

type Props = {
  group: Group
  onSimulateMatch?: (matchId: string) => void
  onSimulateGroup?: () => void
}

export function GroupCard({ group, onSimulateMatch, onSimulateGroup }: Props) {
  const [expanded, setExpanded] = useState(false)
  const standings = calculateStandings(group)
  const allPlayed = group.matches.every((m) => m.status === 'played')
  const anyPlayed = group.matches.some((m) => m.status === 'played')

  return (
    <motion.div
      layout
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Group header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center">
            <span className="text-white font-black text-sm">{group.id}</span>
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-sm">Group {group.id}</div>
            <div className="text-white/35 text-[10px]">
              {allPlayed ? 'Complete ✓' : anyPlayed ? `${group.matches.filter(m => m.status === 'played').length}/${group.matches.length} played` : '4 teams'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!allPlayed && (
            <button
              onClick={(e) => { e.stopPropagation(); onSimulateGroup?.() }}
              className="text-[11px] font-semibold text-[#0A84FF] bg-[#0A84FF]/10 border border-[#0A84FF]/20 px-2.5 py-1 rounded-lg"
            >
              Sim All
            </button>
          )}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-white/30" />
          </motion.div>
        </div>
      </button>

      {/* Standings table — always visible */}
      <div className="px-4 pb-1">
        {/* Column headers */}
        <div className="flex items-center text-[9px] font-bold text-white/25 uppercase tracking-wider mb-1 px-1">
          <span className="flex-1">Team</span>
          <span className="w-6 text-center">P</span>
          <span className="w-6 text-center">W</span>
          <span className="w-6 text-center">D</span>
          <span className="w-6 text-center">L</span>
          <span className="w-8 text-center">GD</span>
          <span className="w-7 text-center font-black">Pts</span>
        </div>

        <div className="space-y-0.5">
          {standings.map((s, idx) => {
            const isQualified = s.rank <= 2
            const isThird = s.rank === 3
            const isEliminated = s.rank === 4 && allPlayed

            return (
              <motion.div
                key={s.team.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  'flex items-center py-1.5 px-1 rounded-lg text-[12px]',
                  isQualified && allPlayed && 'bg-[#30D158]/8',
                  isEliminated && 'opacity-40',
                )}
              >
                {/* Rank indicator */}
                <div className="w-4 mr-2 flex items-center justify-center">
                  {isQualified && allPlayed ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />
                  ) : isThird && allPlayed ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
                  ) : (
                    <span className="text-[9px] text-white/20">{idx + 1}</span>
                  )}
                </div>

                <span className="text-lg mr-2 leading-none">{s.team.flagEmoji}</span>
                <span
                  className={cn(
                    'flex-1 font-semibold truncate',
                    isQualified && allPlayed ? 'text-white' : 'text-white/70',
                  )}
                >
                  {s.team.shortName}
                </span>
                <span className="w-6 text-center text-white/40">{s.played}</span>
                <span className="w-6 text-center text-white/60">{s.won}</span>
                <span className="w-6 text-center text-white/40">{s.drawn}</span>
                <span className="w-6 text-center text-white/40">{s.lost}</span>
                <span className={cn(
                  'w-8 text-center',
                  s.goalDifference > 0 ? 'text-[#30D158]' : s.goalDifference < 0 ? 'text-[#FF453A]/70' : 'text-white/40',
                )}>
                  {s.goalDifference > 0 ? '+' : ''}{s.goalDifference}
                </span>
                <span className={cn(
                  'w-7 text-center font-black',
                  isQualified && allPlayed ? 'text-[#30D158]' : 'text-white/80',
                )}>
                  {s.points}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Matches (expandable) */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-4 pt-2 pb-3 space-y-2 border-t border-white/5">
          <div className="text-[9px] font-bold text-white/25 uppercase tracking-wider">Fixtures</div>
          {group.matches.map((match) => (
            <GroupMatchRow
              key={match.id}
              match={match}
              onSimulate={() => onSimulateMatch?.(match.id)}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function GroupMatchRow({ match, onSimulate }: { match: any; onSimulate: () => void }) {
  const played = match.status === 'played'
  const aWon = played && match.scoreA > match.scoreB
  const bWon = played && match.scoreB > match.scoreA

  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex-1 flex items-center gap-1.5 justify-end">
        <span className={cn('text-[11px] font-semibold', aWon ? 'text-white' : 'text-white/50')}>
          {match.teamA?.shortName ?? '?'}
        </span>
        <span className="text-sm">{match.teamA?.flagEmoji ?? '🏳️'}</span>
      </div>

      <div className="flex items-center gap-1 min-w-[52px] justify-center">
        {played ? (
          <>
            <span className={cn('text-sm font-black', aWon ? 'text-white' : 'text-white/50')}>{match.scoreA}</span>
            <span className="text-white/20 text-xs">–</span>
            <span className={cn('text-sm font-black', bWon ? 'text-white' : 'text-white/50')}>{match.scoreB}</span>
          </>
        ) : (
          <button
            onClick={onSimulate}
            className="text-[10px] font-bold text-[#0A84FF] bg-[#0A84FF]/10 border border-[#0A84FF]/15 px-2 py-0.5 rounded-md"
          >
            Play
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center gap-1.5">
        <span className="text-sm">{match.teamB?.flagEmoji ?? '🏳️'}</span>
        <span className={cn('text-[11px] font-semibold', bWon ? 'text-white' : 'text-white/50')}>
          {match.teamB?.shortName ?? '?'}
        </span>
      </div>
    </div>
  )
}

