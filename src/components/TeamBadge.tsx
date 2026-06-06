import type { Team } from '@/types/tournament'
import { cn } from '@/lib/utils'

type TeamBadgeProps = {
  team: Team | null
  size?: 'sm' | 'md' | 'lg'
  showFlag?: boolean
  className?: string
}

export function TeamBadge({ team, size = 'md', showFlag = true, className }: TeamBadgeProps) {
  if (!team) {
    return (
      <div className={cn(
        'flex items-center gap-2 text-white/30',
        className
      )}>
        <span className={cn(
          'font-bold tracking-wide',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-lg',
        )}>TBD</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showFlag && team.flagEmoji && (
        <span className={cn(
          size === 'sm' && 'text-base',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-3xl',
        )}>{team.flagEmoji}</span>
      )}
      <div className="flex flex-col">
        <span className={cn(
          'font-bold tracking-wide text-white',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-xl',
        )}>{team.shortName}</span>
        {size !== 'sm' && (
          <span className="text-[10px] text-white/50 leading-none mt-0.5 truncate max-w-[90px]">
            {team.name}
          </span>
        )}
      </div>
    </div>
  )
}
