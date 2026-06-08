'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Trash2, Crown, Share2 } from 'lucide-react'
import { useBracketStore } from '@/store/bracketStore'
import { useConfetti } from '@/hooks/useConfetti'

const FUN_STATS = [
  { label: 'Prediction Accuracy', getValue: (total: number, correct: number) => correct + '/' + total },
  { label: 'Upset Picks', getValue: () => Math.floor(Math.random() * 5) + '' },
  { label: 'Dark Horse Score', getValue: () => Math.floor(Math.random() * 100) + '%' },
]

export function MyBracket() {
  const { predictions, tournament, clearPredictions, setActiveTab, mode, setMode } = useBracketStore()
  const { fireConfetti } = useConfetti()

  const predCount = Object.keys(predictions).length
  const hasAny = predCount > 0

  // Calculate correct predictions
  const correctPredictions = Object.values(predictions).filter((p) => {
    if (!tournament) return false
    const allMatches = [
      ...tournament.knockout.roundOf32,
      ...tournament.knockout.roundOf16,
      ...tournament.knockout.quarterFinals,
      ...tournament.knockout.semiFinals,
      ...tournament.knockout.final,
    ]
    const match = allMatches.find((m) => m.id === p.matchId)
    return match?.status === 'played' && match.winnerId === p.winnerId
  })

  const accuracy = predCount > 0
    ? Math.round((correctPredictions.length / predCount) * 100)
    : 0

  // Find predicted champion (last round prediction)
  const finalPrediction = Object.values(predictions).find((p) =>
    p.matchId.startsWith('final')
  )

  const handleShare = async () => {
    fireConfetti({ count: 80 })
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My WC 2026 Bracket',
          text: `I predicted ${finalPrediction ? finalPrediction.winnerFlag + ' ' + finalPrediction.winnerName : 'my champion'} to win the 2026 World Cup! 🏆`,
        })
      } catch { /* user cancelled */ }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard?.writeText(
        `My World Cup 2026 pick: ${finalPrediction ? finalPrediction.winnerFlag + ' ' + finalPrediction.winnerName : '?'} 🏆 #WC2026`
      ).catch(() => {})
    }
  }

  return (
    <div className="px-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex-1">
          <h2 className="text-white font-black text-lg">My Bracket</h2>
          <p className="text-white/35 text-[11px]">
            {hasAny ? `${predCount} predictions made` : 'No predictions yet'}
          </p>
        </div>

        {hasAny && (
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-blue text-[12px] font-bold text-[#0A84FF]"
          >
            <Share2 size={13} />
            Share
          </button>
        )}
      </div>

      {/* Stats cards */}
      {hasAny && (
        <div className="grid grid-cols-3 gap-2 mb-5">
          <StatCard label="Picks" value={predCount.toString()} color="#0A84FF" />
          <StatCard label="Correct" value={correctPredictions.length.toString()} color="#30D158" />
          <StatCard label="Accuracy" value={accuracy + '%'} color="#D4A843" />
        </div>
      )}

      {/* Predicted champion */}
      {finalPrediction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-gold rounded-2xl p-4 mb-5 flex items-center gap-3"
        >
          <Crown size={20} className="text-[#D4A843] shrink-0" />
          <div className="flex-1">
            <div className="text-[10px] text-[#D4A843]/60 font-bold uppercase tracking-widest">Your Champion</div>
            <div className="text-white font-black text-base flex items-center gap-2 mt-0.5">
              <span>{finalPrediction.winnerFlag}</span>
              <span>{finalPrediction.winnerName}</span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-2xl"
          >
            🏆
          </motion.div>
        </motion.div>
      )}

      {/* Predictions list */}
      {hasAny ? (
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">All Predictions</div>
          {Object.values(predictions).map((pred, i) => {
            const allMatches = tournament ? [
              ...tournament.knockout.roundOf32,
              ...tournament.knockout.roundOf16,
              ...tournament.knockout.quarterFinals,
              ...tournament.knockout.semiFinals,
              ...tournament.knockout.final,
            ] : []
            const match = allMatches.find((m) => m.id === pred.matchId)
            const played = match?.status === 'played'
            const correct = played && match?.winnerId === pred.winnerId
            const wrong = played && match?.winnerId !== pred.winnerId

            return (
              <motion.div
                key={pred.matchId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 glass rounded-xl px-3 py-2.5"
              >
                <span className="text-xl">{pred.winnerFlag}</span>
                <div className="flex-1">
                  <div className="text-white font-semibold text-[12px]">{pred.winnerName}</div>
                  <div className="text-white/30 text-[10px]">{pred.matchId.replace(/-/g, ' ')}</div>
                </div>
                {correct && <span className="text-[#30D158] text-sm font-black">✓</span>}
                {wrong && <span className="text-[#FF453A] text-sm font-black">✗</span>}
                {!played && <span className="text-white/20 text-xs">pending</span>}
              </motion.div>
            )
          })}
        </div>
      ) : (
        <EmptyMyBracket onStartPredicting={() => { setMode('predict'); setActiveTab('R32') }} />
      )}

      {/* Clear predictions */}
      {hasAny && (
        <motion.button
          onClick={clearPredictions}
          whileTap={{ scale: 0.96 }}
          className="w-full mt-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 border border-[#FF453A]/20 bg-[#FF453A]/5"
        >
          <Trash2 size={14} className="text-[#FF453A]/60" />
          <span className="text-[12px] font-semibold text-[#FF453A]/60">Clear All Predictions</span>
        </motion.button>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-3 text-center"
    >
      <div className="font-black text-xl" style={{ color }}>{value}</div>
      <div className="text-white/35 text-[10px] mt-0.5">{label}</div>
    </motion.div>
  )
}

function EmptyMyBracket({ onStartPredicting }: { onStartPredicting: () => void }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-5xl mb-4"
      >
        🎯
      </motion.div>
      <h3 className="text-white font-bold text-base mb-2">No Predictions Yet</h3>
      <p className="text-white/35 text-[12px] leading-relaxed max-w-xs mb-5">
        Switch to Predict Mode and tap any match to pick your winners. Share your bracket with friends!
      </p>
      <motion.button
        onClick={onStartPredicting}
        whileTap={{ scale: 0.95 }}
        className="px-5 py-3 rounded-2xl glass-blue font-bold text-[#0A84FF] text-sm flex items-center gap-2"
      >
        <Zap size={15} />
        Start Predicting
      </motion.button>
    </div>
  )
}
