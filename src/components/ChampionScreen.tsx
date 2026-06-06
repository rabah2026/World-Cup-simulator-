'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Share2, RotateCcw } from 'lucide-react'
import type { Tournament } from '@/types/tournament'
import { calculateStats } from '@/lib/stats'
import { cn } from '@/lib/utils'

type ChampionScreenProps = {
  tournament: Tournament
  onReset: () => void
  showToast: (msg: string) => void
}

function Particle({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: '10%', backgroundColor: color }}
      initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -80, 200, 600],
        x: [(x - 50) * 2, (x - 50) * 3],
        scale: [0, 1, 0.8, 0],
        rotate: [0, 180, 360],
      }}
      transition={{ delay, duration: 2.5, ease: 'easeOut' }}
    />
  )
}

const particleColors = ['#00D084', '#D6A84F', '#ffffff', '#60a5fa', '#f472b6', '#a78bfa']

export function ChampionScreen({ tournament, onReset, showToast }: ChampionScreenProps) {
  const stats = useMemo(() => calculateStats(tournament), [tournament])
  const { champion } = tournament

  const particles = useMemo(() => (
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: particleColors[i % particleColors.length],
      delay: i * 0.06,
    }))
  ), [])

  const handleShare = async () => {
    const text = [
      `🏆 World Cup 2026 Simulator`,
      ``,
      `Champion: ${champion?.name ?? 'Unknown'} ${champion?.flagEmoji ?? ''}`,
      `Runner-Up: ${stats.runnerUp?.name ?? 'Unknown'} ${stats.runnerUp?.flagEmoji ?? ''}`,
      `Third Place: ${stats.thirdPlace?.name ?? 'Unknown'} ${stats.thirdPlace?.flagEmoji ?? ''}`,
      ``,
      `Total Goals: ${stats.totalGoals}`,
      `Matches Played: ${stats.totalMatchesPlayed}`,
      ``,
      `Unofficial fan-made simulator. Not affiliated with FIFA.`,
    ].join('\n')

    try {
      if (navigator.share) {
        await navigator.share({ title: 'World Cup 2026 Simulator', text })
      } else {
        await navigator.clipboard.writeText(text)
        showToast('Result copied to clipboard!')
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text)
        showToast('Result copied to clipboard!')
      } catch {
        showToast('Share not available')
      }
    }
  }

  if (!champion) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-xl font-bold text-white mb-2">No Champion Yet</h2>
          <p className="text-sm text-white/40">Complete the Final to crown a champion.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* Champion glow backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96"
          style={{ background: 'radial-gradient(circle at 50% 30%, rgba(214,168,79,0.25) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-20 flex flex-col items-center px-5 pt-16 pb-12">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 glass-gold rounded-full px-5 py-2 mb-8"
        >
          <span className="text-xs font-black text-[#D6A84F] uppercase tracking-[0.2em]">World Cup 2026 Simulator</span>
        </motion.div>

        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: 'spring', damping: 12, stiffness: 180 }}
          className="text-8xl mb-4 select-none"
          style={{ filter: 'drop-shadow(0 0 30px rgba(214,168,79,0.8))' }}
        >
          🏆
        </motion.div>

        {/* CHAMPION heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-2"
        >
          <div className="text-xs font-black text-[#D6A84F]/60 tracking-[0.4em] uppercase mb-1">Champion</div>
          <div className="text-5xl mb-1">{champion.flagEmoji}</div>
          <h1 className="text-4xl font-black text-white text-glow-gold mb-1">
            {champion.name}
          </h1>
          <div className="text-sm text-[#D6A84F] font-semibold">{champion.shortName}</div>
        </motion.div>

        {/* Podium */}
        {(stats.runnerUp || stats.thirdPlace) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-end gap-2 mt-8 mb-8"
          >
            {/* 3rd */}
            <div className="glass rounded-2xl px-4 py-3 text-center w-28">
              <div className="text-lg mb-1">{stats.thirdPlace?.flagEmoji}</div>
              <div className="text-xs font-bold text-white/70">{stats.thirdPlace?.shortName}</div>
              <div className="text-[10px] text-white/30 mt-0.5">3rd Place</div>
            </div>

            {/* 1st */}
            <div className="glass-gold rounded-2xl px-4 py-4 text-center w-32 -mb-2">
              <div className="text-2xl mb-1">{champion.flagEmoji}</div>
              <div className="text-sm font-black text-[#D6A84F]">{champion.shortName}</div>
              <div className="text-[10px] text-[#D6A84F]/50 mt-0.5">🏆 Champion</div>
            </div>

            {/* 2nd */}
            <div className="glass rounded-2xl px-4 py-3 text-center w-28">
              <div className="text-lg mb-1">{stats.runnerUp?.flagEmoji}</div>
              <div className="text-xs font-bold text-white/70">{stats.runnerUp?.shortName}</div>
              <div className="text-[10px] text-white/30 mt-0.5">Runner-Up</div>
            </div>
          </motion.div>
        )}

        {/* Stats panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="w-full max-w-sm glass rounded-2xl p-5 mb-6"
        >
          <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Tournament Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Goals', value: stats.totalGoals },
              { label: 'Matches', value: stats.totalMatchesPlayed },
              { label: 'Top Scorer', value: stats.highestScoringTeam?.shortName ?? '—' },
              { label: 'Best Defense', value: stats.bestDefenseTeam?.shortName ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="glass rounded-xl p-3">
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {stats.biggestWin && (
            <div className="mt-3 glass rounded-xl p-3">
              <div className="text-[10px] text-white/30 mb-1">Biggest Win</div>
              <div className="text-sm font-bold text-white">
                {stats.biggestWin.teamA?.shortName} {stats.biggestWin.scoreA} – {stats.biggestWin.scoreB} {stats.biggestWin.teamB?.shortName}
              </div>
            </div>
          )}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col gap-3 w-full max-w-sm"
        >
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#D6A84F] text-black font-bold text-sm"
          >
            <Share2 size={16} />
            Share Result
          </button>
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl glass border border-white/15 text-white font-semibold text-sm"
          >
            <RotateCcw size={16} />
            Start Again
          </button>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-[10px] text-center text-white/15 mt-8 max-w-xs leading-relaxed">
          Unofficial fan-made simulator. Not affiliated with FIFA or the FIFA World Cup.
        </p>
      </div>
    </div>
  )
}
