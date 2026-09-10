import { formatPrice } from '../../data/marketplaceUtils'

export default function RentalSummary({
  startDate,
  endDate,
  durationDays,
  pricePerDay,
  subtotal,
}) {
  return (
    <section className="rounded-2xl border border-line bg-sand/70 p-4">
      <h3 className="text-sm font-semibold text-ink">Rental summary</h3>
      <div className="mt-3 space-y-2 text-sm text-ink-soft">
        <div className="flex justify-between gap-3">
          <span>Dates</span>
          <span className="font-medium text-ink">
            {startDate || '—'} → {endDate || '—'}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Duration</span>
          <span className="font-medium text-ink">
            {durationDays > 0
              ? `${durationDays} ${durationDays === 1 ? 'day' : 'days'}`
              : '—'}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span>
            {formatPrice(pricePerDay)} × {durationDays > 0 ? durationDays : '—'}{' '}
            {durationDays === 1 ? 'day' : 'days'}
          </span>
          <span className="font-medium text-ink">
            {durationDays > 0 ? formatPrice(subtotal) : '—'}
          </span>
        </div>
        <div className="border-t border-line pt-2" />
        <div className="flex justify-between gap-3 font-semibold text-ink">
          <span>Estimated total</span>
          <span className="font-display text-lg text-brand">
            {durationDays > 0 ? formatPrice(subtotal) : '—'}
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        Demo mode — no payment is processed.
      </p>
    </section>
  )
}
