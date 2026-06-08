'use client'

import { X } from 'lucide-react'
import { useBracketStore } from '@/store/bracketStore'

export function Header() {
  const { chaosMode, clickTrophy } = useBracketStore()

  return (
    <div className="px-5 pt-4 pb-2">
      {/* Top row: X button + centered trophy */}
      <div className="flex items-center relative mb-3">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <X size={16} className="text-white" strokeWidth={2.5} />
        </button>

        {/* Trophy — tap 5× for Chaos Mode easter egg */}
        <button
          onClick={clickTrophy}
          className="absolute inset-0 flex items-center justify-center pointer-events-auto"
        >
          <span className="text-[28px] leading-none">🏆</span>
        </button>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-white font-bold text-[20px] tracking-tight leading-tight">
          FIFA World Cup 2026
        </h1>
        {chaosMode && (
          <p className="text-purple-300 text-[11px] font-bold mt-0.5 tracking-wide">
            🌀 CHAOS MODE ACTIVE
          </p>
        )}
      </div>
    </div>
  )
}
