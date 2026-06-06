import type { Tournament, Match, Team, KnockoutRound } from "@/types/tournament"
import { getQualifiedTeams2026 } from "./standings"
import { simulateKnockoutMatch } from "./simulator"

function makeKnockoutMatch(id: string, round: KnockoutRound, teamA: Team | null, teamB: Team | null): Match {
  return {
    id,
    round,
    teamA,
    teamB,
    scoreA: null,
    scoreB: null,
    status: "not_played",
  }
}

export function getWinner(match: Match): Team | null {
  if (match.status !== "played") return null
  if (match.winnerId === match.teamA?.id) return match.teamA
  if (match.winnerId === match.teamB?.id) return match.teamB
  return null
}

export function getLoser(match: Match): Team | null {
  if (match.status !== "played") return null
  if (match.winnerId === match.teamA?.id) return match.teamB
  if (match.winnerId === match.teamB?.id) return match.teamA
  return null
}

export function isRoundComplete(matches: Match[]): boolean {
  return matches.length > 0 && matches.every((m) => m.status === "played")
}

export function generateRoundOf32(qualifiedTeams: Team[]): Match[] {
  // Seeds: 12 winners (pot A), 12 runners-up (pot B), 8 best thirds (pot C)
  // winners[i] vs bestThirds[i % 8] or runnersUp in alternating fashion
  // Simple deterministic pairing: winner[i] vs runnerUp[11-i], thirds fill slots 25-32
  const winners = qualifiedTeams.slice(0, 12)
  const runners = qualifiedTeams.slice(12, 24)
  const thirds = qualifiedTeams.slice(24, 32)

  const matches: Match[] = []

  // 8 matches: winner[i] vs runner[11-i] (cross-group style)
  for (let i = 0; i < 8; i++) {
    matches.push(makeKnockoutMatch(
      `r32-m${i + 1}`, "round_of_32",
      winners[i], runners[11 - i]
    ))
  }

  // 4 matches: winners[8-11] vs thirds[0-3]
  for (let i = 0; i < 4; i++) {
    matches.push(makeKnockoutMatch(
      `r32-m${i + 9}`, "round_of_32",
      winners[8 + i], thirds[i]
    ))
  }

  // 4 matches: runners[0-3] vs thirds[4-7]
  for (let i = 0; i < 4; i++) {
    matches.push(makeKnockoutMatch(
      `r32-m${i + 13}`, "round_of_32",
      runners[i], thirds[4 + i]
    ))
  }

  return matches
}

export function generateNextRound(previousRound: Match[], nextRound: KnockoutRound): Match[] {
  const winners: (Team | null)[] = previousRound.map(getWinner)
  const matches: Match[] = []
  for (let i = 0; i < winners.length; i += 2) {
    matches.push(makeKnockoutMatch(
      `${nextRound}-m${i / 2 + 1}`,
      nextRound,
      winners[i],
      winners[i + 1]
    ))
  }
  return matches
}

export function generateThirdPlace(semiFinals: Match[]): Match[] {
  const loserA = getLoser(semiFinals[0])
  const loserB = getLoser(semiFinals[1])
  return [makeKnockoutMatch("third-place-m1", "third_place", loserA, loserB)]
}

export function advanceKnockout(tournament: Tournament): Tournament {
  const { groups, knockout } = tournament
  const { qualifiedTeams } = getQualifiedTeams2026(groups)

  let updated = { ...knockout }

  if (updated.roundOf32.length === 0) {
    updated.roundOf32 = generateRoundOf32(qualifiedTeams)
  } else if (isRoundComplete(updated.roundOf32) && updated.roundOf16.length === 0) {
    updated.roundOf16 = generateNextRound(updated.roundOf32, "round_of_16")
  } else if (isRoundComplete(updated.roundOf16) && updated.quarterFinals.length === 0) {
    updated.quarterFinals = generateNextRound(updated.roundOf16, "quarter_final")
  } else if (isRoundComplete(updated.quarterFinals) && updated.semiFinals.length === 0) {
    updated.semiFinals = generateNextRound(updated.quarterFinals, "semi_final")
  } else if (isRoundComplete(updated.semiFinals) && updated.thirdPlace.length === 0) {
    updated.thirdPlace = generateThirdPlace(updated.semiFinals)
    updated.final = generateNextRound(updated.semiFinals, "final")
  }

  let stage = tournament.stage
  let champion = tournament.champion

  if (isRoundComplete(updated.final) && updated.final.length > 0) {
    champion = getWinner(updated.final[0]) ?? undefined
    stage = "complete"
  } else if (updated.roundOf32.length > 0) {
    stage = "knockout"
  }

  return {
    ...tournament,
    knockout: updated,
    stage,
    champion,
    updatedAt: new Date().toISOString(),
  }
}

export function simulateKnockoutMatchInTournament(
  tournament: Tournament,
  round: keyof typeof tournament.knockout,
  matchId: string
): Tournament {
  const roundMatches = tournament.knockout[round]
  const updated = roundMatches.map((m) =>
    m.id === matchId ? simulateKnockoutMatch(m) : m
  )
  const newKnockout = { ...tournament.knockout, [round]: updated }
  let newTournament = { ...tournament, knockout: newKnockout, updatedAt: new Date().toISOString() }

  // Auto advance if round complete
  newTournament = advanceKnockout(newTournament)
  return newTournament
}
