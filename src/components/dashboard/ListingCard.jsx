import { Link } from 'react-router-dom'
import ImageWithFallback from '../ui/ImageWithFallback'
import { formatPrice } from '../../data/marketplaceUtils'

export default function ListingCard({ listing, editTo }) {
  const editHref = editTo || `/owner/listings/${listing.id}/edit`

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      <ImageWithFallback
        src={listing.image}
        alt={listing.title}
        className="aspect-[4/3]"
      />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              {listing.category}
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-ink">
              {listing.title}
            </h3>
          </div>
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
              listing.available
                ? 'bg-brand-light text-brand'
                : 'bg-ink/80 text-white'
            }`}
          >
            {listing.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <p className="font-semibold text-brand">
            {formatPrice(listing.pricePerDay)}
            <span className="font-normal text-ink-soft"> / day</span>
          </p>
          <p className="text-ink-soft">{listing.status}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/item/${listing.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-line px-3 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
          >
            View
          </Link>
          <Link
            to={editHref}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
          >
            Edit
          </Link>
        </div>
      </div>
    </article>
  )
}
