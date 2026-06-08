'use client'

import { X } from 'lucide-react'

export function Header() {
  return (
    <div className="px-5 pt-4 pb-2">
      <div className="flex items-center relative mb-3">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <X size={16} className="text-white" strokeWidth={2.5} />
        </button>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[28px] leading-none">🏆</span>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-white font-bold text-[20px] tracking-tight leading-tight">
          FIFA World Cup 2026
        </h1>
      </div>
    </div>
  )
}
