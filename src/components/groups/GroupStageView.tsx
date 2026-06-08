'use client'
import { useBracketStore } from '@/store/bracketStore'
import { calculateStandings } from '@/lib/standings'
import { BracketMatch } from '@/components/bracket/BracketMatch'
import type { Group } from '@/types/tournament'

const R32_DATES: Record<string, string> = {
  'r32-m1':  'Mon, Jun 29 · 23:30', 'r32-m2':  'Tue, Jun 30 · 02:00',
  'r32-m3':  'Wed, Jul 1 · 00:00',  'r32-m4':  'Wed, Jul 1 · 02:30',
  'r32-m5':  'Thu, Jul 1 · 22:00',  'r32-m6':  'Fri, Jul 2 · 00:30',
  'r32-m7':  'Thu, Jul 2 · 22:00',  'r32-m8':  'Fri, Jul 2 · 03:00',
  'r32-m9':  'Fri, Jul 3 · 02:00',  'r32-m10': 'Sat, Jul 3 · 22:00',
  'r32-m11': 'Sat, Jul 4 · 20:00',  'r32-m12': 'Sun, Jul 4 · 20:00',
  'r32-m13': 'Sun, Jun 28 · 22:00', 'r32-m14': 'Tue, Jun 30 · 04:00',
  'r32-m15': 'Tue, Jun 30 · 04:00', 'r32-m16': 'Mon, Jun 29 · 22:00',
}

export function GroupStageView() {
  const { tournament } = useBracketStore()
  if (!tournament) return null

  const groups = tournament.groups
  const r32Matches = tournament.knockout.roundOf32

  return (
    <div
      className="overflow-y-auto pb-8"
      style={{ maxHeight: 'calc(100dvh - 220px)', touchAction: 'pan-y' }}
    >
      <div className="flex gap-2 px-4">
        {/* Left column: group standings */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {groups.map((group) => (
            <GroupStandings key={group.id} group={group} />
          ))}
        </div>

        {/* Right column: R32 match cards */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {r32Matches.map((match) => (
            <BracketMatch key={match.id} match={match} dateLabel={R32_DATES[match.id]} />
          ))}
        </div>
      </div>
    </div>
  )
}

function GroupStandings({ group }: { group: Group }) {
  const standings = calculateStandings(group)

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center mb-1 px-0.5">
        <span className="flex-1 text-white/55 text-[10px] font-semibold">{group.name}</span>
        <span className="text-white/35 text-[10px] font-medium">PTS</span>
      </div>

      {/* Standings card */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'rgba(8,15,80,0.65)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {standings.map((s, i) => (
          <div key={s.team.id}>
            {i > 0 && <div className="h-px mx-2.5" style={{ background: 'rgba(255,255,255,0.06)' }} />}
            <div className="flex items-center gap-2 px-2.5 py-2">
              <span className="text-[10px] text-white/30 w-3 text-center flex-shrink-0">{i + 1}</span>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                {s.team.flagEmoji ?? ''}
              </div>
              <span className="flex-1 text-[12px] font-medium text-white/85 truncate min-w-0">
                {s.team.shortName}
              </span>
              <span className="text-[12px] font-bold text-white/85 w-5 text-right flex-shrink-0">
                {s.points}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
