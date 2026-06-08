'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Match, Team } from '@/types/tournament'
import { useBracketStore } from '@/store/bracketStore'
import { HypeMeter } from '@/components/ui/HypeMeter'

type Props = {
  match: Match
  roundKey: string
  dateLabel?: string   // "Mon, Jun 29 · 23:30" shown above card
  showHypeOnHover?: boolean
  compact?: boolean
  isTreeView?: boolean
}

export function BracketMatch({ match, roundKey, dateLabel, showHypeOnHover = true }: Props) {
  const { mode, predictions, simulateMatch, makePrediction } = useBracketStore()
  const [selecting, setSelecting] = useState(false)
  const [showHype, setShowHype] = useState(false)

  const prediction = predictions[match.id]
  const played = match.status === 'played'
  const isPredictMode = mode === 'predict'
  const hasBothTeams = !!match.teamA && !!match.teamB

  const aIsWinner = played && match.winnerId === match.teamA?.id
  const bIsWinner = played && match.winnerId === match.teamB?.id
  const aPredicted = prediction?.winnerId === match.teamA?.id
  const bPredicted = prediction?.winnerId === match.teamB?.id

  return (
    <div className="relative">
      {/* Date label above card */}
      {dateLabel && (
        <div className="text-white/70 text-[11px] font-medium mb-1.5 px-0.5">{dateLabel}</div>
      )}

      <motion.div
        whileTap={hasBothTeams ? { scale: 0.98 } : {}}
        onClick={() => {
          if (!hasBothTeams) return
          if (isPredictMode && !played) { setSelecting(true); return }
          if (played && showHypeOnHover) setShowHype(v => !v)
        }}
        onMouseEnter={() => showHypeOnHover && hasBothTeams && setShowHype(true)}
        onMouseLeave={() => setShowHype(false)}
        className="relative rounded-xl overflow-hidden"
        style={{
          background: 'rgba(8, 15, 80, 0.65)',
          border: isPredictMode && !played && hasBothTeams
            ? '1px solid rgba(10,132,255,0.4)'
            : '1px solid rgba(255,255,255,0.08)',
          cursor: hasBothTeams ? 'pointer' : 'default',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Team A */}
        <TeamRow
          team={match.teamA}
          score={match.scoreA}
          played={played}
          isWinner={aIsWinner}
          isPredicted={aPredicted}
        />

        {/* Divider */}
        <div className="h-px mx-3" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Team B */}
        <TeamRow
          team={match.teamB}
          score={match.scoreB}
          played={played}
          isWinner={bIsWinner}
          isPredicted={bPredicted}
        />

        {/* Predict mode pulse border */}
        {isPredictMode && !played && hasBothTeams && !prediction && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ border: '1px solid rgba(10,132,255,0.5)' }}
          />
        )}

        {/* Prediction indicator dot */}
        {prediction && !played && (
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
        )}

        {/* Penalty note */}
        {played && match.penaltyWinnerId && (
          <div className="px-3 pb-1.5 text-[10px] text-white/30 text-center">
            ({match.penaltyScoreA}–{match.penaltyScoreB} pens)
          </div>
        )}
      </motion.div>

      {/* Hype tooltip */}
      <HypeMeter match={match} visible={showHype && hasBothTeams} />

      {/* Predict selection overlay */}
      <AnimatePresence>
        {selecting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', damping: 18, stiffness: 300 }}
            className="absolute left-0 right-0 top-full mt-2 z-50"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="rounded-2xl p-3 shadow-2xl border"
              style={{
                background: 'rgba(15, 25, 90, 0.97)',
                border: '1px solid rgba(10,132,255,0.35)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="text-[10px] font-bold text-[#0A84FF]/70 uppercase tracking-widest mb-2.5 text-center">
                Who advances?
              </div>
              <div className="flex gap-2">
                {[match.teamA, match.teamB].map(team => team && (
                  <motion.button
                    key={team.id}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => { makePrediction(match.id, team); setSelecting(false) }}
                    className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl"
                    style={{
                      background: prediction?.winnerId === team.id
                        ? 'rgba(10,132,255,0.2)'
                        : 'rgba(255,255,255,0.05)',
                      border: prediction?.winnerId === team.id
                        ? '1px solid rgba(10,132,255,0.5)'
                        : '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <span className="text-2xl">{team.flagEmoji}</span>
                    <span className="text-[12px] font-bold text-white">{team.shortName}</span>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => { simulateMatch(match.id, roundKey); setSelecting(false) }}
                className="w-full mt-2 py-1.5 text-[11px] font-bold text-white/40"
              >
                🎲 Simulate
              </button>
              <button onClick={() => setSelecting(false)} className="w-full py-1 text-[10px] text-white/20">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type TeamRowProps = {
  team: Team | null
  score: number | null
  played: boolean
  isWinner: boolean
  isPredicted: boolean
}

function TeamRow({ team, score, played, isWinner, isPredicted }: TeamRowProps) {
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2.5"
      style={{ opacity: played && !isWinner ? 0.4 : 1 }}
    >
      {/* Circular badge */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
        style={{
          background: team ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
        }}
      >
        {team?.flagEmoji ?? ''}
      </div>

      {/* Team name */}
      <span
        className="flex-1 text-[13px] font-medium truncate"
        style={{
          color: !team ? 'rgba(255,255,255,0.3)'
            : isPredicted ? '#5BC8F5'
            : isWinner ? '#FFFFFF'
            : played ? 'rgba(255,255,255,0.4)'
            : 'rgba(255,255,255,0.85)',
        }}
      >
        {team?.shortName ?? 'TBD'}
      </span>

      {/* Score */}
      {played ? (
        <motion.span
          key={score}
          initial={isWinner ? { scale: 1.3, color: '#30D158' } : {}}
          animate={{ scale: 1, color: isWinner ? '#FFFFFF' : 'rgba(255,255,255,0.35)' }}
          transition={{ duration: 0.3 }}
          className="font-black tabular-nums text-sm"
        >
          {score ?? 0}
        </motion.span>
      ) : (
        isPredicted && <span className="text-[10px] font-black text-[#0A84FF]">★</span>
      )}
    </div>
  )
}
