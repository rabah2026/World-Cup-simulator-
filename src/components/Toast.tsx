'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'

type ToastProps = {
  message: string
  visible: boolean
  onClose: () => void
  type?: 'success' | 'info'
}

export function Toast({ message, visible, onClose, type = 'success' }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onClose, 2800)
      return () => clearTimeout(t)
    }
  }, [visible, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] max-w-xs w-[90vw]"
        >
          <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
            <CheckCircle
              size={18}
              className={type === 'success' ? 'text-[#00D084] shrink-0' : 'text-[#D6A84F] shrink-0'}
            />
            <span className="text-sm font-medium text-white flex-1">{message}</span>
            <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
