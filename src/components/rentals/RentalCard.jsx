import { Link } from 'react-router-dom'
import ImageWithFallback from '../ui/ImageWithFallback'
import RentalStatusBadge from './RentalStatusBadge'
import { buttonClasses } from '../ui/buttonStyles'
import { formatPrice } from '../../data/marketplaceUtils'
import { getDisplayStatus } from '../../data/rentalUtils'

export default function RentalCard({ rental, perspective = 'renter' }) {
  const display = getDisplayStatus(rental)
  const counterpart =
    perspective === 'owner'
      ? rental.renterSnapshot?.name || 'Renter'
      : rental.ownerSnapshot?.name || 'Owner'

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-shadow hover:shadow-lift">
      <div className="grid gap-0 sm:grid-cols-[140px_minmax(0,1fr)]">
        <ImageWithFallback
          src={rental.itemSnapshot?.image}
          alt={rental.itemSnapshot?.title || 'Rental item'}
          className="aspect-[4/3] sm:aspect-auto sm:h-full"
        />
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-bold text-ink">
                {rental.itemSnapshot?.title}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                {rental.startDate} → {rental.endDate} · {rental.durationDays}{' '}
                {rental.durationDays === 1 ? 'day' : 'days'}
              </p>
            </div>
            <RentalStatusBadge status={display} />
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-sm text-ink-soft">
            <p>
              {perspective === 'owner' ? 'Renter' : 'Owner'}: {counterpart}
            </p>
            <p className="font-display text-base font-bold text-brand">
              {formatPrice(rental.subtotal)}
            </p>
          </div>
          <Link to={`/rental/${rental.id}`} className={buttonClasses('secondary', 'sm', 'w-fit')}>
            View details
          </Link>
        </div>
      </div>
    </article>
  )
}
