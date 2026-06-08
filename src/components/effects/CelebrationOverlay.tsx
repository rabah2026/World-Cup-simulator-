'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useBracketStore } from '@/store/bracketStore'
import { useConfetti } from '@/hooks/useConfetti'
import { useSound } from '@/hooks/useSound'

export function CelebrationOverlay() {
  const { celebration, dismissCelebration } = useBracketStore()
  const { fireTeamConfetti } = useConfetti()
  const { playAdvance } = useSound()

  useEffect(() => {
    if (celebration?.active) {
      fireTeamConfetti(celebration.teamColor)
      playAdvance()
      const timer = setTimeout(dismissCelebration, 3500)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebration?.active, celebration?.teamId])

  return (
    <AnimatePresence>
      {celebration?.active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-center pb-32"
        >
          {/* Glow ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="w-64 h-64 rounded-full"
              style={{
                background: `radial-gradient(circle, ${celebration.teamColor}60 0%, transparent 70%)`,
              }}
            />
          </motion.div>

          {/* Celebration card */}
          <motion.div
            initial={{ y: 60, scale: 0.8, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 200 }}
            className="pointer-events-auto"
            onClick={dismissCelebration}
          >
            <div
              className="rounded-3xl px-6 py-4 flex flex-col items-center gap-2 shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${celebration.teamColor}30, ${celebration.teamColor}15)`,
                border: `1px solid ${celebration.teamColor}50`,
                backdropFilter: 'blur(20px)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl"
              >
                {celebration.teamFlag}
              </motion.div>
              <div className="text-center">
                <div className="text-white font-black text-lg">{celebration.teamName}</div>
                <div className="text-white/70 text-sm mt-0.5">{celebration.message}</div>
              </div>

              {/* Stars */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-400 text-lg pointer-events-none"
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: (i - 2) * 30,
                    y: -40 - Math.random() * 20,
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 0.8, delay: 0.1 * i, ease: 'easeOut' }}
                >
                  ⭐
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
