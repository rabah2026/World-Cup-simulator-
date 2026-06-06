'use client'

import { Home, Grid3X3, Medal, Trophy, Crown } from 'lucide-react'
import { motion } from 'framer-motion'
import type { AppScreen } from '@/types/tournament'
import { cn } from '@/lib/utils'

type BottomNavProps = {
  currentScreen: AppScreen
  onChange: (screen: AppScreen) => void
  availability: {
    groups: boolean
    thirds: boolean
    knockout: boolean
    champion: boolean
  }
}

const navItems: { id: AppScreen; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'groups', label: 'Groups', icon: Grid3X3 },
  { id: 'third-place', label: 'Thirds', icon: Medal },
  { id: 'knockout', label: 'Bracket', icon: Trophy },
  { id: 'champion', label: 'Champion', icon: Crown },
]

export function BottomNav({ currentScreen, onChange, availability }: BottomNavProps) {
  const isAvailable = (id: AppScreen) => {
    if (id === 'home') return true
    if (id === 'groups') return availability.groups
    if (id === 'third-place') return availability.thirds
    if (id === 'knockout') return availability.knockout
    if (id === 'champion') return availability.champion
    return false
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div
        className="mx-auto max-w-lg px-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <div className="glass rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-around px-1.5 py-2">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = currentScreen === id
              const available = isAvailable(id)
              return (
                <button
                  key={id}
                  onClick={() => available && onChange(id)}
                  disabled={!available}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl min-w-[54px] transition-opacity',
                    !available && 'opacity-25 cursor-not-allowed',
                    available && 'cursor-pointer',
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 rounded-xl bg-[#00D084]/12 border border-[#00D084]/25"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <div className="relative flex flex-col items-center gap-1">
                    <Icon
                      size={20}
                      className={cn('transition-colors', active ? 'text-[#00D084]' : 'text-[#94A3B8]')}
                    />
                    <span
                      className={cn(
                        'text-[10px] font-semibold transition-colors',
                        active ? 'text-[#00D084]' : 'text-[#94A3B8]',
                      )}
                    >
                      {label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
