import { Check, MapPin } from 'lucide-react'
import ImageWithFallback from '../ui/ImageWithFallback'
import ItemCard from '../ui/ItemCard'
import { formatPrice } from '../../data/marketplaceUtils'

export default function ListingPreviewPanel({ preview }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
          Preview
        </p>
        <h2 className="mt-1 font-display text-xl font-bold text-ink">
          How renters will see it
        </h2>
      </div>

      <ItemCard item={preview} linkTo={false} />

      <article className="rounded-2xl border border-line bg-surface p-4">
        <ImageWithFallback
          src={preview.images?.[0] || preview.image}
          alt={preview.title}
          className="aspect-[16/10] rounded-xl"
        />
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {preview.category}
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-ink">{preview.title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
          <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
          {preview.location}
        </p>
        <p className="mt-3 font-display text-2xl font-bold text-brand">
          {preview.pricePerDay > 0 ? formatPrice(preview.pricePerDay) : '₹—'}
          <span className="ml-1 text-sm font-medium text-ink-soft">/ day</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{preview.description}</p>
        {preview.features?.length ? (
          <ul className="mt-4 space-y-2">
            {preview.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-ink-soft">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        ) : null}
      </article>

      <p className="text-xs text-ink-soft">
        Demo mode — publishing stores this listing in your browser only.
      </p>
    </div>
  )
}
