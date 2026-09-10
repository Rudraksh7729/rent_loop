import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import FilterPanel from './FilterPanel'
import Button from '../ui/Button'

export default function FilterDrawer({ open, onClose, filters, onChange, onClear }) {
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <motion.button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-ink/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filter items"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-sand shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="font-display text-lg font-bold text-ink">Filters</p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface"
                aria-label="Close filter drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterPanel
                filters={filters}
                onChange={onChange}
                onClear={onClear}
                className="border-0 bg-transparent p-0"
              />
            </div>
            <div className="border-t border-line p-4">
              <Button className="w-full" onClick={onClose}>
                Show results
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
