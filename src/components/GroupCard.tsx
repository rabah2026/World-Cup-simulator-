'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Zap, PlayCircle } from 'lucide-react'
import type { Group, Standing } from '@/types/tournament'
import { StandingsTable } from './StandingsTable'
import { MatchCard } from './MatchCard'
import { simulateGroupMatch } from '@/lib/simulator'
import { cn } from '@/lib/utils'

type GroupCardProps = {
  group: Group
  standings: Standing[]
  onGroupUpdate: (group: Group) => void
}

export function GroupCard({ group, standings, onGroupUpdate }: GroupCardProps) {
  const [expanded, setExpanded] = useState(false)

  const played = group.matches.filter((m) => m.status === 'played').length
  const total = group.matches.length
  const progress = played / total
  const complete = played === total

  const handleSimulateMatch = (matchId: string) => {
    const updated = {
      ...group,
      matches: group.matches.map((m) =>
        m.id === matchId && m.status === 'not_played' ? simulateGroupMatch(m) : m
      ),
    }
    onGroupUpdate(updated)
  }

  const handleSimulateAll = () => {
    const updated = {
      ...group,
      matches: group.matches.map((m) =>
        m.status === 'not_played' ? simulateGroupMatch(m) : m
      ),
    }
    onGroupUpdate(updated)
  }

  const handleResetMatch = (matchId: string) => {
    const updated = {
      ...group,
      matches: group.matches.map((m) =>
        m.id === matchId ? { ...m, scoreA: null, scoreB: null, winnerId: undefined, status: 'not_played' as const } : m
      ),
    }
    onGroupUpdate(updated)
  }

  return (
    <motion.div layout className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4"
      >
        {/* Group label */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: complete ? 'rgba(0,208,132,0.15)' : 'rgba(255,255,255,0.08)' }}
        >
          <span className={cn(
            'text-sm font-black',
            complete ? 'text-[#00D084]' : 'text-white',
          )}>G{group.id}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-bold text-white">{group.name}</span>
            <span className="text-xs text-white/40">{played}/{total}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1 rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[#00D084]"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-white/40" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-4">
              {/* Compact standings */}
              <StandingsTable standings={standings} compact />

              {/* Action buttons */}
              {!complete && (
                <button
                  onClick={handleSimulateAll}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D6A84F]/10 border border-[#D6A84F]/25 text-[#D6A84F] text-xs font-semibold"
                >
                  <Zap size={13} />
                  Simulate Full Group
                </button>
              )}

              {complete && (
                <div className="text-center text-xs text-[#00D084] font-medium py-1">
                  Group stage complete
                </div>
              )}

              {/* Match cards by matchday */}
              {[1, 2, 3].map((md) => {
                const mdMatches = group.matches.filter((m) => m.matchday === md)
                return (
                  <div key={md}>
                    <div className="flex items-center gap-2 mb-2">
                      <PlayCircle size={12} className="text-white/30" />
                      <span className="text-[10px] text-white/30 uppercase tracking-widest">Matchday {md}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {mdMatches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onSimulate={() => handleSimulateMatch(match.id)}
                          onReset={() => handleResetMatch(match.id)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
