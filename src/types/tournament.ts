export type MatchStatus = "not_played" | "played"

export type TournamentStage =
  | "not_started"
  | "group_stage"
  | "group_stage_complete"
  | "knockout"
  | "complete"

export type KnockoutRound =
  | "round_of_32"
  | "round_of_16"
  | "quarter_final"
  | "semi_final"
  | "third_place"
  | "final"

export type Team = {
  id: string
  name: string
  shortName: string
  strength: number
  flagEmoji?: string
}

export type Match = {
  id: string
  round: string
  groupId?: string
  matchday?: number
  teamA: Team | null
  teamB: Team | null
  scoreA: number | null
  scoreB: number | null
  penaltyScoreA?: number | null
  penaltyScoreB?: number | null
  penaltyWinnerId?: string
  winnerId?: string
  status: MatchStatus
}

export type Group = {
  id: string
  name: string
  teams: Team[]
  matches: Match[]
}

export type Standing = {
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  rank: number
  qualificationStatus: "qualified" | "third_possible" | "eliminated" | "pending"
}

export type KnockoutBracket = {
  roundOf32: Match[]
  roundOf16: Match[]
  quarterFinals: Match[]
  semiFinals: Match[]
  thirdPlace: Match[]
  final: Match[]
}

export type TournamentStats = {
  totalGoals: number
  totalMatchesPlayed: number
  highestScoringTeam: Team | null
  bestDefenseTeam: Team | null
  biggestWin: Match | null
  champion: Team | null
  runnerUp: Team | null
  thirdPlace: Team | null
}

export type Tournament = {
  id: string
  name: string
  stage: TournamentStage
  groups: Group[]
  knockout: KnockoutBracket
  champion?: Team
  createdAt: string
  updatedAt: string
}

export type AppScreen = "home" | "groups" | "third-place" | "knockout" | "champion"
