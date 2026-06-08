'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Match } from '@/types/tournament'

type Props = {
  match: Match
  visible: boolean
}

const HYPE_FACTS: Record<string, string[]> = {
  brazil: ['Samba football at its finest 🕺', 'The Joga Bonito machine 🔥', 'Neymar who? They have depth 💚'],
  argentina: ['Messi cooking... again? 🐐', 'GOAT on the pitch 🌟', '2022 wasn\'t enough for them 🏆'],
  france: ['Les Bleus always find a way 🇫🇷', 'Mbappé sprinting at lightspeed ⚡', 'World Cup runners-up? Nah, they want gold 🥇'],
  germany: ['German efficiency mode: ON 🔧', 'Precision football incoming ⚙️', 'The machine never breaks down 🇩🇪'],
  spain: ['Tiki-taka 2.0 loading... 🔄', 'The most annoying team to play against 😤', 'Pass, pass, pass, GOAL 💫'],
  england: ['Football\'s coming home... right? 🏴󠁧󠁢󠁥󠁮󠁧󠁿', '60 years of hurt 😭', 'This time though... maybe? 🤞'],
  portugal: ['SIUUUUU 🎉', 'Ronaldo left but the spirit remains ⚡', 'Bruno & co. are ready 🌟'],
  netherlands: ['Total Football descendants 🔶', 'Orange power activated 🍊', 'Van Dijk standing tall 🏰'],
  default: ['They mean business 💪', 'Dark horse alert 🐴', 'Sleeping giant awakened 😤'],
}

const getHypeFact = (teamId: string): string => {
  const facts = HYPE_FACTS[teamId] ?? HYPE_FACTS.default
  return facts[Math.floor(Math.random() * facts.length)]
}

function getStrengthPercent(strength: number): number {
  return Math.round(((strength - 65) / 30) * 100)
}

export function HypeMeter({ match, visible }: Props) {
  const { teamA, teamB } = match
  if (!teamA || !teamB) return null

  const hypeA = getStrengthPercent(teamA.strength)
  const hypeB = getStrengthPercent(teamB.strength)
  const vibeA = Math.round(40 + Math.random() * 50)
  const vibeB = 100 - vibeA

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute left-0 right-0 bottom-full mb-2 z-50 px-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="glass-card rounded-2xl p-3 border border-white/10 shadow-2xl">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1">
              ⚡ Hype Meter
            </div>

            {/* Vibe bars */}
            <div className="space-y-2 mb-3">
              <HypeBar label={`${teamA.flagEmoji} ${teamA.shortName}`} value={vibeA} color="#30D158" />
              <HypeBar label={`${teamB.flagEmoji} ${teamB.shortName}`} value={vibeB} color="#0A84FF" />
            </div>

            {/* Strength bars */}
            <div className="border-t border-white/5 pt-2 space-y-1.5">
              <div className="text-[9px] text-white/30 uppercase tracking-wider">Strength Rating</div>
              <StrengthBar team={teamA} value={hypeA} />
              <StrengthBar team={teamB} value={hypeB} />
            </div>

            {/* Fun fact */}
            <div className="mt-2 pt-2 border-t border-white/5">
              <p className="text-[10px] text-white/50 italic leading-relaxed">
                {getHypeFact(teamA.strength > teamB.strength ? teamA.id : teamB.id)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function HypeBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-white/60 w-14 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-bold w-7 text-right" style={{ color }}>{value}%</span>
    </div>
  )
}

function StrengthBar({ team, value }: { team: { flagEmoji?: string; shortName: string; strength: number }; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-white/40 w-14 shrink-0">{team.flagEmoji} {team.shortName}</span>
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-[#D4A843] to-[#E8C46A]"
        />
      </div>
      <span className="text-[10px] text-white/30 w-7 text-right">{team.strength}</span>
    </div>
  )
}
