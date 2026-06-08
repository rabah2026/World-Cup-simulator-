import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tournament, Match } from '@/types/tournament'
import { createTournament } from '@/lib/tournament'
import { saveTournament, loadTournament } from '@/lib/storage'
import { simulateAllGroupMatches } from '@/lib/simulator'
import { advanceKnockout } from '@/lib/knockout'
import { simulateKnockoutMatch } from '@/lib/simulator'

export type ActiveTab = 'GS' | 'R32' | 'R16' | 'QF' | 'SF' | 'F'

interface BracketState {
  tournament: Tournament | null
  activeTab: ActiveTab

  loadSaved: () => void
  setActiveTab: (tab: ActiveTab) => void
}

function buildFullTournament(): Tournament {
  let t = createTournament()

  // Simulate all group stage matches
  t = { ...t, groups: t.groups.map((g) => simulateAllGroupMatches(g)) }

  // Generate Round of 32 from group results
  t = advanceKnockout(t)

  // Simulate all knockout rounds through the final
  const rounds: Array<keyof typeof t.knockout> = [
    'roundOf32', 'roundOf16', 'quarterFinals', 'semiFinals', 'thirdPlace', 'final',
  ]

  for (const key of rounds) {
    const matches = t.knockout[key] as Match[]
    if (!matches || matches.length === 0) continue
    const simulated = matches.map((m: Match) =>
      m.status === 'played' ? m : simulateKnockoutMatch(m)
    )
    t = { ...t, knockout: { ...t.knockout, [key]: simulated } }
    t = advanceKnockout(t)
  }

  return t
}

export const useBracketStore = create<BracketState>()(
  persist(
    (set, get) => ({
      tournament: null,
      activeTab: 'GS',

      loadSaved: () => {
        const saved = loadTournament()
        if (saved && saved.knockout.roundOf32.length > 0) {
          set({ tournament: saved })
        } else {
          const t = buildFullTournament()
          saveTournament(t)
          set({ tournament: t })
        }
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'wc2026-bracket-store',
      partialize: (state) => ({
        tournament: state.tournament,
      }),
    }
  )
)
