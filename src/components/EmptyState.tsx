import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center text-center px-8 py-16 gap-4',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl mb-2">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-white/50 max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-6 py-2.5 rounded-xl bg-[#00D084] text-black font-semibold text-sm transition-opacity hover:opacity-90"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
