'use client'

import { useCallback } from 'react'

export function useConfetti() {
  const fireConfetti = useCallback(async (options?: {
    colors?: string[]
    origin?: { x: number; y: number }
    spread?: number
    count?: number
  }) => {
    const confetti = (await import('canvas-confetti')).default
    const {
      colors = ['#D4A843', '#30D158', '#0A84FF', '#FF9F0A', '#BF5AF2'],
      origin = { x: 0.5, y: 0.6 },
      spread = 70,
      count = 120,
    } = options ?? {}

    confetti({
      particleCount: count,
      spread,
      origin,
      colors,
      ticks: 200,
      gravity: 0.8,
      scalar: 1.1,
      shapes: ['circle', 'square'],
    })
  }, [])

  const fireTeamConfetti = useCallback(async (teamColor: string, origin?: { x: number; y: number }) => {
    const confetti = (await import('canvas-confetti')).default
    const lighter = teamColor + '99'

    // Left burst
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: [teamColor, lighter, '#ffffff'],
      ticks: 250,
      gravity: 0.7,
    })

    // Right burst
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: [teamColor, lighter, '#ffffff'],
        ticks: 250,
        gravity: 0.7,
      })
    }, 150)
  }, [])

  const fireTrophyConfetti = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default

    const duration = 3000
    const end = Date.now() + duration
    const gold = '#D4A843'
    const silver = '#C0C0C0'

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors: [gold, silver, '#ffffff'],
        ticks: 300,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors: [gold, silver, '#ffffff'],
        ticks: 300,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const fireGoalConfetti = useCallback(async (teamColor: string) => {
    const confetti = (await import('canvas-confetti')).default
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.3 },
      colors: [teamColor, '#ffffff', '#D4A843'],
      ticks: 200,
      startVelocity: 35,
    })
  }, [])

  return { fireConfetti, fireTeamConfetti, fireTrophyConfetti, fireGoalConfetti }
}
