import { formatPrice } from '../../data/marketplaceUtils'

export default function EarningsOverview({ total, breakdown }) {
  const max = Math.max(...breakdown.map((entry) => entry.amount), 1)

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
            Demo earnings
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">
            {formatPrice(total)}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Fictional totals for presentation only.
          </p>
        </div>
      </div>

      <div className="mt-6 flex h-40 items-end gap-3">
        {breakdown.map((entry) => {
          const height = Math.max((entry.amount / max) * 100, 8)
          return (
            <div key={entry.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-28 w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-brand/85"
                  style={{ height: `${height}%` }}
                  title={formatPrice(entry.amount)}
                />
              </div>
              <p className="text-xs font-medium text-ink-soft">{entry.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
