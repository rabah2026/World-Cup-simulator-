'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Shuffle } from 'lucide-react'
import { useBracketStore } from '@/store/bracketStore'
import { simulateGroupMatch } from '@/lib/simulator'
import { areAllGroupMatchesPlayed } from '@/lib/standings'
import { GroupCard } from './GroupCard'

export function GroupStageView() {
  const { tournament, setActiveTab, simulateGroupStage, generateKnockout } = useBracketStore()
  const [isSimulating, setIsSimulating] = useState(false)

  if (!tournament) return null

  const allPlayed = areAllGroupMatchesPlayed(tournament.groups)
  const hasKnockout = tournament.knockout.roundOf32.length > 0

  const handleSimulateGroup = (groupId: string) => {
    const { tournament: t } = useBracketStore.getState()
    if (!t) return
    const updatedGroups = t.groups.map((g) =>
      g.id === groupId
        ? { ...g, matches: g.matches.map((m) => m.status === 'not_played' ? simulateGroupMatch(m) : m) }
        : g
    )
    const allDone = updatedGroups.every((g) => g.matches.every((m) => m.status === 'played'))
    useBracketStore.setState({
      tournament: {
        ...t,
        groups: updatedGroups,
        stage: allDone ? 'group_stage_complete' : t.stage,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const handleSimulateMatch = (matchId: string, groupId: string) => {
    const { tournament: t } = useBracketStore.getState()
    if (!t) return
    const updatedGroups = t.groups.map((g) =>
      g.id !== groupId ? g : {
        ...g,
        matches: g.matches.map((m) =>
          m.id === matchId && m.status === 'not_played' ? simulateGroupMatch(m) : m
        ),
      }
    )
    const allDone = updatedGroups.every((g) => g.matches.every((m) => m.status === 'played'))
    useBracketStore.setState({
      tournament: {
        ...t,
        groups: updatedGroups,
        stage: allDone ? 'group_stage_complete' : t.stage,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const handleSimulateAll = async () => {
    setIsSimulating(true)
    await new Promise((r) => setTimeout(r, 100))
    simulateGroupStage()
    setIsSimulating(false)
  }

  return (
    <div className="px-4 pb-8">
      {/* Stats bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 glass rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-white/40 text-[11px]">Teams</span>
          <span className="text-white font-black text-sm">48</span>
        </div>
        <div className="flex-1 glass rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-white/40 text-[11px]">Groups</span>
          <span className="text-white font-black text-sm">A–L</span>
        </div>
        <div className="flex-1 glass rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-white/40 text-[11px]">Played</span>
          <span className="text-white font-black text-sm">
            {tournament.groups.reduce((sum, g) => sum + g.matches.filter(m => m.status === 'played').length, 0)}/72
          </span>
        </div>
      </div>

      {/* Action buttons */}
      {!allPlayed && (
        <motion.button
          onClick={handleSimulateAll}
          disabled={isSimulating}
          whileTap={{ scale: 0.97 }}
          className="w-full mb-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(10,132,255,0.2), rgba(94,92,230,0.15))',
            border: '1px solid rgba(10,132,255,0.3)',
          }}
        >
          {isSimulating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            >
              <Shuffle size={16} className="text-[#0A84FF]" />
            </motion.div>
          ) : (
            <Shuffle size={16} className="text-[#0A84FF]" />
          )}
          <span className="text-[#0A84FF]">Simulate All Group Stage Matches</span>
        </motion.button>
      )}

      {/* Generate bracket CTA */}
      {allPlayed && !hasKnockout && (
        <motion.button
          onClick={generateKnockout}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(212,168,67,0.25), rgba(212,168,67,0.1))',
            border: '1px solid rgba(212,168,67,0.4)',
          }}
        >
          <span className="text-2xl">🏆</span>
          <span className="text-[#D4A843]">Generate Round of 32</span>
          <ArrowRight size={16} className="text-[#D4A843]" />
        </motion.button>
      )}

      {allPlayed && hasKnockout && (
        <motion.button
          onClick={() => setActiveTab('R32')}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm glass-gold"
        >
          <span className="text-[#D4A843]">View Knockout Bracket</span>
          <ArrowRight size={16} className="text-[#D4A843]" />
        </motion.button>
      )}

      {/* Groups grid */}
      <div className="space-y-3">
        {tournament.groups.map((group, i) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, ease: 'easeOut' }}
          >
            <GroupCard
              group={group}
              onSimulateMatch={(matchId) => handleSimulateMatch(matchId, group.id)}
              onSimulateGroup={() => handleSimulateGroup(group.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
