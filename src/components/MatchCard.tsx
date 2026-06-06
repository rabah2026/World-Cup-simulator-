'use client'

import { motion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'
import type { Match } from '@/types/tournament'
import { cn } from '@/lib/utils'

type MatchCardProps = {
  match: Match
  onSimulate: () => void
  onReset?: () => void
  locked?: boolean
  knockout?: boolean
}

export function MatchCard({ match, onSimulate, onReset, locked = false, knockout = false }: MatchCardProps) {
  const played = match.status === 'played'
  const hasPenalties = played && match.penaltyWinnerId

  return (
    <motion.div
      layout
      className={cn(
        'glass rounded-2xl p-4 flex flex-col gap-3',
        played && 'border-white/10',
        locked && 'opacity-40 pointer-events-none',
      )}
    >
      {/* Match info row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
          {match.groupId ? `Group ${match.groupId} · MD${match.matchday}` : match.round.replace(/_/g, ' ')}
        </span>
        {played && onReset && (
          <button
            onClick={onReset}
            className="text-white/20 hover:text-white/60 transition-colors"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>

      {/* Score row */}
      <div className="flex items-center gap-2">
        {/* Team A */}
        <div className="flex-1 flex items-center gap-2">
          {match.teamA?.flagEmoji && <span className="text-xl">{match.teamA.flagEmoji}</span>}
          <div>
            <div className={cn(
              'font-bold text-sm',
              played && match.winnerId === match.teamA?.id ? 'text-white' : played ? 'text-white/40' : 'text-white',
            )}>
              {match.teamA?.shortName ?? 'TBD'}
            </div>
            {match.teamA && <div className="text-[9px] text-white/30 truncate max-w-[64px]">{match.teamA.name}</div>}
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-0.5">
          {played ? (
            <>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-2xl font-black',
                  match.winnerId === match.teamA?.id ? 'text-[#00D084]' : 'text-white/50',
                )}>
                  {match.scoreA}
                </span>
                <span className="text-white/20 font-light">:</span>
                <span className={cn(
                  'text-2xl font-black',
                  match.winnerId === match.teamB?.id ? 'text-[#00D084]' : 'text-white/50',
                )}>
                  {match.scoreB}
                </span>
              </div>
              {hasPenalties && (
                <span className="text-[9px] text-[#D6A84F] font-medium">
                  ({match.penaltyScoreA}-{match.penaltyScoreB} pens)
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-white/20 font-medium px-2">vs</span>
          )}
        </div>

        {/* Team B */}
        <div className="flex-1 flex items-center gap-2 justify-end">
          <div className="text-right">
            <div className={cn(
              'font-bold text-sm',
              played && match.winnerId === match.teamB?.id ? 'text-white' : played ? 'text-white/40' : 'text-white',
            )}>
              {match.teamB?.shortName ?? 'TBD'}
            </div>
            {match.teamB && <div className="text-[9px] text-white/30 truncate max-w-[64px]">{match.teamB.name}</div>}
          </div>
          {match.teamB?.flagEmoji && <span className="text-xl">{match.teamB.flagEmoji}</span>}
        </div>
      </div>

      {/* Simulate button */}
      {!played && !locked && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onSimulate}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#00D084]/15 border border-[#00D084]/30 text-[#00D084] text-sm font-semibold transition-all hover:bg-[#00D084]/20"
        >
          <Play size={13} fill="currentColor" />
          Simulate Match
        </motion.button>
      )}

      {played && knockout && match.teamA && match.teamB && (
        <div className="text-center text-[10px] text-[#00D084] font-medium">
          {match.winnerId === match.teamA?.id ? match.teamA.name : match.teamB.name} advances
        </div>
      )}
    </motion.div>
  )
}
