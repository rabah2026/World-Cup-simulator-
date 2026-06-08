'use client'
import { X } from 'lucide-react'
import { useBracketStore } from '@/store/bracketStore'

export function Header() {
  const { chaosMode } = useBracketStore()
  return (
    <div className="px-5 pt-4 pb-2">
      <div className="flex items-center relative mb-3">
        {/* X close button — dark circle */}
        <button className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center">
          <X size={16} className="text-white" strokeWidth={2.5} />
        </button>
        {/* Trophy icon centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-3xl">🏆</span>
        </div>
      </div>
      {/* Title */}
      <div className="text-center">
        <h1 className="text-white font-bold text-xl tracking-tight">FIFA World Cup 2026</h1>
        {chaosMode && <div className="text-purple-400 text-xs font-bold mt-0.5">🌀 CHAOS MODE</div>}
      </div>
    </div>
  )
}
