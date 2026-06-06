import type { Tournament } from "@/types/tournament"

const KEY = "world-cup-2026-simulator-state"

export function saveTournament(tournament: Tournament): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(tournament))
  } catch {
    // localStorage unavailable or full
  }
}

export function loadTournament(): Tournament | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Tournament
    if (!parsed.id || !parsed.groups || !parsed.stage) return null
    return parsed
  } catch {
    return null
  }
}

export function resetTournament(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export function hasSavedTournament(): boolean {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as Tournament
    return !!parsed.id && parsed.stage !== "not_started"
  } catch {
    return false
  }
}
