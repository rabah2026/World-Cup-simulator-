import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(scoreA: number | null, scoreB: number | null): string {
  if (scoreA === null || scoreB === null) return "vs"
  return `${scoreA} - ${scoreB}`
}

export function getKnockoutRoundLabel(round: string): string {
  const labels: Record<string, string> = {
    round_of_32: "Round of 32",
    round_of_16: "Round of 16",
    quarter_final: "Quarter Final",
    semi_final: "Semi Final",
    third_place: "Third Place",
    final: "Final",
  }
  return labels[round] ?? round
}

export function getKnockoutRoundShort(round: string): string {
  const labels: Record<string, string> = {
    round_of_32: "R32",
    round_of_16: "R16",
    quarter_final: "QF",
    semi_final: "SF",
    third_place: "3rd",
    final: "Final",
  }
  return labels[round] ?? round
}
