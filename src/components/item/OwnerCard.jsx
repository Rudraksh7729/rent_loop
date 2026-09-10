import { Star } from 'lucide-react'
import ImageWithFallback from '../ui/ImageWithFallback'
import Button from '../ui/Button'

export default function OwnerCard({ owner }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="font-display text-lg font-bold text-ink">Meet the owner</h2>
      <div className="mt-4 flex items-start gap-4">
        <ImageWithFallback
          src={owner.avatar}
          alt={`${owner.name} profile photo`}
          className="h-14 w-14 shrink-0 rounded-full"
          imgClassName="rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold text-ink">{owner.name}</p>
          <p className="mt-0.5 text-sm text-ink-soft">
            Member since {owner.memberSince}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
            <p className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-rating text-rating" aria-hidden="true" />
              <span className="font-medium text-ink">{owner.rating}</span>
              <span>rating</span>
            </p>
            <span aria-hidden="true">·</span>
            <p>{owner.rentals} rentals</p>
          </div>
        </div>
      </div>
      <Button
        variant="secondary"
        className="mt-5 w-full"
        onClick={() => {}}
        aria-label="View profile (coming in a later phase)"
      >
        View Profile
      </Button>
      <p className="mt-2 text-xs text-ink-soft">
        Profile pages will arrive in a later phase.
      </p>
    </section>
  )
}
