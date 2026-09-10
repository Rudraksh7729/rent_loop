import { formatPrice } from '../../data/marketplaceUtils'

export default function PriceSummary({ pricePerDay, days }) {
  const subtotal = days > 0 ? pricePerDay * days : 0

  return (
    <section className="rounded-2xl border border-line bg-sand/70 p-4">
      <h3 className="text-sm font-semibold text-ink">Rental summary</h3>
      <div className="mt-3 space-y-2 text-sm text-ink-soft">
        <div className="flex items-center justify-between gap-3">
          <span>
            {formatPrice(pricePerDay)} × {days > 0 ? days : '—'}{' '}
            {days === 1 ? 'day' : 'days'}
          </span>
          <span className="font-medium text-ink">
            {days > 0 ? formatPrice(subtotal) : '—'}
          </span>
        </div>
        <div className="border-t border-line pt-2" />
        <div className="flex items-center justify-between gap-3">
          <span>Rental subtotal</span>
          <span className="font-medium text-ink">
            {days > 0 ? formatPrice(subtotal) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 font-semibold text-ink">
          <span>Estimated total</span>
          <span className="font-display text-lg text-brand">
            {days > 0 ? formatPrice(subtotal) : '—'}
          </span>
        </div>
      </div>
    </section>
  )
}
