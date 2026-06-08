import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tournament, Match, Team } from '@/types/tournament'
import { createTournament } from '@/lib/tournament'
import { saveTournament, loadTournament } from '@/lib/storage'
import { simulateKnockoutMatch, simulateGroupMatch } from '@/lib/simulator'
import { advanceKnockout, isRoundComplete } from '@/lib/knockout'
import { simulateAllGroupMatches } from '@/lib/simulator'
import { areAllGroupMatchesPlayed } from '@/lib/standings'

export type AppMode = 'view' | 'predict'
export type ActiveTab = 'GS' | 'R32' | 'R16' | 'QF' | 'SF' | 'F' | 'MY'

export type Prediction = {
  matchId: string
  winnerId: string
  winnerName: string
  winnerFlag: string
}

export type CelebrationState = {
  active: boolean
  teamId: string
  teamName: string
  teamFlag: string
  teamColor: string
  message: string
}

export type SimulationStep = {
  matchId: string
  round: string
  winner: Team
  isComplete: boolean
}

interface BracketState {
  // Tournament
  tournament: Tournament | null

  // UI State
  mode: AppMode
  activeTab: ActiveTab

  // Predictions
  predictions: Record<string, Prediction>

  // Simulation
  isSimulating: boolean
  simulationSteps: SimulationStep[]
  currentSimStep: number

  // Celebration
  celebration: CelebrationState | null

  // Easter eggs
  trophyClickCount: number
  chaosMode: boolean
  goatTeamId: string | null

  // Live fake state
  liveMatchId: string | null
  liveScore: { a: number; b: number }

  // Actions
  initTournament: () => void
  loadSaved: () => void
  setMode: (mode: AppMode) => void
  setActiveTab: (tab: ActiveTab) => void
  makePrediction: (matchId: string, winner: Team) => void
  clearPredictions: () => void
  simulateTournament: () => void
  stepSimulation: () => void
  finishSimulation: () => void
  simulateMatch: (matchId: string, round: string) => void
  simulateRound: (roundKey: string) => void
  simulateGroupStage: () => void
  generateKnockout: () => void
  dismissCelebration: () => void
  clickTrophy: () => void
  setGoatTeam: (teamId: string | null) => void
  startFakeLive: (matchId: string) => void
  reset: () => void
}

// Team colors for celebrations
const TEAM_COLORS: Record<string, string> = {
  brazil: '#009C3B',
  argentina: '#74ACDF',
  france: '#003189',
  germany: '#000000',
  spain: '#AA151B',
  england: '#CF091F',
  portugal: '#006600',
  netherlands: '#FF6600',
  belgium: '#EF3340',
  usa: '#002868',
  mexico: '#006847',
  canada: '#FF0000',
  'korea-republic': '#003478',
  japan: '#BC002D',
  morocco: '#C1272D',
  senegal: '#00853F',
  default: '#0A84FF',
}

const FUN_MESSAGES = [
  "They're through! 🔥",
  "What a result! 🎉",
  "Unbelievable! 🤯",
  "Champions in the making! 👑",
  "Into the next round! ⚡",
  "The crowd goes wild! 🏟️",
  "GOATED performance! 🐐",
  "History in the making! 🏆",
]

export const useBracketStore = create<BracketState>()(
  persist(
    (set, get) => ({
      tournament: null,
      mode: 'view',
      activeTab: 'GS',
      predictions: {},
      isSimulating: false,
      simulationSteps: [],
      currentSimStep: 0,
      celebration: null,
      trophyClickCount: 0,
      chaosMode: false,
      goatTeamId: null,
      liveMatchId: null,
      liveScore: { a: 0, b: 0 },

      initTournament: () => {
        const t = createTournament()
        saveTournament(t)
        set({ tournament: t, activeTab: 'GS' })
      },

      loadSaved: () => {
        const saved = loadTournament()
        if (saved) {
          set({ tournament: saved })
        } else {
          get().initTournament()
        }
      },

      setMode: (mode) => set({ mode }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      makePrediction: (matchId, winner) => {
        const color = TEAM_COLORS[winner.id] ?? TEAM_COLORS.default
        set((state) => ({
          predictions: {
            ...state.predictions,
            [matchId]: {
              matchId,
              winnerId: winner.id,
              winnerName: winner.name,
              winnerFlag: winner.flagEmoji ?? '🏳️',
            },
          },
          celebration: {
            active: true,
            teamId: winner.id,
            teamName: winner.name,
            teamFlag: winner.flagEmoji ?? '🏳️',
            teamColor: color,
            message: FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)],
          },
        }))
      },

      clearPredictions: () => set({ predictions: {} }),

      simulateTournament: () => {
        const { tournament, chaosMode } = get()
        if (!tournament) return
        // Build simulation steps from predictions or random
        const steps: SimulationStep[] = []
        // This is simplified - in real implementation would build full sim
        set({ isSimulating: true, simulationSteps: steps, currentSimStep: 0 })
      },

      stepSimulation: () => {
        const { currentSimStep, simulationSteps } = get()
        if (currentSimStep < simulationSteps.length - 1) {
          set({ currentSimStep: currentSimStep + 1 })
        } else {
          get().finishSimulation()
        }
      },

      finishSimulation: () => {
        set({ isSimulating: false, simulationSteps: [], currentSimStep: 0 })
      },

      simulateMatch: (matchId, roundKey) => {
        const { tournament, chaosMode } = get()
        if (!tournament) return

        // Find the match in the appropriate round
        const roundMap: Record<string, keyof typeof tournament.knockout> = {
          roundOf32: 'roundOf32',
          roundOf16: 'roundOf16',
          quarterFinals: 'quarterFinals',
          semiFinals: 'semiFinals',
          thirdPlace: 'thirdPlace',
          final: 'final',
        }

        const key = roundMap[roundKey]
        if (!key) return

        const matches = tournament.knockout[key] as Match[]
        const match = matches.find((m) => m.id === matchId)
        if (!match || match.status === 'played') return

        let simulated = simulateKnockoutMatch(match)

        // Chaos mode: underdog wins
        if (chaosMode && simulated.winnerId && match.teamA && match.teamB) {
          const weaker = match.teamA.strength < match.teamB.strength ? match.teamA : match.teamB
          simulated = { ...simulated, winnerId: weaker.id }
        }

        const updatedMatches = matches.map((m) => m.id === matchId ? simulated : m)
        let updated: Tournament = {
          ...tournament,
          knockout: { ...tournament.knockout, [key]: updatedMatches },
          updatedAt: new Date().toISOString(),
        }
        updated = advanceKnockout(updated)
        saveTournament(updated)

        // Trigger celebration
        const winner = simulated.winnerId === match.teamA?.id ? match.teamA : match.teamB
        if (winner) {
          const color = TEAM_COLORS[winner.id] ?? TEAM_COLORS.default
          set({
            tournament: updated,
            celebration: {
              active: true,
              teamId: winner.id,
              teamName: winner.name,
              teamFlag: winner.flagEmoji ?? '🏳️',
              teamColor: color,
              message: FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)],
            },
          })
        } else {
          set({ tournament: updated })
        }
      },

      simulateRound: (roundKey) => {
        const { tournament, chaosMode } = get()
        if (!tournament) return

        const roundMap: Record<string, keyof typeof tournament.knockout> = {
          roundOf32: 'roundOf32',
          roundOf16: 'roundOf16',
          quarterFinals: 'quarterFinals',
          semiFinals: 'semiFinals',
          thirdPlace: 'thirdPlace',
          final: 'final',
        }

        const key = roundMap[roundKey]
        if (!key) return

        const matches = tournament.knockout[key] as Match[]
        const updatedMatches = matches.map((m) => {
          if (m.status === 'played') return m
          let sim = simulateKnockoutMatch(m)
          if (chaosMode && sim.winnerId && m.teamA && m.teamB) {
            const weaker = m.teamA.strength < m.teamB.strength ? m.teamA : m.teamB
            sim = { ...sim, winnerId: weaker.id }
          }
          return sim
        })

        let updated: Tournament = {
          ...tournament,
          knockout: { ...tournament.knockout, [key]: updatedMatches },
          updatedAt: new Date().toISOString(),
        }
        updated = advanceKnockout(updated)
        saveTournament(updated)
        set({ tournament: updated })
      },

      simulateGroupStage: () => {
        const { tournament } = get()
        if (!tournament) return

        const updatedGroups = tournament.groups.map((g) => simulateAllGroupMatches(g))
        let updated: Tournament = {
          ...tournament,
          groups: updatedGroups,
          stage: 'group_stage_complete',
          updatedAt: new Date().toISOString(),
        }
        saveTournament(updated)
        set({ tournament: updated })
      },

      generateKnockout: () => {
        const { tournament } = get()
        if (!tournament) return

        const advanced = advanceKnockout(tournament)
        saveTournament(advanced)
        set({ tournament: advanced, activeTab: 'R32' })
      },

      dismissCelebration: () => set({ celebration: null }),

      clickTrophy: () => {
        const { trophyClickCount } = get()
        const newCount = trophyClickCount + 1
        if (newCount >= 5) {
          set({
            trophyClickCount: 0,
            chaosMode: !get().chaosMode,
          })
        } else {
          set({ trophyClickCount: newCount })
        }
      },

      setGoatTeam: (teamId) => set({ goatTeamId: teamId }),

      startFakeLive: (matchId) => {
        set({ liveMatchId: matchId, liveScore: { a: 0, b: 0 } })
      },

      reset: () => {
        const t = createTournament()
        saveTournament(t)
        set({
          tournament: t,
          mode: 'view',
          activeTab: 'GS',
          predictions: {},
          isSimulating: false,
          celebration: null,
          chaosMode: false,
          goatTeamId: null,
        })
      },
    }),
    {
      name: 'wc2026-bracket-store',
      partialize: (state) => ({
        tournament: state.tournament,
        predictions: state.predictions,
        chaosMode: state.chaosMode,
        goatTeamId: state.goatTeamId,
      }),
    }
  )
)
