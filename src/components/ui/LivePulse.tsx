'use client'

import { motion } from 'framer-motion'

export function LivePulse({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center gap-1 ${className}`}>
      <span className="relative flex h-2 w-2">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-[#FF453A] opacity-75"
          animate={{ scale: [1, 2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF453A]" />
      </span>
      <span className="text-[#FF453A] text-[9px] font-black uppercase tracking-widest">Live</span>
    </span>
  )
}

export function ScorePulse({ score, className = '' }: { score: number | null; className?: string }) {
  return (
    <motion.span
      key={score}
      initial={{ scale: 1.4, color: '#30D158' }}
      animate={{ scale: 1, color: '#FFFFFF' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`font-black tabular-nums ${className}`}
    >
      {score ?? 0}
    </motion.span>
  )
}
