import type { Standing } from '@/types/tournament'
import { cn } from '@/lib/utils'

type StandingsTableProps = {
  standings: Standing[]
  compact?: boolean
}

const statusColor: Record<string, string> = {
  qualified: '#00D084',
  third_possible: '#D6A84F',
  eliminated: '#64748B',
  pending: 'rgba(255,255,255,0.15)',
}

const statusText: Record<string, string> = {
  qualified: 'text-[#00D084]',
  third_possible: 'text-[#D6A84F]',
  eliminated: 'text-white/40',
  pending: 'text-white/40',
}

export function StandingsTable({ standings, compact = false }: StandingsTableProps) {
  return (
    <div className="w-full">
      {!compact && (
        <div className="grid grid-cols-[28px_1fr_32px_32px_32px_44px] gap-1 px-2 pb-1.5 text-[10px] text-white/30 uppercase tracking-widest font-medium">
          <span>#</span>
          <span>Team</span>
          <span className="text-center">Pts</span>
          <span className="text-center">GD</span>
          <span className="text-center">GF</span>
          <span className="text-center">W-D-L</span>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {standings.map((s, i) => (
          <div
            key={s.team.id}
            className={cn(
              'relative grid gap-1 pl-3 pr-2 py-2 rounded-lg transition-colors',
              compact ? 'grid-cols-[20px_1fr_28px_28px_28px]' : 'grid-cols-[28px_1fr_32px_32px_32px_44px]',
              i < 2 && 'bg-[#00D084]/[0.06]',
              i === 2 && 'bg-[#D6A84F]/[0.06]',
            )}
          >
            {/* Qualification accent bar */}
            <span
              className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full"
              style={{ background: statusColor[s.qualificationStatus] }}
            />

            <span className={cn('text-xs font-bold self-center', statusText[s.qualificationStatus])}>{s.rank}</span>

            <div className="flex items-center gap-2 min-w-0">
              {s.team.flagEmoji && <span className="text-sm shrink-0">{s.team.flagEmoji}</span>}
              <span className={cn('font-semibold truncate text-white', compact ? 'text-xs' : 'text-sm')}>
                {compact ? s.team.shortName : s.team.name}
              </span>
            </div>

            <span className={cn('text-center font-black self-center', compact ? 'text-xs' : 'text-sm', statusText[s.qualificationStatus])}>
              {s.points}
            </span>
            <span className={cn('text-center text-white/60 self-center', compact ? 'text-xs' : 'text-sm')}>
              {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
            </span>
            <span className={cn('text-center text-white/60 self-center', compact ? 'text-xs' : 'text-sm')}>{s.goalsFor}</span>
            {!compact && (
              <span className="text-center text-[10px] text-white/40 self-center">
                {s.won}-{s.drawn}-{s.lost}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
