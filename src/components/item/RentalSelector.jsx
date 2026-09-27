import { calcRentalDays, formatPrice } from '../../data/marketplaceUtils'
import { validateRentalDates } from '../../data/rentalUtils'
import PriceSummary from './PriceSummary'
import Button from '../ui/Button'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function RentalSelector({
  pricePerDay,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onContinue,
  available,
  disabledReason = '',
}) {
  const days = calcRentalDays(startDate, endDate)
  const dateCheck = validateRentalDates(startDate, endDate)
  const invalidRange = Boolean(startDate && endDate && !dateCheck.ok)
  const canContinue = available && dateCheck.ok

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="font-display text-lg font-bold text-ink">Choose rental dates</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Demo booking — your request is saved in this browser only.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink">Start date</span>
          <input
            type="date"
            value={startDate}
            min={todayISO()}
            onChange={(event) => onStartChange(event.target.value)}
            className="input-rl"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink">End date</span>
          <input
            type="date"
            value={endDate}
            min={startDate || todayISO()}
            onChange={(event) => onEndChange(event.target.value)}
            className="input-rl"
          />
        </label>
      </div>

      {invalidRange ? (
        <p className="mt-3 text-sm text-accent" role="alert">
          {dateCheck.error}
        </p>
      ) : null}

      {days > 0 ? (
        <p className="mt-4 text-sm text-ink-soft">
          Rental duration:{' '}
          <span className="font-semibold text-ink">
            {days} {days === 1 ? 'day' : 'days'} × {formatPrice(pricePerDay)}/day
          </span>
        </p>
      ) : (
        <p className="mt-4 text-sm text-ink-soft">Select dates to see your rental total.</p>
      )}

      <div className="mt-4">
        <PriceSummary pricePerDay={pricePerDay} days={days} />
      </div>

      {!available && disabledReason ? (
        <p className="mt-4 rounded-xl bg-ink/5 px-3 py-2 text-sm text-ink-soft">
          {disabledReason}
        </p>
      ) : null}

      <Button
        className="mt-5 w-full"
        size="lg"
        disabled={!canContinue}
        onClick={onContinue}
      >
        Continue to Booking
      </Button>
    </section>
  )
}
