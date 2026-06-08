'use client'
import type { Match } from '@/types/tournament'

type Props = {
  match: Match
  dateLabel?: string
}

export function BracketMatch({ match, dateLabel }: Props) {
  const played = match.status === 'played'
  const aWon = played && match.winnerId === match.teamA?.id
  const bWon = played && match.winnerId === match.teamB?.id

  return (
    <div>
      {dateLabel && (
        <div className="text-white/50 text-[10px] font-medium mb-1 px-0.5">{dateLabel}</div>
      )}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'rgba(8, 15, 80, 0.65)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <TeamRow
          flag={match.teamA?.flagEmoji}
          name={match.teamA?.shortName ?? 'TBD'}
          score={played ? match.scoreA : null}
          winner={aWon}
          loser={played && !aWon}
        />
        <div className="h-px mx-3" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <TeamRow
          flag={match.teamB?.flagEmoji}
          name={match.teamB?.shortName ?? 'TBD'}
          score={played ? match.scoreB : null}
          winner={bWon}
          loser={played && !bWon}
        />
        {played && match.penaltyWinnerId && (
          <div className="px-3 pb-1 text-[9px] text-white/30 text-center">
            ({match.penaltyScoreA}–{match.penaltyScoreB} pens)
          </div>
        )}
      </div>
    </div>
  )
}

function TeamRow({
  flag,
  name,
  score,
  winner,
  loser,
}: {
  flag?: string
  name: string
  score: number | null
  winner: boolean
  loser: boolean
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2.5"
      style={{ opacity: loser ? 0.38 : 1 }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
        style={{ background: flag ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)' }}
      >
        {flag ?? ''}
      </div>
      <span
        className="flex-1 text-[13px] font-medium truncate"
        style={{ color: winner ? '#FFFFFF' : loser ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)' }}
      >
        {name}
      </span>
      {score !== null && (
        <span
          className="font-black tabular-nums text-sm"
          style={{ color: winner ? '#FFFFFF' : 'rgba(255,255,255,0.35)' }}
        >
          {score}
        </span>
      )}
    </div>
  )
}
