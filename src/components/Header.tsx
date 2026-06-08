'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Zap, Eye, Settings } from 'lucide-react'
import { useBracketStore } from '@/store/bracketStore'

export function Header() {
  const { mode, setMode, chaosMode, tournament } = useBracketStore()
  const isPredicting = mode === 'predict'
  const isComplete = tournament?.stage === 'complete'

  return (
    <div className="sticky top-0 z-40 px-4 pt-safe">
      <div className="flex items-center justify-between h-14">
        {/* Left: App title */}
        <div className="flex items-center gap-2">
          <motion.div
            className="text-2xl select-none"
            animate={{ rotate: chaosMode ? [0, -10, 10, -10, 10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: chaosMode ? Infinity : 0, repeatDelay: 3 }}
          >
            {isComplete ? '🏆' : '⚽'}
          </motion.div>
          <div>
            <div className="text-white font-black text-sm tracking-tight leading-none">
              World Cup 2026
              {chaosMode && (
                <span className="ml-1 text-purple-400 text-[9px] font-bold align-super">CHAOS</span>
              )}
            </div>
            <div className="text-white/35 text-[10px] font-medium tracking-wide">
              USA · CAN · MEX  ·  June–July 2026
            </div>
          </div>
        </div>

        {/* Right: Mode toggle */}
        <PredictionModeToggle mode={mode} onToggle={() => setMode(isPredicting ? 'view' : 'predict')} />
      </div>

      {/* Chaos mode strip */}
      <AnimatePresence>
        {chaosMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center gap-2">
              <span className="text-sm">🌀</span>
              <span className="text-[10px] font-bold text-purple-300 flex-1">
                CHAOS MODE — Underdogs always win in simulation
              </span>
              <span className="text-[10px] text-purple-400/60">Tap 🏆 5× to toggle</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PredictionModeToggle({ mode, onToggle }: { mode: 'view' | 'predict'; onToggle: () => void }) {
  const isPredicting = mode === 'predict'

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center rounded-full overflow-hidden"
      style={{
        background: isPredicting
          ? 'linear-gradient(135deg, rgba(10,132,255,0.2), rgba(94,92,230,0.2))'
          : 'rgba(255,255,255,0.07)',
        border: isPredicting ? '1px solid rgba(10,132,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
        padding: '5px 12px 5px 8px',
        gap: '6px',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {isPredicting
            ? <Zap size={13} className="text-[#0A84FF]" />
            : <Eye size={13} className="text-white/50" />
          }
        </motion.div>
      </AnimatePresence>
      <span
        className="text-[11px] font-bold"
        style={{ color: isPredicting ? '#0A84FF' : 'rgba(255,255,255,0.5)' }}
      >
        {isPredicting ? 'Predict' : 'View'}
      </span>
    </motion.button>
  )
}
