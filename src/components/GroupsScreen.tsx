'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Zap, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import type { Tournament, Group } from '@/types/tournament'
import { calculateStandings, applyQualificationStatus, areAllGroupMatchesPlayed } from '@/lib/standings'
import { simulateAllGroupMatches } from '@/lib/simulator'
import { GroupCard } from './GroupCard'
import { TopHeader } from './TopHeader'
import { GROUP_ORDER } from '@/lib/worldCup2026'

type GroupsScreenProps = {
  tournament: Tournament
  onUpdate: (t: Tournament) => void
  onGenerateKnockout: () => void
  showToast: (msg: string) => void
}

export function GroupsScreen({ tournament, onUpdate, onGenerateKnockout, showToast }: GroupsScreenProps) {
  const allComplete = useMemo(() => areAllGroupMatchesPlayed(tournament.groups), [tournament.groups])
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const expandAll = () => setOpenGroups(new Set(tournament.groups.map((g) => g.id)))
  const collapseAll = () => setOpenGroups(new Set())
  const allOpen = openGroups.size === tournament.groups.length

  const jump = (id: string) => {
    setOpenGroups((prev) => new Set(prev).add(id))
    setTimeout(() => {
      document.getElementById(`group-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const handleGroupUpdate = (updated: Group) => {
    const newGroups = tournament.groups.map((g) => (g.id === updated.id ? updated : g))
    onUpdate({ ...tournament, groups: newGroups, updatedAt: new Date().toISOString() })
  }

  const handleSimulateAll = () => {
    const newGroups = tournament.groups.map((g) => simulateAllGroupMatches(g))
    onUpdate({ ...tournament, groups: newGroups, stage: 'group_stage_complete', updatedAt: new Date().toISOString() })
    showToast('Group stage complete. Third-place race decided.')
  }

  const completionById = useMemo(() => {
    const map: Record<string, boolean> = {}
    for (const g of tournament.groups) map[g.id] = g.matches.every((m) => m.status === 'played')
    return map
  }, [tournament.groups])

  return (
    <div className="min-h-screen">
      <TopHeader
        tournament={tournament}
        eyebrow="Group Stage"
        title="12 Groups"
        subtitle="Top 2 of each group advance automatically"
      />

      {/* Quick-jump chips */}
      <div className="px-5 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {GROUP_ORDER.map((id) => (
            <button
              key={id}
              onClick={() => jump(id)}
              className="shrink-0 flex items-center gap-1.5 glass rounded-lg px-2.5 py-1.5"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: completionById[id] ? '#00D084' : 'rgba(255,255,255,0.25)' }}
              />
              <span className="text-xs font-bold text-white/70">{id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Legend + expand control */}
      <div className="px-5 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {[
            { c: '#00D084', l: 'Qualify' },
            { c: '#D6A84F', l: '3rd place' },
            { c: '#64748B', l: 'Out' },
          ].map(({ c, l }) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />
              <span className="text-[10px] text-white/40">{l}</span>
            </div>
          ))}
        </div>
        <button
          onClick={allOpen ? collapseAll : expandAll}
          className="flex items-center gap-1.5 text-[11px] text-white/50 font-medium glass px-2.5 py-1.5 rounded-lg"
        >
          {allOpen ? <ChevronsDownUp size={12} /> : <ChevronsUpDown size={12} />}
          {allOpen ? 'Collapse' : 'Expand all'}
        </button>
      </div>

      {/* Primary action */}
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
        {allComplete && tournament.knockout.roundOf32.length === 0 && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onGenerateKnockout}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00D084] text-black text-sm font-bold glow-green"
          >
            Generate Round of 32
            <ChevronRight size={16} />
          </motion.button>
        )}
        {allComplete && tournament.knockout.roundOf32.length > 0 && (
          <div className="flex-1 text-center py-3 rounded-xl glass text-xs text-[#00D084] font-semibold">
            Round of 32 generated — open the Bracket
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
              id={`group-${group.id}`}
              className="scroll-mt-header"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
            >
              <GroupCard
                group={group}
                standings={standings}
                onGroupUpdate={handleGroupUpdate}
                expanded={openGroups.has(group.id)}
                onToggle={() => toggle(group.id)}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
