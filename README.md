# World Cup 2026 Simulator

A premium mobile-first fan simulator for the 2026 FIFA World Cup.
Simulate the complete tournament — 48 teams, 12 groups, Round of 32 through to the Final.

> **Unofficial fan-made simulator. Not affiliated with FIFA or the FIFA World Cup.**

---

## Features

- Real 2026 World Cup 48-team, 12-group format (Groups A–L)
- Simulate individual matches or entire groups at once
- Live standings with goal difference tiebreakers
- Third-place race: best 8 third-placed teams qualify
- Round of 32 bracket generation
- Full knockout stage: R32 → R16 → QF → SF → 3rd Place → Final
- Penalty shootout simulation for tied knockout matches
- Cinematic champion reveal with confetti
- Tournament stats: goals, biggest win, best defense
- Share result via Web Share API or clipboard
- Local persistence via `localStorage` — continue saved tournaments
- Mobile-first, dark stadium design with Framer Motion animations

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 15 | App framework |
| React 19 | UI |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| localStorage | Persistence |

No backend. No database. No authentication. No environment variables.

---

## Run Locally

```bash
git clone https://github.com/rabah2026/world-cup-simulator-
cd world-cup-simulator-
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Framework: **Next.js** (auto-detected)
4. Deploy — no environment variables needed

---

## Tournament Format

- **48 teams** across **12 groups** (A–L), 4 teams each
- **6 matches per group** (72 group-stage matches total)
- Top 2 from each group qualify automatically (24 teams)
- Best 8 third-placed teams qualify (8 teams)
- **32 teams** enter the knockout stage
- Knockout rounds: R32 (16 matches) → R16 (8) → QF (4) → SF (2) → 3rd Place (1) → Final (1)
- **104 total matches**

---

## Simulation Logic

Matches use a strength-based probability model:

- Each team has a `strength` rating (68–92)
- Expected goals derived from relative team strength
- Randomness layered on top for upsets
- Group matches can end in draws
- Knockout matches use penalty shootout if tied after 90 minutes
- Penalty winner is determined probabilistically by relative strength

---

## MVP Limitations

- Dataset should be verified against the latest official FIFA groups before production release
- Round of 32 uses a simplified deterministic seeding system (not the exact FIFA third-place pairing matrix)
- No real fixture dates or stadium information
- Flag emojis used instead of official badges (no copyrighted assets)

---

## Legal

This is an **unofficial fan-made simulator**. It does not use official FIFA logos, branding, mascots, trophy images, or protected visual identity. The name "World Cup 2026 Simulator" and "CupSim 26" are original fan branding.

---

## Roadmap

- [ ] Exact official FIFA knockout pairing matrix for third-place teams
- [ ] Official fixture dates and stadium display
- [ ] Live match mode with commentary
- [ ] Real team badge images
- [ ] Team profiles and history
- [ ] Shareable result pages (unique URLs)
- [ ] AI match commentary
- [ ] Prediction mode (predict before simulating)
- [ ] User accounts and cloud saves
- [ ] Multiplayer prediction leagues
- [ ] Arabic RTL version
