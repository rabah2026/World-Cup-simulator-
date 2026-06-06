'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap, Loader2 } from 'lucide-react'
import type { Tournament, Group } from '@/types/tournament'
import { calculateStandings, applyQualificationStatus, areAllGroupMatchesPlayed } from '@/lib/standings'
import { simulateAllGroupMatches } from '@/lib/simulator'
import { GroupCard } from './GroupCard'

type GroupsScreenProps = {
  tournament: Tournament
  onUpdate: (t: Tournament) => void
}

export function GroupsScreen({ tournament, onUpdate }: GroupsScreenProps) {
  const allComplete = useMemo(() => areAllGroupMatchesPlayed(tournament.groups), [tournament.groups])
  const knockoutGenerated = tournament.knockout.roundOf32.length > 0

  const handleGroupUpdate = (updated: Group) => {
    const newGroups = tournament.groups.map((g) => g.id === updated.id ? updated : g)
    onUpdate({ ...tournament, groups: newGroups, updatedAt: new Date().toISOString() })
  }

  const handleSimulateAll = () => {
    const newGroups = tournament.groups.map((g) => simulateAllGroupMatches(g))
    onUpdate({ ...tournament, groups: newGroups, stage: 'group_stage_complete', updatedAt: new Date().toISOString() })
    // AppShell.handleTournamentUpdate detects completion and auto-navigates to knockout
  }

  const played = tournament.groups.reduce((sum, g) => sum + g.matches.filter((m) => m.status === 'played').length, 0)
  const total = tournament.groups.reduce((sum, g) => sum + g.matches.length, 0)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D084] animate-pulse" />
            <span className="text-xs text-[#00D084] font-semibold uppercase tracking-widest">Group Stage</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">12 Groups</h1>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-[#00D084]"
                initial={{ width: 0 }}
                animate={{ width: `${(played / total) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs text-white/40 shrink-0">{played}/{total} played</span>
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="px-5 flex gap-3 mb-4">
        {!allComplete && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSimulateAll}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D6A84F]/10 border border-[#D6A84F]/25 text-[#D6A84F] text-sm font-semibold"
          >
            <Zap size={15} />
            Simulate All Groups
          </motion.button>
        )}
        {allComplete && !knockoutGenerated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass border border-[#00D084]/30 text-[#00D084] text-sm font-semibold"
          >
            <Loader2 size={14} className="animate-spin" />
            Generating bracket...
          </motion.div>
        )}
        {knockoutGenerated && (
          <div className="flex-1 text-center py-3 rounded-xl glass text-xs text-[#00D084] font-semibold">
            Round of 32 generated — go to Bracket
          </div>
        )}
      </div>

      {/* Group cards */}
      <div className="px-5 flex flex-col gap-3 pb-6">
        {tournament.groups.map((group, i) => {
          const rawStandings = calculateStandings(group)
          const standings = applyQualificationStatus(rawStandings, allComplete)
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <GroupCard
                group={group}
                standings={standings}
                onGroupUpdate={handleGroupUpdate}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
