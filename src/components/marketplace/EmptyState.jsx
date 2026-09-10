import EmptyState from '../ui/EmptyState'

/** Explore marketplace empty results — keeps previous API. */
export default function MarketplaceEmptyState({ onClear }) {
  return (
    <EmptyState
      title="No items found"
      description="Try changing your filters or searching for something else."
      actionLabel="Clear Filters"
      onAction={onClear}
    />
  )
}
