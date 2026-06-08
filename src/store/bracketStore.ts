import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Tournament, Match } from '@/types/tournament'
import { createTournament } from '@/lib/tournament'
import { saveTournament, loadTournament } from '@/lib/storage'

export type ActiveTab = 'GS' | 'R32' | 'R16' | 'QF' | 'SF' | 'F'

interface BracketState {
  tournament: Tournament | null
  activeTab: ActiveTab

  loadSaved: () => void
  setActiveTab: (tab: ActiveTab) => void
}

function emptyMatch(id: string, round: string): Match {
  return { id, round, teamA: null, teamB: null, scoreA: null, scoreB: null, status: 'not_played' }
}

function buildCleanTournament(): Tournament {
  const t = createTournament()
  // Pre-generate all bracket slots with TBD teams so every tab is navigable.
  // Group stage is unplayed (0 pts) — exactly like Apple Sports before the tournament.
  return {
    ...t,
    knockout: {
      roundOf32:    Array.from({ length: 16 }, (_, i) => emptyMatch(`r32-m${i + 1}`, 'round_of_32')),
      roundOf16:    Array.from({ length: 8 },  (_, i) => emptyMatch(`round_of_16-m${i + 1}`, 'round_of_16')),
      quarterFinals:Array.from({ length: 4 },  (_, i) => emptyMatch(`quarter_final-m${i + 1}`, 'quarter_final')),
      semiFinals:   Array.from({ length: 2 },  (_, i) => emptyMatch(`semi_final-m${i + 1}`, 'semi_final')),
      thirdPlace:   [emptyMatch('third-place-m1', 'third_place')],
      final:        [emptyMatch('final-m1', 'final')],
    },
  }
}

export const useBracketStore = create<BracketState>()(
  persist(
    (set) => ({
      tournament: null,
      activeTab: 'GS',

      loadSaved: () => {
        const saved = loadTournament()
        // Accept saved data only if it looks like the clean (unplayed) format.
        // Any tournament where the final has been played is old simulated data — reset it.
        if (saved && saved.knockout.roundOf32.length > 0 && saved.knockout.final[0]?.status !== 'played') {
          set({ tournament: saved })
        } else {
          const t = buildCleanTournament()
          saveTournament(t)
          set({ tournament: t })
        }
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'wc2026-bracket-v2',
      partialize: (state) => ({
        tournament: state.tournament,
      }),
    }
  )
)
