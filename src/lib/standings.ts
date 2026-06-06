import type { Group, Standing, Team, Match } from "@/types/tournament"

export function calculateStandings(group: Group): Standing[] {
  const map = new Map<string, Standing>()

  for (const team of group.teams) {
    map.set(team.id, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      rank: 0,
      qualificationStatus: "pending",
    })
  }

  for (const match of group.matches) {
    if (match.status !== "played" || match.teamA === null || match.teamB === null) continue
    if (match.scoreA === null || match.scoreB === null) continue

    const a = map.get(match.teamA.id)!
    const b = map.get(match.teamB.id)!

    a.played++
    b.played++
    a.goalsFor += match.scoreA
    a.goalsAgainst += match.scoreB
    b.goalsFor += match.scoreB
    b.goalsAgainst += match.scoreA

    if (match.scoreA > match.scoreB) {
      a.won++; a.points += 3; b.lost++
    } else if (match.scoreB > match.scoreA) {
      b.won++; b.points += 3; a.lost++
    } else {
      a.drawn++; a.points++; b.drawn++; b.points++
    }

    a.goalDifference = a.goalsFor - a.goalsAgainst
    b.goalDifference = b.goalsFor - b.goalsAgainst
  }

  const sorted = Array.from(map.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    if (b.won !== a.won) return b.won - a.won
    return a.team.name.localeCompare(b.team.name)
  })

  return sorted.map((s, i) => ({ ...s, rank: i + 1 }))
}

export function applyQualificationStatus(standings: Standing[], groupStageComplete: boolean): Standing[] {
  return standings.map((s) => {
    if (s.rank === 1) return { ...s, qualificationStatus: "qualified" }
    if (s.rank === 2) return { ...s, qualificationStatus: "qualified" }
    if (s.rank === 3) return { ...s, qualificationStatus: groupStageComplete ? "third_possible" : "pending" }
    return { ...s, qualificationStatus: "eliminated" }
  })
}

export function areAllGroupMatchesPlayed(groups: Group[]): boolean {
  return groups.every((g) => g.matches.every((m) => m.status === "played"))
}

export function getGroupWinners(groups: Group[]): Team[] {
  return groups.map((g) => calculateStandings(g)[0].team)
}

export function getGroupRunnersUp(groups: Group[]): Team[] {
  return groups.map((g) => calculateStandings(g)[1].team)
}

export function getThirdPlacedStandings(groups: Group[]): Standing[] {
  return groups.map((g) => {
    const s = calculateStandings(g)
    return { ...s[2], qualificationStatus: "third_possible" as const }
  })
}

export function getBestThirdPlacedTeams(groups: Group[]): Team[] {
  const thirds = getThirdPlacedStandings(groups)
  const sorted = [...thirds].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    return a.team.name.localeCompare(b.team.name)
  })
  return sorted.slice(0, 8).map((s) => s.team)
}

export function getQualifiedTeams2026(groups: Group[]): {
  groupWinners: Team[]
  groupRunnersUp: Team[]
  thirdPlacedRankings: Standing[]
  bestThirdPlaced: Team[]
  qualifiedTeams: Team[]
} {
  const groupWinners = getGroupWinners(groups)
  const groupRunnersUp = getGroupRunnersUp(groups)
  const thirdPlacedRankings = getThirdPlacedStandings(groups)
  const bestThirdPlaced = getBestThirdPlacedTeams(groups)
  const qualifiedTeams = [...groupWinners, ...groupRunnersUp, ...bestThirdPlaced]
  return { groupWinners, groupRunnersUp, thirdPlacedRankings, bestThirdPlaced, qualifiedTeams }
}
