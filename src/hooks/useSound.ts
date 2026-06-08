'use client'

import { useCallback, useRef, useEffect } from 'react'

// Simple audio using Web Audio API since we can't bundle Howler easily
export function useSound() {
  const audioCtx = useRef<AudioContext | null>(null)
  const enabled = useRef(true)

  useEffect(() => {
    return () => {
      audioCtx.current?.close()
    }
  }, [])

  const getCtx = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioCtx.current
  }, [])

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', gain = 0.15) => {
    if (!enabled.current) return
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.type = type
      osc.frequency.setValueAtTime(frequency, ctx.currentTime)
      gainNode.gain.setValueAtTime(gain, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch { /* silent fail */ }
  }, [getCtx])

  const playGoal = useCallback(() => {
    // Ascending goal celebration tones
    ;[523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine', 0.2), i * 80)
    })
  }, [playTone])

  const playWhistle = useCallback(() => {
    playTone(1200, 0.15, 'square', 0.1)
    setTimeout(() => playTone(1400, 0.1, 'square', 0.08), 200)
  }, [playTone])

  const playAdvance = useCallback(() => {
    ;[392, 523, 659].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'triangle', 0.15), i * 60)
    })
  }, [playTone])

  const playClick = useCallback(() => {
    playTone(800, 0.05, 'sine', 0.08)
  }, [playTone])

  const playChaosMode = useCallback(() => {
    const freqs = [200, 150, 300, 100, 400, 50]
    freqs.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sawtooth', 0.1), i * 100)
    })
  }, [playTone])

  const setEnabled = useCallback((val: boolean) => {
    enabled.current = val
  }, [])

  return { playGoal, playWhistle, playAdvance, playClick, playChaosMode, setEnabled }
}
