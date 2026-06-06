import type { Match } from '@/types/tournament'

export type GoalEvent = {
  minute: number
  teamId: string
  teamShort: string
  flag?: string
  side: 'A' | 'B'
}

// Distribute the final score across realistic match minutes for live playback.
export function generateGoalEvents(match: Match): GoalEvent[] {
  const events: GoalEvent[] = []
  const a = match.teamA
  const b = match.teamB
  const sA = match.scoreA ?? 0
  const sB = match.scoreB ?? 0
  if (!a || !b) return events

  const used = new Set<number>()
  const randMinute = () => {
    let m = Math.floor(Math.random() * 90) + 1
    let guard = 0
    while (used.has(m) && guard < 200) {
      m = Math.floor(Math.random() * 90) + 1
      guard++
    }
    used.add(m)
    return m
  }

  for (let i = 0; i < sA; i++) {
    events.push({ minute: randMinute(), teamId: a.id, teamShort: a.shortName, flag: a.flagEmoji, side: 'A' })
  }
  for (let i = 0; i < sB; i++) {
    events.push({ minute: randMinute(), teamId: b.id, teamShort: b.shortName, flag: b.flagEmoji, side: 'B' })
  }

  return events.sort((x, y) => x.minute - y.minute)
}

export const COMMENTARY_KICKOFF = [
  "We're underway!",
  'Kick-off! Here we go.',
  'The whistle blows — game on.',
  'The atmosphere is electric.',
]

export const COMMENTARY_PLAYING = [
  'End to end stuff here.',
  'Great tempo in this one.',
  'The crowd is on their feet.',
  'So close! What a chance.',
  'Pressure building now.',
  'What a contest this is.',
  'Tense moments out there.',
  'Both sides pushing forward.',
]

export function goalLine(team: string): string {
  const lines = [
    `GOAL! ${team} strike!`,
    `${team} find the net!`,
    `It's there! ${team} score!`,
    `What a finish from ${team}!`,
    `${team} make it count!`,
  ]
  return lines[Math.floor(Math.random() * lines.length)]
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
