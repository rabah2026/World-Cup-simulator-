'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBracketStore } from '@/store/bracketStore'
import { useConfetti } from '@/hooks/useConfetti'
import { useSound } from '@/hooks/useSound'

export function TrophyAnimation() {
  const { tournament, clickTrophy, chaosMode } = useBracketStore()
  const { fireTrophyConfetti } = useConfetti()
  const { playGoal } = useSound()

  const champion = tournament?.champion

  useEffect(() => {
    if (champion) {
      fireTrophyConfetti()
      playGoal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [champion?.id])

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Chaos mode banner */}
      {chaosMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/40 text-xs font-bold text-purple-300 text-center"
        >
          🌀 CHAOS MODE ACTIVE — Underdogs Always Win
        </motion.div>
      )}

      {/* Trophy */}
      <motion.button
        className="relative"
        onClick={clickTrophy}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <motion.div
          className="text-[80px] trophy-glow select-none"
          animate={champion ? {
            rotate: [0, -5, 5, -3, 3, 0],
            scale: [1, 1.05, 1],
          } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          🏆
        </motion.div>

        {/* Glow rings */}
        {champion && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-[#D4A843]/30"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </motion.button>

      {/* Champion reveal */}
      {champion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', damping: 12 }}
          className="text-center"
        >
          <div className="text-[10px] text-[#D4A843]/70 uppercase tracking-[0.2em] font-bold mb-1">
            World Cup 2026 Champions
          </div>
          <div className="text-4xl mb-1">{champion.flagEmoji}</div>
          <div className="text-2xl font-black text-white">{champion.name}</div>
          <div className="text-sm text-white/40 mt-1">
            {champion.shortName} · Crowned 2026
          </div>
        </motion.div>
      )}

      {/* Trophy click hint */}
      {!champion && (
        <div className="text-[10px] text-white/20 text-center">
          Tap the trophy 5× for a secret... 🤫
        </div>
      )}
    </div>
  )
}
