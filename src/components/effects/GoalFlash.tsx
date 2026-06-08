'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfetti } from '@/hooks/useConfetti'
import { useSound } from '@/hooks/useSound'

type GoalFlashState = {
  visible: boolean
  teamName: string
  teamFlag: string
  teamColor: string
}

export function useGoalFlash() {
  const [state, setState] = useState<GoalFlashState>({
    visible: false,
    teamName: '',
    teamFlag: '',
    teamColor: '#30D158',
  })
  const { fireGoalConfetti } = useConfetti()
  const { playGoal } = useSound()

  const trigger = useCallback((teamName: string, teamFlag: string, teamColor = '#30D158') => {
    setState({ visible: true, teamName, teamFlag, teamColor })
    fireGoalConfetti(teamColor)
    playGoal()
    setTimeout(() => setState((s) => ({ ...s, visible: false })), 2000)
  }, [fireGoalConfetti, playGoal])

  return { state, trigger }
}

export function GoalFlash({ state }: { state: GoalFlashState }) {
  return (
    <AnimatePresence>
      {state.visible && (
        <>
          {/* Screen edge flash */}
          <motion.div
            className="fixed inset-0 z-[200] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.2, 1] }}
            style={{ background: `radial-gradient(ellipse at center, ${state.teamColor}40 0%, transparent 70%)` }}
          />

          {/* GOAL banner */}
          <motion.div
            className="fixed top-24 left-0 right-0 z-[201] flex justify-center pointer-events-none"
            initial={{ y: -40, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 250 }}
          >
            <div
              className="px-6 py-2 rounded-full flex items-center gap-2 shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${state.teamColor}, ${state.teamColor}CC)`,
              }}
            >
              <span className="text-lg">{state.teamFlag}</span>
              <span className="text-white font-black text-xl tracking-wide">GOAL!</span>
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.4, repeat: 2 }}
                className="text-lg"
              >
                ⚽
              </motion.span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
