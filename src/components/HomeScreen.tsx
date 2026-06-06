'use client'

import { motion } from 'framer-motion'
import { Play, RotateCcw, Users, Grid3X3, Trophy, Star, ChevronRight } from 'lucide-react'

type HomeScreenProps = {
  hasSaved: boolean
  onStart: () => void
  onContinue: () => void
}

const floatingLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
const roadmap = ['Groups', 'Thirds', 'Round of 32', 'Final', 'Champion']

export function HomeScreen({ hasSaved, onStart, onContinue }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-10 overflow-hidden relative">
      {/* Floating group letters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingLetters.map((letter, i) => (
          <motion.div
            key={letter}
            className="absolute text-5xl font-black text-white/[0.025] select-none"
            style={{ left: `${(i % 4) * 28 + 4}%`, top: `${Math.floor(i / 4) * 32 + 6}%` }}
            animate={{ y: [0, -14, 0], opacity: [0.025, 0.05, 0.025] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {letter}
          </motion.div>
        ))}
      </div>

      {/* Beams */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] rounded-full opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,208,132,0.45) 0%, transparent 70%)' }} />
      <div className="absolute top-24 right-0 w-72 h-72 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(214,168,79,0.6) 0%, transparent 70%)' }} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10 pt-6"
      >
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D084] animate-pulse" />
          <span className="text-xs font-semibold text-[#00D084] tracking-[0.25em] uppercase">CupSim 26</span>
        </div>

        {/* Trophy with halo rings */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <motion.div
            className="absolute inset-0 -m-6 rounded-full border border-[#D6A84F]/20"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="text-7xl select-none"
            animate={{ scale: [1, 1.06, 1], filter: ['brightness(1)', 'brightness(1.35)', 'brightness(1)'] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ filter: 'drop-shadow(0 0 24px rgba(214,168,79,0.55))' }}
          >
            🏆
          </motion.div>
        </div>

        <h1 className="text-4xl font-black leading-tight mb-3">
          <span className="text-white">World Cup</span><br />
          <span className="gradient-text">2026 Simulator</span>
        </h1>

        <p className="text-sm text-white/50 max-w-xs mx-auto leading-relaxed">
          Simulate the real 2026 group stage. Track every qualifier. Build the Round of 32. Crown your champion.
        </p>
      </motion.div>

      {/* Stage roadmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="z-10 w-full max-w-sm"
      >
        <div className="flex items-center justify-between glass rounded-2xl px-3 py-3">
          {roadmap.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#00D084]/60" />
                <span className="text-[8.5px] text-white/40 font-medium whitespace-nowrap">{step}</span>
              </div>
              {i < roadmap.length - 1 && <div className="w-4 h-px bg-white/10 mb-4" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-4 gap-2 w-full max-w-sm z-10"
      >
        {[
          { icon: Users, label: '48', sub: 'Teams' },
          { icon: Grid3X3, label: '12', sub: 'Groups' },
          { icon: Trophy, label: 'R32', sub: 'Knockout' },
          { icon: Star, label: '104', sub: 'Matches' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="glass rounded-2xl p-3 flex flex-col items-center gap-1">
            <Icon size={14} className="text-[#D6A84F]" />
            <span className="text-base font-black text-white">{label}</span>
            <span className="text-[9px] text-white/40 uppercase tracking-wide">{sub}</span>
          </div>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col gap-3 w-full max-w-sm z-10"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#00D084] text-black font-bold text-base glow-green"
        >
          <Play size={18} fill="currentColor" />
          Start Simulation
        </motion.button>

        {hasSaved && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl glass border border-white/15 text-white font-semibold text-base"
          >
            <span className="flex items-center gap-2.5"><RotateCcw size={16} /> Continue Tournament</span>
            <ChevronRight size={16} className="text-white/40" />
          </motion.button>
        )}

        <p className="text-[10px] text-center text-white/20 mt-2 leading-relaxed">
          Unofficial fan-made simulator. Not affiliated with FIFA or the FIFA World Cup.
        </p>
      </motion.div>
    </div>
  )
}
