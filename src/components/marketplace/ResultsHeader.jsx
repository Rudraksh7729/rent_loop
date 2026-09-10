import { X } from 'lucide-react'
import SortDropdown from './SortDropdown'

export default function ResultsHeader({
  count,
  chips,
  sort,
  onSortChange,
  onRemoveChip,
  onClear,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg font-bold text-ink sm:text-xl">
          {count} {count === 1 ? 'item' : 'items'} available
        </p>
        <SortDropdown value={sort} onChange={onSortChange} />
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onRemoveChip(chip.key)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              {chip.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Remove {chip.label} filter</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-ink-soft underline-offset-2 hover:text-brand hover:underline"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  )
}
