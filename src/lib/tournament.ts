import type { Tournament, Group, Match, Team } from "@/types/tournament"
import { WORLD_CUP_2026_GROUPS, GROUP_ORDER } from "./worldCup2026"

function makeMatchId(groupId: string, matchday: number, index: number): string {
  return `${groupId}-md${matchday}-m${index}`
}

function createGroupMatches(groupId: string, teams: Team[]): Match[] {
  const [t1, t2, t3, t4] = teams
  const schedule: [Team, Team, number][] = [
    [t1, t2, 1], [t3, t4, 1],
    [t1, t3, 2], [t4, t2, 2],
    [t4, t1, 3], [t2, t3, 3],
  ]
  return schedule.map(([teamA, teamB, matchday], i) => ({
    id: makeMatchId(groupId, matchday, i),
    round: "group_stage",
    groupId,
    matchday,
    teamA,
    teamB,
    scoreA: null,
    scoreB: null,
    status: "not_played",
  }))
}

export function createTournament(): Tournament {
  const groups: Group[] = GROUP_ORDER.map((key) => {
    const teams = WORLD_CUP_2026_GROUPS[key]
    return {
      id: key,
      name: `Group ${key}`,
      teams,
      matches: createGroupMatches(key, teams),
    }
  })

  const now = new Date().toISOString()
  return {
    id: `tournament-${Date.now()}`,
    name: "World Cup 2026 Simulator",
    stage: "group_stage",
    groups,
    knockout: {
      roundOf32: [],
      roundOf16: [],
      quarterFinals: [],
      semiFinals: [],
      thirdPlace: [],
      final: [],
    },
    createdAt: now,
    updatedAt: now,
  }
}
