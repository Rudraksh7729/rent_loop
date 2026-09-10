import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star } from 'lucide-react'
import ImageWithFallback from './ImageWithFallback'
import { formatPrice, getItemImage, getOwnerName } from '../../data/marketplaceUtils'

export default function ItemCard({ item, linkTo }) {
  const image = getItemImage(item)
  const ownerName = getOwnerName(item.owner)
  const href = linkTo === false ? null : linkTo || `/item/${item.id}`

  const content = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <ImageWithFallback
          src={image}
          alt={`${item.title} available for rent near ${item.location}`}
          className="h-full w-full"
          imgClassName="transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <span
          className={`absolute left-3 top-3 status-badge ${
            item.available ? 'status-published' : 'bg-ink/80 text-white'
          }`}
        >
          {item.available ? 'Available' : 'Booked'}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              {item.category}
            </p>
            <h3 className="mt-1 line-clamp-2 font-display text-lg font-bold leading-snug text-ink">
              {item.title}
            </h3>
          </div>
          <p className="shrink-0 text-right">
            <span className="block font-display text-lg font-bold text-brand">
              {item.pricePerDay > 0 ? formatPrice(item.pricePerDay) : '₹—'}
            </span>
            <span className="text-xs text-ink-soft">/ day</span>
          </p>
        </div>

        <div className="mt-auto space-y-2 text-sm text-ink-soft">
          <p className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <span className="truncate">
              {item.location}
              {item.distanceKm != null ? ` · ${item.distanceKm} km` : ''}
            </span>
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-rating text-rating" aria-hidden="true" />
              <span className="font-medium text-ink">{item.rating}</span>
              <span>({item.reviews})</span>
            </p>
            <p className="truncate text-xs">Owner: {ownerName}</p>
          </div>
          {href ? (
            <p className="pt-1 text-sm font-semibold text-brand transition-colors group-hover:text-brand-dark">
              View details →
            </p>
          ) : null}
        </div>
      </div>
    </>
  )

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-shadow duration-200 hover:shadow-lift"
    >
      {href ? (
        <Link
          to={href}
          className="flex h-full flex-col focus-visible:outline-offset-4"
          aria-label={`View details for ${item.title}`}
        >
          {content}
        </Link>
      ) : (
        <div className="flex h-full flex-col">{content}</div>
      )}
    </motion.article>
  )
}
