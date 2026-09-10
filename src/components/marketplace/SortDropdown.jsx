import { sortOptions } from '../../data/filters'

export default function SortDropdown({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft">
      <span className="whitespace-nowrap font-medium">Sort by</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 rounded-xl border border-line bg-surface px-3 py-2 font-medium text-ink focus:border-brand focus:outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
