import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import Button from '../ui/Button'
import { FEATURE_SUGGESTIONS } from '../../data/listingStorage'

export default function FeatureEditor({ features, onChange, error }) {
  const [draft, setDraft] = useState('')

  function addFeature(value) {
    const next = value.trim()
    if (!next) return
    if (features.some((entry) => entry.toLowerCase() === next.toLowerCase())) {
      setDraft('')
      return
    }
    onChange([...features, next])
    setDraft('')
  }

  function removeFeature(index) {
    onChange(features.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-ink">Features</p>
        <p className="text-xs text-ink-soft">
          Highlight what renters should know about the item.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {features.map((feature, index) => (
            <motion.span
              key={`${feature}-${index}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand"
            >
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                aria-label={`Remove ${feature}`}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-brand hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="block min-w-0 flex-1 text-sm">
          <span className="sr-only">Add feature</span>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addFeature(draft)
              }
            }}
            placeholder="e.g. Includes accessories"
            className="w-full rounded-xl border border-line bg-sand/40 px-3 py-2.5 text-ink focus:border-brand focus:outline-none"
          />
        </label>
        <Button type="button" variant="secondary" onClick={() => addFeature(draft)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add feature
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FEATURE_SUGGESTIONS.filter(
          (suggestion) =>
            !features.some(
              (feature) => feature.toLowerCase() === suggestion.toLowerCase(),
            ),
        )
          .slice(0, 4)
          .map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addFeature(suggestion)}
              className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft hover:border-brand hover:text-brand"
            >
              + {suggestion}
            </button>
          ))}
      </div>

      {error ? (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
