import { Link } from 'react-router-dom'
import ImageWithFallback from '../ui/ImageWithFallback'
import Button from '../ui/Button'
import { buttonClasses } from '../ui/buttonStyles'
import RentalStatusBadge from './RentalStatusBadge'
import { formatPrice } from '../../data/marketplaceUtils'
import { getDisplayStatus } from '../../data/rentalUtils'

export default function RentalRequestCard({ rental, onApprove, onReject }) {
  const display = getDisplayStatus(rental)
  const isPending = rental.status === 'pending'

  return (
    <article className="rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
      <div className="flex gap-3">
        <ImageWithFallback
          src={rental.itemSnapshot?.image}
          alt={rental.itemSnapshot?.title || 'Item'}
          className="h-20 w-24 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-display text-base font-bold text-ink sm:text-lg">
              {rental.itemSnapshot?.title}
            </h3>
            <RentalStatusBadge status={display} />
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            Renter: {rental.renterSnapshot?.name}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {rental.startDate} → {rental.endDate}
          </p>
          <p className="mt-1 font-display text-sm font-bold text-brand">
            {formatPrice(rental.subtotal)}
            <span className="ml-1 font-sans font-normal text-ink-soft">
              · {rental.durationDays} {rental.durationDays === 1 ? 'day' : 'days'}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link to={`/rental/${rental.id}`} className={buttonClasses('secondary', 'sm')}>
          View
        </Link>
        {isPending && onApprove && onReject ? (
          <>
            <Button size="sm" onClick={onApprove}>
              Approve
            </Button>
            <Button size="sm" variant="secondary" onClick={onReject}>
              Reject
            </Button>
          </>
        ) : null}
      </div>
    </article>
  )
}
