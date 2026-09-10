import { formatPrice } from '../../data/marketplaceUtils'

const statusStyles = {
  Pending: 'bg-[#fff4e8] text-[#9a5b12]',
  Approved: 'bg-brand-light text-brand',
  Completed: 'bg-ink/5 text-ink-soft',
}

export default function RequestCard({ request }) {
  return (
    <article className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-ink">
            {request.itemTitle}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">Renter: {request.renterName}</p>
        </div>
        <span
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
            statusStyles[request.status] || statusStyles.Pending
          }`}
        >
          {request.status}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-soft">
        <p>
          {request.startDate} → {request.endDate}
        </p>
        <p className="font-semibold text-brand">{formatPrice(request.amount)}</p>
      </div>
      <p className="mt-2 text-xs text-ink-soft">Demo request — actions are UI only.</p>
    </article>
  )
}
