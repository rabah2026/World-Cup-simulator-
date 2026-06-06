'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Tournament } from '@/types/tournament'
import { getThirdPlacedStandings, areAllGroupMatchesPlayed } from '@/lib/standings'
import { EmptyState } from './EmptyState'
import { TopHeader } from './TopHeader'
import { cn } from '@/lib/utils'

type ThirdPlaceScreenProps = {
  tournament: Tournament
}

export function ThirdPlaceScreen({ tournament }: ThirdPlaceScreenProps) {
  const allComplete = useMemo(() => areAllGroupMatchesPlayed(tournament.groups), [tournament.groups])

  const thirds = useMemo(() => {
    const raw = getThirdPlacedStandings(tournament.groups)
    return [...raw]
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
        return b.goalsFor - a.goalsFor
      })
      .map((s, i) => ({ ...s, rank: i + 1 }))
  }, [tournament.groups])

  if (!allComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon="🏅"
          title="Third-Place Race Locked"
          description="Complete all 72 group-stage matches to reveal the third-place rankings and see which 8 teams join the Round of 32."
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <TopHeader
        tournament={tournament}
        eyebrow="Third-Place Race"
        title="Who Qualifies?"
        subtitle="Best 8 third-placed teams join the Round of 32"
        accent="gold"
      />

      <div className="px-5 mb-3">
        <div className="glass-green rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🏆</span>
          <div>
            <div className="text-xs font-bold text-[#00D084]">Top 8 Qualify</div>
            <div className="text-[10px] text-white/40">Positions 9 to 12 are eliminated</div>
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-2 pb-6">
        {thirds.map((s, i) => {
          const qualified = i < 8
          const cutLine = i === 7
          const groupId = tournament.groups.find((g) => g.teams.some((t) => t.id === s.team.id))?.id
          return (
            <div key={s.team.id}>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className={cn(
                  'rounded-2xl p-4 flex items-center gap-3',
                  qualified ? 'glass-green border border-[#00D084]/20' : 'glass border-white/[0.06] opacity-50',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0',
                    qualified ? 'bg-[#00D084]/20 text-[#00D084]' : 'bg-white/5 text-white/40',
                  )}
                >
                  {s.rank}
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {s.team.flagEmoji && <span className="text-xl">{s.team.flagEmoji}</span>}
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{s.team.name}</div>
                    <div className="text-[10px] text-white/40">Group {groupId}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center">
                    <div className={cn('text-base font-black', qualified ? 'text-[#00D084]' : 'text-white/40')}>{s.points}</div>
                    <div className="text-[9px] text-white/30">Pts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-white/60">
                      {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
                    </div>
                    <div className="text-[9px] text-white/30">GD</div>
                  </div>
                  <div
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[10px] font-bold',
                      qualified ? 'bg-[#00D084]/20 text-[#00D084]' : 'bg-white/5 text-white/30',
                    )}
                  >
                    {qualified ? 'Qualified' : 'Out'}
                  </div>
                </div>
              </motion.div>
              {cutLine && (
                <div className="flex items-center gap-2 my-2 px-2">
                  <div className="flex-1 h-px bg-red-500/30" />
                  <span className="text-[10px] text-red-400/60 font-medium">Elimination line</span>
                  <div className="flex-1 h-px bg-red-500/30" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
