import type { Match, Group, Team } from "@/types/tournament"

function generateGoals(strength: number, opponentStrength: number): number {
  const advantage = (strength - opponentStrength) / 25
  const expected = 1.25 + advantage
  const random = Math.random()

  if (random < 0.12) return 0
  if (random < 0.38) return Math.max(0, Math.round(expected))
  if (random < 0.68) return Math.max(0, Math.round(expected + Math.random()))
  if (random < 0.88) return Math.max(0, Math.round(expected + 1))
  if (random < 0.97) return Math.max(0, Math.round(expected + 2))
  return Math.min(6, Math.max(0, Math.round(expected + 3)))
}

function simulatePenalties(teamA: Team, teamB: Team): {
  penaltyScoreA: number
  penaltyScoreB: number
  winnerId: string
} {
  const sequences = [
    { a: 5, b: 4 }, { a: 5, b: 3 }, { a: 4, b: 3 },
    { a: 4, b: 2 }, { a: 3, b: 2 }, { a: 5, b: 4 }, { a: 6, b: 5 },
  ]
  const seq = sequences[Math.floor(Math.random() * sequences.length)]
  const aWins = Math.random() < (teamA.strength / (teamA.strength + teamB.strength))
  return {
    penaltyScoreA: aWins ? seq.a : seq.b,
    penaltyScoreB: aWins ? seq.b : seq.a,
    winnerId: aWins ? teamA.id : teamB.id,
  }
}

export function simulateMatch(match: Match, knockout = false): Match {
  if (!match.teamA || !match.teamB) return match

  const scoreA = generateGoals(match.teamA.strength, match.teamB.strength)
  const scoreB = generateGoals(match.teamB.strength, match.teamA.strength)

  const updated: Match = {
    ...match,
    scoreA,
    scoreB,
    status: "played",
  }

  if (knockout && scoreA === scoreB) {
    const penalties = simulatePenalties(match.teamA, match.teamB)
    updated.penaltyScoreA = penalties.penaltyScoreA
    updated.penaltyScoreB = penalties.penaltyScoreB
    updated.penaltyWinnerId = penalties.winnerId
    updated.winnerId = penalties.winnerId
  } else if (scoreA > scoreB) {
    updated.winnerId = match.teamA.id
  } else if (scoreB > scoreA) {
    updated.winnerId = match.teamB.id
  }

  return updated
}

export function simulateGroupMatch(match: Match): Match {
  return simulateMatch(match, false)
}

export function simulateKnockoutMatch(match: Match): Match {
  return simulateMatch(match, true)
}

export function simulateAllGroupMatches(group: Group): Group {
  return {
    ...group,
    matches: group.matches.map((m) =>
      m.status === "not_played" ? simulateGroupMatch(m) : m
    ),
  }
}
