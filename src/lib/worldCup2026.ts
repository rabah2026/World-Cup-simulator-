// Dataset should be verified against the latest official FIFA groups before production release.
// Do not use FIFA logos or official protected visual assets.

import type { Team } from "@/types/tournament"

export const WORLD_CUP_2026_GROUPS: Record<string, Team[]> = {
  A: [
    { id: "mexico", name: "Mexico", shortName: "MEX", strength: 80, flagEmoji: "🇲🇽" },
    { id: "south-africa", name: "South Africa", shortName: "RSA", strength: 73, flagEmoji: "🇿🇦" },
    { id: "korea-republic", name: "Korea Republic", shortName: "KOR", strength: 79, flagEmoji: "🇰🇷" },
    { id: "czechia", name: "Czechia", shortName: "CZE", strength: 78, flagEmoji: "🇨🇿" },
  ],
  B: [
    { id: "canada", name: "Canada", shortName: "CAN", strength: 78, flagEmoji: "🇨🇦" },
    { id: "bosnia-and-herzegovina", name: "Bosnia and Herzegovina", shortName: "BIH", strength: 76, flagEmoji: "🇧🇦" },
    { id: "qatar", name: "Qatar", shortName: "QAT", strength: 73, flagEmoji: "🇶🇦" },
    { id: "switzerland", name: "Switzerland", shortName: "SUI", strength: 84, flagEmoji: "🇨🇭" },
  ],
  C: [
    { id: "brazil", name: "Brazil", shortName: "BRA", strength: 91, flagEmoji: "🇧🇷" },
    { id: "morocco", name: "Morocco", shortName: "MAR", strength: 84, flagEmoji: "🇲🇦" },
    { id: "haiti", name: "Haiti", shortName: "HAI", strength: 68, flagEmoji: "🇭🇹" },
    { id: "scotland", name: "Scotland", shortName: "SCO", strength: 78, flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  ],
  D: [
    { id: "usa", name: "United States", shortName: "USA", strength: 82, flagEmoji: "🇺🇸" },
    { id: "paraguay", name: "Paraguay", shortName: "PAR", strength: 78, flagEmoji: "🇵🇾" },
    { id: "australia", name: "Australia", shortName: "AUS", strength: 77, flagEmoji: "🇦🇺" },
    { id: "turkiye", name: "Türkiye", shortName: "TUR", strength: 81, flagEmoji: "🇹🇷" },
  ],
  E: [
    { id: "germany", name: "Germany", shortName: "GER", strength: 87, flagEmoji: "🇩🇪" },
    { id: "curacao", name: "Curaçao", shortName: "CUW", strength: 69, flagEmoji: "🇨🇼" },
    { id: "cote-divoire", name: "Côte d'Ivoire", shortName: "CIV", strength: 80, flagEmoji: "🇨🇮" },
    { id: "ecuador", name: "Ecuador", shortName: "ECU", strength: 82, flagEmoji: "🇪🇨" },
  ],
  F: [
    { id: "netherlands", name: "Netherlands", shortName: "NED", strength: 86, flagEmoji: "🇳🇱" },
    { id: "japan", name: "Japan", shortName: "JPN", strength: 82, flagEmoji: "🇯🇵" },
    { id: "sweden", name: "Sweden", shortName: "SWE", strength: 80, flagEmoji: "🇸🇪" },
    { id: "tunisia", name: "Tunisia", shortName: "TUN", strength: 76, flagEmoji: "🇹🇳" },
  ],
  G: [
    { id: "belgium", name: "Belgium", shortName: "BEL", strength: 85, flagEmoji: "🇧🇪" },
    { id: "egypt", name: "Egypt", shortName: "EGY", strength: 79, flagEmoji: "🇪🇬" },
    { id: "iran", name: "Iran", shortName: "IRN", strength: 78, flagEmoji: "🇮🇷" },
    { id: "new-zealand", name: "New Zealand", shortName: "NZL", strength: 70, flagEmoji: "🇳🇿" },
  ],
  H: [
    { id: "spain", name: "Spain", shortName: "ESP", strength: 89, flagEmoji: "🇪🇸" },
    { id: "cape-verde", name: "Cape Verde", shortName: "CPV", strength: 72, flagEmoji: "🇨🇻" },
    { id: "saudi-arabia", name: "Saudi Arabia", shortName: "KSA", strength: 75, flagEmoji: "🇸🇦" },
    { id: "uruguay", name: "Uruguay", shortName: "URU", strength: 84, flagEmoji: "🇺🇾" },
  ],
  I: [
    { id: "france", name: "France", shortName: "FRA", strength: 92, flagEmoji: "🇫🇷" },
    { id: "senegal", name: "Senegal", shortName: "SEN", strength: 82, flagEmoji: "🇸🇳" },
    { id: "iraq", name: "Iraq", shortName: "IRQ", strength: 73, flagEmoji: "🇮🇶" },
    { id: "norway", name: "Norway", shortName: "NOR", strength: 83, flagEmoji: "🇳🇴" },
  ],
  J: [
    { id: "argentina", name: "Argentina", shortName: "ARG", strength: 92, flagEmoji: "🇦🇷" },
    { id: "algeria", name: "Algeria", shortName: "ALG", strength: 78, flagEmoji: "🇩🇿" },
    { id: "austria", name: "Austria", shortName: "AUT", strength: 82, flagEmoji: "🇦🇹" },
    { id: "jordan", name: "Jordan", shortName: "JOR", strength: 72, flagEmoji: "🇯🇴" },
  ],
  K: [
    { id: "portugal", name: "Portugal", shortName: "POR", strength: 88, flagEmoji: "🇵🇹" },
    { id: "dr-congo", name: "DR Congo", shortName: "COD", strength: 74, flagEmoji: "🇨🇩" },
    { id: "uzbekistan", name: "Uzbekistan", shortName: "UZB", strength: 74, flagEmoji: "🇺🇿" },
    { id: "colombia", name: "Colombia", shortName: "COL", strength: 84, flagEmoji: "🇨🇴" },
  ],
  L: [
    { id: "england", name: "England", shortName: "ENG", strength: 89, flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { id: "croatia", name: "Croatia", shortName: "CRO", strength: 84, flagEmoji: "🇭🇷" },
    { id: "ghana", name: "Ghana", shortName: "GHA", strength: 77, flagEmoji: "🇬🇭" },
    { id: "panama", name: "Panama", shortName: "PAN", strength: 72, flagEmoji: "🇵🇦" },
  ],
}

export const GROUP_ORDER = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const
export type GroupKey = typeof GROUP_ORDER[number]
