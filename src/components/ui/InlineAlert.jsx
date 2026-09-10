import { AnimatePresence, motion } from 'framer-motion'

export default function InlineAlert({ tone = 'error', children }) {
  if (!children) return null

  const styles =
    tone === 'success'
      ? 'border-brand/20 bg-brand-light text-brand-dark'
      : 'border-accent/30 bg-danger-bg text-danger-fg'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        role="alert"
        className={`rounded-xl border px-3 py-2.5 text-sm ${styles}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
