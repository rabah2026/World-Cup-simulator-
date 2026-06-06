'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SkipForward, ChevronRight } from 'lucide-react'
import type { Match } from '@/types/tournament'
import {
  generateGoalEvents,
  goalLine,
  pick,
  COMMENTARY_KICKOFF,
  COMMENTARY_PLAYING,
} from '@/lib/matchEvents'
import { getKnockoutRoundLabel, cn } from '@/lib/utils'

type Phase = 'kickoff' | 'playing' | 'fulltime' | 'penalties' | 'done'

const STEP_MS = 56 // ms per match-minute (~5s for 90')

type LiveMatchModalProps = {
  match: Match
  onComplete: () => void
}

export function LiveMatchModal({ match, onComplete }: LiveMatchModalProps) {
  const events = useMemo(() => generateGoalEvents(match), [match])
  const hasPens = !!match.penaltyWinnerId

  const [minute, setMinute] = useState(0)
  const [phase, setPhase] = useState<Phase>('kickoff')
  const [commentary, setCommentary] = useState(() => pick(COMMENTARY_KICKOFF))
  const [flash, setFlash] = useState<'A' | 'B' | null>(null)

  // Kick-off -> playing
  useEffect(() => {
    const t = setTimeout(() => setPhase('playing'), 1100)
    return () => clearTimeout(t)
  }, [])

  // Match clock
  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(() => {
      setMinute((m) => (m >= 90 ? 90 : m + 1))
    }, STEP_MS)
    return () => clearInterval(id)
  }, [phase])

  // 90' -> full time
  useEffect(() => {
    if (phase === 'playing' && minute >= 90) setPhase('fulltime')
  }, [minute, phase])

  // Goals + commentary
  useEffect(() => {
    if (phase !== 'playing' || minute === 0) return
    const goal = events.find((e) => e.minute === minute)
    if (goal) {
      setFlash(goal.side)
      setCommentary(goalLine(goal.teamShort))
      const t = setTimeout(() => setFlash(null), 750)
      return () => clearTimeout(t)
    }
    if (minute % 17 === 0) setCommentary(pick(COMMENTARY_PLAYING))
  }, [minute, phase, events])

  // Full time -> penalties or done
  useEffect(() => {
    if (phase !== 'fulltime') return
    const t = setTimeout(() => setPhase(hasPens ? 'penalties' : 'done'), 1300)
    return () => clearTimeout(t)
  }, [phase, hasPens])

  const skip = () => {
    setMinute(90)
    setFlash(null)
    setPhase('fulltime')
  }

  const dispA = phase === 'kickoff' ? 0 : events.filter((e) => e.side === 'A' && e.minute <= minute).length
  const dispB = phase === 'kickoff' ? 0 : events.filter((e) => e.side === 'B' && e.minute <= minute).length
  const visibleEvents = events.filter((e) => e.minute <= minute)

  const winner = match.winnerId === match.teamA?.id ? match.teamA : match.winnerId === match.teamB?.id ? match.teamB : null
  const loser = winner?.id === match.teamA?.id ? match.teamB : match.teamA
  const isUpset = !!winner && !!loser && winner.strength < loser.strength - 4

  const showContinue = (phase === 'fulltime' && !hasPens) || phase === 'penalties' || phase === 'done'
  const roundLabel = match.groupId ? `Group ${match.groupId} · Matchday ${match.matchday}` : getKnockoutRoundLabel(match.round)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center px-5"
      style={{
        background:
          'radial-gradient(circle at 50% 25%, rgba(0,208,132,0.12) 0%, transparent 55%), linear-gradient(180deg, rgba(5,7,13,0.97) 0%, rgba(7,17,13,0.99) 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Skip */}
      {phase !== 'done' && !showContinue && (
        <button
          onClick={skip}
          className="absolute top-6 right-5 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 transition-colors glass px-3 py-1.5 rounded-lg"
        >
          <SkipForward size={12} /> Skip
        </button>
      )}

      {/* Broadcast bar */}
      <div className="flex items-center gap-2 mb-6">
        <AnimatePresence mode="wait">
          {phase === 'playing' || phase === 'kickoff' ? (
            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-red-400 tracking-[0.25em] uppercase">Live</span>
            </motion.div>
          ) : (
            <motion.span key="ft" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[10px] font-black text-[#D6A84F] tracking-[0.25em] uppercase">
              Full Time
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Round label */}
      <div className="text-[10px] text-white/30 uppercase tracking-widest mb-4">{roundLabel}</div>

      {/* Scoreboard */}
      <div className="glass rounded-3xl px-5 py-6 w-full max-w-sm relative overflow-hidden">
        {/* Goal flash */}
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <span className="text-3xl font-black text-[#00D084] text-glow-green">GOAL!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          {/* Team A */}
          <div className="flex flex-col items-center gap-1.5 w-24">
            <span className="text-4xl">{match.teamA?.flagEmoji}</span>
            <span className="text-sm font-black text-white text-center">{match.teamA?.shortName}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <motion.span key={`a-${dispA}`} initial={{ scale: 1.6 }} animate={{ scale: 1 }}
                className={cn('text-5xl font-black', flash === 'A' ? 'text-[#00D084]' : 'text-white')}>
                {dispA}
              </motion.span>
              <span className="text-2xl text-white/20 font-light">:</span>
              <motion.span key={`b-${dispB}`} initial={{ scale: 1.6 }} animate={{ scale: 1 }}
                className={cn('text-5xl font-black', flash === 'B' ? 'text-[#00D084]' : 'text-white')}>
                {dispB}
              </motion.span>
            </div>
            <div className="mt-2 text-xs font-bold text-[#D6A84F] tabular-nums">
              {phase === 'kickoff' ? "0'" : phase === 'fulltime' || phase === 'penalties' || phase === 'done' ? "90'" : `${minute}'`}
            </div>
          </div>

          {/* Team B */}
          <div className="flex flex-col items-center gap-1.5 w-24">
            <span className="text-4xl">{match.teamB?.flagEmoji}</span>
            <span className="text-sm font-black text-white text-center">{match.teamB?.shortName}</span>
          </div>
        </div>

        {/* Clock progress */}
        <div className="mt-5 w-full h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-[#00D084] to-[#D6A84F]"
            animate={{ width: `${(minute / 90) * 100}%` }} transition={{ ease: 'linear' }} />
        </div>
      </div>

      {/* Penalties */}
      <AnimatePresence>
        {(phase === 'penalties' || (phase === 'done' && hasPens)) && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="glass-gold rounded-2xl px-5 py-3 mt-4 w-full max-w-sm text-center">
            <div className="text-[10px] font-black text-[#D6A84F] tracking-widest uppercase mb-1">Penalty Shootout</div>
            <div className="text-lg font-black text-white">
              {match.teamA?.shortName} {match.penaltyScoreA} – {match.penaltyScoreB} {match.teamB?.shortName}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal feed */}
      <div className="w-full max-w-sm mt-4 min-h-[60px] flex flex-col gap-1.5">
        <AnimatePresence>
          {visibleEvents.map((e) => (
            <motion.div
              key={`${e.teamId}-${e.minute}`}
              initial={{ opacity: 0, x: e.side === 'A' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn('flex items-center gap-2 text-xs', e.side === 'B' && 'flex-row-reverse text-right')}
            >
              <span className="text-[#D6A84F] font-bold tabular-nums">{e.minute}&apos;</span>
              <span>{e.flag}</span>
              <span className="text-white/70 font-semibold">⚽ {e.teamShort}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Commentary ticker */}
      <div className="h-6 mt-3">
        <AnimatePresence mode="wait">
          <motion.p key={commentary} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="text-sm text-white/50 italic text-center">
            {commentary}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Upset badge */}
      <AnimatePresence>
        {isUpset && showContinue && (
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            className="mt-4 glass rounded-full px-4 py-1.5 border border-[#D6A84F]/40">
            <span className="text-xs font-black text-[#D6A84F] tracking-wide">🔥 UPSET! {winner?.shortName} stun {loser?.shortName}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      <AnimatePresence>
        {showContinue && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.96 }}
            onClick={onComplete}
            className="mt-6 flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-[#00D084] text-black font-bold text-sm glow-green"
          >
            Continue <ChevronRight size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
