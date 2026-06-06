import type { Tournament, TournamentStats, Match } from "@/types/tournament"
import { getWinner } from "./knockout"

export function calculateStats(tournament: Tournament): TournamentStats {
  const allGroupMatches = tournament.groups.flatMap((g) => g.matches)
  const allKnockoutMatches = [
    ...tournament.knockout.roundOf32,
    ...tournament.knockout.roundOf16,
    ...tournament.knockout.quarterFinals,
    ...tournament.knockout.semiFinals,
    ...tournament.knockout.thirdPlace,
    ...tournament.knockout.final,
  ]
  const allMatches = [...allGroupMatches, ...allKnockoutMatches].filter(
    (m) => m.status === "played" && m.scoreA !== null && m.scoreB !== null
  )

  const totalGoals = allMatches.reduce((sum, m) => sum + (m.scoreA ?? 0) + (m.scoreB ?? 0), 0)
  const totalMatchesPlayed = allMatches.length

  // Goals per team
  const goalMap = new Map<string, number>()
  const concededMap = new Map<string, number>()
  for (const m of allMatches) {
    if (!m.teamA || !m.teamB) continue
    goalMap.set(m.teamA.id, (goalMap.get(m.teamA.id) ?? 0) + (m.scoreA ?? 0))
    goalMap.set(m.teamB.id, (goalMap.get(m.teamB.id) ?? 0) + (m.scoreB ?? 0))
    concededMap.set(m.teamA.id, (concededMap.get(m.teamA.id) ?? 0) + (m.scoreB ?? 0))
    concededMap.set(m.teamB.id, (concededMap.get(m.teamB.id) ?? 0) + (m.scoreA ?? 0))
  }

  const allTeams = tournament.groups.flatMap((g) => g.teams)
  const teamById = new Map(allTeams.map((t) => [t.id, t]))

  let highestScoringTeam = null
  let maxGoals = -1
  for (const [id, goals] of goalMap) {
    if (goals > maxGoals) { maxGoals = goals; highestScoringTeam = teamById.get(id) ?? null }
  }

  let bestDefenseTeam = null
  let minConceded = Infinity
  for (const [id, conceded] of concededMap) {
    if (conceded < minConceded) { minConceded = conceded; bestDefenseTeam = teamById.get(id) ?? null }
  }

  let biggestWin: Match | null = null
  let maxDiff = 0
  for (const m of allMatches) {
    const diff = Math.abs((m.scoreA ?? 0) - (m.scoreB ?? 0))
    if (diff > maxDiff) { maxDiff = diff; biggestWin = m }
  }

  const champion = tournament.champion ?? null
  const runnerUp = tournament.knockout.final[0]
    ? (getWinner(tournament.knockout.final[0])?.id === champion?.id
      ? (tournament.knockout.final[0].teamA?.id === champion?.id
        ? tournament.knockout.final[0].teamB
        : tournament.knockout.final[0].teamA)
      : null)
    : null
  const thirdPlace = tournament.knockout.thirdPlace[0]
    ? getWinner(tournament.knockout.thirdPlace[0])
    : null

  return {
    totalGoals,
    totalMatchesPlayed,
    highestScoringTeam: highestScoringTeam ?? null,
    bestDefenseTeam: bestDefenseTeam ?? null,
    biggestWin,
    champion,
    runnerUp: runnerUp ?? null,
    thirdPlace: thirdPlace ?? null,
  }
}
