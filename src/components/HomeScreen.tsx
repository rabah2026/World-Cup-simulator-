'use client'

import { motion } from 'framer-motion'
import { Play, RotateCcw, Users, Grid3X3, Trophy, Star } from 'lucide-react'

type HomeScreenProps = {
  hasSaved: boolean
  onStart: () => void
  onContinue: () => void
}

const floatingLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export function HomeScreen({ hasSaved, onStart, onContinue }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12 overflow-hidden relative">
      {/* Floating group letters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingLetters.map((letter, i) => (
          <motion.div
            key={letter}
            className="absolute text-4xl font-black text-white/[0.03] select-none"
            style={{
              left: `${(i % 4) * 28 + Math.random() * 10}%`,
              top: `${Math.floor(i / 4) * 35 + 5}%`,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.03, 0.06, 0.03],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {letter}
          </motion.div>
        ))}
      </div>

      {/* Stadium beam effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,208,132,0.4) 0%, transparent 70%)' }}
      />
      <div className="absolute top-20 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(214,168,79,0.6) 0%, transparent 70%)' }}
      />

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10 pt-8"
      >
        {/* CupSim badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D084] animate-pulse" />
          <span className="text-xs font-semibold text-[#00D084] tracking-widest uppercase">CupSim 26</span>
        </div>

        {/* Trophy glow */}
        <motion.div
          className="text-7xl mb-6 select-none"
          animate={{ scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🏆
        </motion.div>

        <h1 className="text-3xl font-black text-white leading-tight mb-3">
          World Cup<br />
          <span className="text-[#00D084] text-glow-green">2026</span> Simulator
        </h1>

        <p className="text-sm text-white/50 max-w-xs mx-auto leading-relaxed">
          Simulate the real 2026 group stage.
          Track every qualifier. Build the Round of 32.
          Crown your champion.
        </p>
      </motion.div>

      {/* Stats highlights */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col gap-3 w-full max-w-sm z-10"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#00D084] text-black font-bold text-base transition-all glow-green"
        >
          <Play size={18} fill="currentColor" />
          Start Simulation
        </motion.button>

        {hasSaved && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl glass border border-white/15 text-white font-semibold text-base"
          >
            <RotateCcw size={16} />
            Continue Saved Tournament
          </motion.button>
        )}

        <p className="text-[10px] text-center text-white/20 mt-2 leading-relaxed">
          Unofficial fan-made simulator. Not affiliated with FIFA or the FIFA World Cup.
        </p>
      </motion.div>
    </div>
  )
}
