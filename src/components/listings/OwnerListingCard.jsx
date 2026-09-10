import { Link } from 'react-router-dom'
import ImageWithFallback from '../ui/ImageWithFallback'
import Button from '../ui/Button'
import { buttonClasses } from '../ui/buttonStyles'
import { formatPrice } from '../../data/marketplaceUtils'

const statusClass = {
  published: 'status-published',
  draft: 'status-draft',
  paused: 'status-paused',
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

export default function OwnerListingCard({
  listing,
  onPause,
  onPublish,
  onDelete,
}) {
  const image = listing.images?.[0] || ''
  const statusLabel =
    listing.status === 'published'
      ? 'Published'
      : listing.status === 'paused'
        ? 'Paused'
        : 'Draft'

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
      <ImageWithFallback src={image} alt={listing.title} className="aspect-[4/3]" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              {listing.category}
            </p>
            <h3 className="mt-1 truncate font-display text-lg font-bold text-ink">
              {listing.title}
            </h3>
          </div>
          <span
            className={`status-badge shrink-0 capitalize ${
              statusClass[listing.status] || statusClass.draft
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="space-y-1 text-sm text-ink-soft">
          <p className="font-semibold text-brand">
            {formatPrice(listing.pricePerDay)}
            <span className="font-normal text-ink-soft"> / day</span>
          </p>
          <p>{listing.location}</p>
          <p>
            {listing.available ? 'Available' : 'Unavailable'} · Created{' '}
            {formatDate(listing.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/owner/listings/${listing.id}/edit`}
            className={buttonClasses('secondary', 'sm')}
          >
            Edit
          </Link>
          <Link to={`/item/${listing.id}`} className={buttonClasses('secondary', 'sm')}>
            Preview
          </Link>
          {listing.status === 'published' ? (
            <Button variant="secondary" size="sm" onClick={onPause}>
              Pause
            </Button>
          ) : (
            <Button size="sm" onClick={onPublish}>
              Publish
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </article>
  )
}
