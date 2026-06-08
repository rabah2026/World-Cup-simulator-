'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Match, Team } from '@/types/tournament'
import { useBracketStore } from '@/store/bracketStore'
import { HypeMeter } from '@/components/ui/HypeMeter'
import { LivePulse } from '@/components/ui/LivePulse'

type Props = {
  match: Match
  roundKey: string
  compact?: boolean
  isTreeView?: boolean
}

export function BracketMatch({ match, roundKey, compact = false, isTreeView = false }: Props) {
  const { mode, predictions, simulateMatch, makePrediction } = useBracketStore()
  const [showHype, setShowHype] = useState(false)
  const [selecting, setSelecting] = useState(false)
  const hypeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const prediction = predictions[match.id]
  const played = match.status === 'played'
  const isPredictMode = mode === 'predict'
  const hasBothTeams = !!match.teamA && !!match.teamB

  const handlePress = () => {
    if (!hasBothTeams) return
    if (isPredictMode && !played) {
      setSelecting(true)
    } else if (played) {
      // Show hype on tap for played matches
      setShowHype((v) => !v)
    }
  }

  const handleLongPress = () => {
    if (!hasBothTeams) return
    if (hypeTimerRef.current !== null) clearTimeout(hypeTimerRef.current)
    hypeTimerRef.current = setTimeout(() => setShowHype(true), 400)
  }

  const handleRelease = () => {
    if (hypeTimerRef.current !== null) clearTimeout(hypeTimerRef.current)
  }

  const handlePredictWinner = (team: Team) => {
    makePrediction(match.id, team)
    setSelecting(false)
  }

  const handleSimulate = () => {
    simulateMatch(match.id, roundKey)
    setSelecting(false)
  }

  const aIsWinner = played && match.winnerId === match.teamA?.id
  const bIsWinner = played && match.winnerId === match.teamB?.id
  const aPredicted = prediction?.winnerId === match.teamA?.id
  const bPredicted = prediction?.winnerId === match.teamB?.id

  const cardWidth = isTreeView ? 120 : '100%'

  return (
    <div className="relative" style={isTreeView ? { width: 120 } : {}}>
      {/* Main card */}
      <motion.div
        layout
        className="relative overflow-visible"
        onTouchStart={handleLongPress}
        onTouchEnd={handleRelease}
        onMouseEnter={() => hasBothTeams && setShowHype(true)}
        onMouseLeave={() => { setShowHype(false); if (hypeTimerRef.current !== null) clearTimeout(hypeTimerRef.current) }}
        whileTap={hasBothTeams ? { scale: 0.97 } : {}}
        onClick={handlePress}
      >
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: isPredictMode && !played && hasBothTeams
              ? 'linear-gradient(135deg, rgba(10,132,255,0.12), rgba(10,22,40,0.95))'
              : 'linear-gradient(135deg, rgba(22,33,56,0.9), rgba(10,22,40,0.95))',
            border: isPredictMode && !played && hasBothTeams
              ? '1px solid rgba(10,132,255,0.3)'
              : played
              ? '1px solid rgba(255,255,255,0.07)'
              : '1px solid rgba(255,255,255,0.06)',
            cursor: hasBothTeams ? 'pointer' : 'default',
          }}
        >
          {/* Team A */}
          <TeamRow
            team={match.teamA}
            score={match.scoreA}
            played={played}
            isWinner={aIsWinner}
            isPredicted={aPredicted}
            compact={compact}
          />

          {/* Divider */}
          <div className="h-px bg-white/5 mx-2" />

          {/* Team B */}
          <TeamRow
            team={match.teamB}
            score={match.scoreB}
            played={played}
            isWinner={bIsWinner}
            isPredicted={bPredicted}
            compact={compact}
          />

          {/* Predict mode overlay hint */}
          {isPredictMode && !played && hasBothTeams && !prediction && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="px-2 py-0.5 rounded-full bg-[#0A84FF]/20 border border-[#0A84FF]/30">
                <span className="text-[9px] font-bold text-[#0A84FF]">Tap to predict</span>
              </div>
            </div>
          )}

          {/* Prediction indicator */}
          {prediction && !played && (
            <div className="absolute top-1 right-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
            </div>
          )}

          {/* Penalty shootout */}
          {played && match.penaltyWinnerId && (
            <div className="px-2 pb-1 pt-0.5">
              <div className="text-[9px] text-white/30 text-center">
                ({match.penaltyScoreA} – {match.penaltyScoreB}) pens
              </div>
            </div>
          )}
        </div>

        {/* Hype meter tooltip */}
        {!isTreeView && (
          <HypeMeter match={match} visible={showHype && hasBothTeams} />
        )}
      </motion.div>

      {/* Predict selection overlay */}
      <AnimatePresence>
        {selecting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 18, stiffness: 280 }}
            className="absolute left-0 right-0 top-full mt-2 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-card rounded-2xl p-3 border border-[#0A84FF]/30 shadow-2xl">
              <div className="text-[10px] font-bold text-[#0A84FF]/70 uppercase tracking-widest mb-2 text-center">
                Who advances?
              </div>
              <div className="flex gap-2">
                {[match.teamA, match.teamB].map((team) => team && (
                  <motion.button
                    key={team.id}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handlePredictWinner(team)}
                    className="flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl transition-all"
                    style={{
                      background: prediction?.winnerId === team.id
                        ? 'rgba(10,132,255,0.2)'
                        : 'rgba(255,255,255,0.04)',
                      border: prediction?.winnerId === team.id
                        ? '1px solid rgba(10,132,255,0.5)'
                        : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <span className="text-2xl">{team.flagEmoji}</span>
                    <span className="text-[11px] font-bold text-white">{team.shortName}</span>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={handleSimulate}
                className="w-full mt-2 py-1.5 text-[11px] font-bold text-white/40 hover:text-white/60 transition-colors"
              >
                🎲 Simulate instead
              </button>
              <button
                onClick={() => setSelecting(false)}
                className="w-full py-1 text-[10px] text-white/20"
              >
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
  compact: boolean
}

function TeamRow({ team, score, played, isWinner, isPredicted, compact }: TeamRowProps) {
  const isEmpty = !team

  return (
    <div
      className="flex items-center px-2.5 py-2 gap-2"
      style={{
        opacity: played && !isWinner ? 0.45 : 1,
      }}
    >
      {/* Flag */}
      <span className={compact ? 'text-sm leading-none' : 'text-base leading-none'}>
        {team?.flagEmoji ?? '🏳️'}
      </span>

      {/* Name */}
      <span
        className={`flex-1 truncate font-semibold ${compact ? 'text-[11px]' : 'text-[12px]'}`}
        style={{
          color: isEmpty ? 'rgba(255,255,255,0.2)'
            : isPredicted ? '#0A84FF'
            : isWinner ? '#FFFFFF'
            : played ? 'rgba(255,255,255,0.4)'
            : 'rgba(255,255,255,0.8)',
        }}
      >
        {team ? (compact ? team.shortName : team.shortName) : 'TBD'}
      </span>

      {/* Score / predicted badge */}
      <div className="flex items-center">
        {isPredicted && !played && (
          <span className="text-[9px] font-black text-[#0A84FF] mr-1">★</span>
        )}
        {played ? (
          <motion.span
            key={score}
            initial={isWinner ? { scale: 1.4, color: '#30D158' } : {}}
            animate={{ scale: 1, color: isWinner ? '#FFFFFF' : 'rgba(255,255,255,0.35)' }}
            transition={{ duration: 0.3 }}
            className={`font-black tabular-nums ${compact ? 'text-[13px]' : 'text-sm'}`}
          >
            {score ?? 0}
          </motion.span>
        ) : (
          <span className={`text-white/15 font-bold ${compact ? 'text-[11px]' : 'text-xs'}`}>-</span>
        )}
      </div>

      {/* Winner check */}
      {isWinner && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 8 }}
          className="text-[#30D158] text-[10px] font-black"
        >
          ✓
        </motion.span>
      )}
    </div>
  )
}
