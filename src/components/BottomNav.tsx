'use client'

import { Home, Grid3X3, Medal, Trophy, Crown } from 'lucide-react'
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
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="glass border-t border-white/10 mx-auto max-w-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = currentScreen === id
            const available = isAvailable(id)
            return (
              <button
                key={id}
                onClick={() => available && onChange(id)}
                disabled={!available}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[52px]',
                  active && 'bg-white/10',
                  !available && 'opacity-30 cursor-not-allowed',
                  available && !active && 'hover:bg-white/5 cursor-pointer',
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    'transition-colors',
                    active ? 'text-[#00D084]' : 'text-[#94A3B8]',
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    active ? 'text-[#00D084]' : 'text-[#94A3B8]',
                  )}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
