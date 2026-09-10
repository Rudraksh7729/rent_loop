import {
  demoCities,
  filterCategories,
  priceRanges,
  ratingFilters,
} from '../../data/filters'
import Button from '../ui/Button'

function FilterGroup({ title, children }) {
  return (
    <fieldset className="space-y-3 border-b border-line pb-5 last:border-b-0 last:pb-0">
      <legend className="text-sm font-semibold text-ink">{title}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  )
}

function RadioOption({ name, value, checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft hover:text-ink">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-brand"
      />
      <span>{label}</span>
    </label>
  )
}

export default function FilterPanel({
  filters,
  onChange,
  onClear,
  className = '',
}) {
  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <aside
      className={`rounded-2xl border border-line bg-surface p-5 ${className}`}
      aria-label="Filters"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-ink">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>

      <div className="space-y-5">
        <FilterGroup title="Category">
          <RadioOption
            name="category"
            value=""
            checked={filters.category === ''}
            onChange={() => update('category', '')}
            label="All categories"
          />
          {filterCategories.map((category) => (
            <RadioOption
              key={category}
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={() => update('category', category)}
              label={category}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Location">
          <RadioOption
            name="city"
            value=""
            checked={filters.city === ''}
            onChange={() => update('city', '')}
            label="All locations"
          />
          {demoCities.map((city) => (
            <RadioOption
              key={city}
              name="city"
              value={city}
              checked={filters.city === city}
              onChange={() => update('city', city)}
              label={city}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Price range">
          <RadioOption
            name="priceRange"
            value=""
            checked={filters.priceRange === ''}
            onChange={() => update('priceRange', '')}
            label="Any price"
          />
          {priceRanges.map((range) => (
            <RadioOption
              key={range.id}
              name="priceRange"
              value={range.id}
              checked={filters.priceRange === range.id}
              onChange={() => update('priceRange', range.id)}
              label={range.label}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Rating">
          <RadioOption
            name="rating"
            value=""
            checked={filters.rating === ''}
            onChange={() => update('rating', '')}
            label="Any rating"
          />
          {ratingFilters.map((rating) => (
            <RadioOption
              key={rating.id}
              name="rating"
              value={rating.value}
              checked={filters.rating === String(rating.value)}
              onChange={() => update('rating', String(rating.value))}
              label={rating.label}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Availability">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft hover:text-ink">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(event) => update('availableOnly', event.target.checked)}
              className="h-4 w-4 rounded accent-brand"
            />
            <span>Available only</span>
          </label>
          <p className="text-xs text-ink-soft">
            Demo filter — uses mock availability flags.
          </p>
        </FilterGroup>
      </div>
    </aside>
  )
}
