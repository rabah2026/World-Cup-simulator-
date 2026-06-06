'use client'

import { motion } from 'framer-motion'
import type { Tournament } from '@/types/tournament'
import { ProgressRing } from './ProgressRing'

function countMatches(t: Tournament) {
  const group = t.groups.flatMap((g) => g.matches)
  const ko = [
    ...t.knockout.roundOf32,
    ...t.knockout.roundOf16,
    ...t.knockout.quarterFinals,
    ...t.knockout.semiFinals,
    ...t.knockout.thirdPlace,
    ...t.knockout.final,
  ]
  const all = [...group, ...ko]
  const played = all.filter((m) => m.status === 'played').length
  return { played, total: all.length }
}

type TopHeaderProps = {
  tournament: Tournament
  eyebrow: string
  title: string
  subtitle?: string
  accent?: 'green' | 'gold'
}

export function TopHeader({ tournament, eyebrow, title, subtitle, accent = 'green' }: TopHeaderProps) {
  const { played, total } = countMatches(tournament)
  const progress = total ? played / total : 0
  const color = accent === 'gold' ? '#D6A84F' : '#00D084'

  return (
    <div className="sticky top-0 z-40">
      <div
        className="px-5 pt-10 pb-4 backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,7,13,0.94) 0%, rgba(5,7,13,0.78) 65%, rgba(5,7,13,0) 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-4"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color }}>
                {eyebrow}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-white/45 mt-1">{subtitle}</p>}
          </div>
          <ProgressRing progress={progress} color={color} size={50} stroke={4}>
            <span className="text-[11px] font-black text-white tabular-nums">{Math.round(progress * 100)}%</span>
          </ProgressRing>
        </motion.div>
      </div>
    </div>
  )
}
