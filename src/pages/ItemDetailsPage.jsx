import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bookmark, Check, MapPin, Star } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ImageGallery from '../components/item/ImageGallery'
import OwnerCard from '../components/item/OwnerCard'
import RentalSelector from '../components/item/RentalSelector'
import RelatedItems from '../components/item/RelatedItems'
import InlineAlert from '../components/ui/InlineAlert'
import { useAuth } from '../hooks/useAuth'
import { useListings } from '../hooks/useListings'
import { useRentals } from '../hooks/useRentals'
import {
  findMarketplaceItem,
  findRelatedMarketplaceItems,
} from '../data/listingUtils'
import { formatPrice } from '../data/marketplaceUtils'
import { resolveItemOwnerId } from '../data/rentalUtils'
import { useSavedItems } from '../hooks/useSavedItems'

export default function ItemDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { listings, getListingById } = useListings()
  const { checkConflict } = useRentals()
  const { isSaved, toggleSaved } = useSavedItems()

  const item = useMemo(
    () => findMarketplaceItem(id, listings, { viewerId: user?.id }),
    [id, listings, user?.id],
  )

  const ownedListing = useMemo(() => {
    const listing = getListingById(id)
    if (!listing || !user) return null
    return listing.ownerId === user.id ? listing : null
  }, [getListingById, id, user])

  const related = useMemo(
    () => (item ? findRelatedMarketplaceItems(item, listings) : []),
    [item, listings],
  )

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [bookingHint, setBookingHint] = useState('')

  if (!item) {
    return (
      <div className="min-h-svh bg-sand">
        <Navbar variant="solid" />
        <main className="container-rl py-28">
          <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface px-6 py-12 text-center">
            <h1 className="font-display text-2xl font-bold text-ink">Item not found</h1>
            <p className="mt-3 text-sm text-ink-soft">
              This listing is not available in the marketplace demo data.
            </p>
            <Link
              to="/explore"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Explore items
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const features = Array.isArray(item.features) ? item.features : []
  const ownerId = resolveItemOwnerId(item)
  const isOwnListing = Boolean(user && ownerId === user.id)
  const saved = isSaved(item.id)

  function handleContinueToBooking() {
    setBookingHint('')
    const bookPath = `/book/${item.id}?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`

    if (!isAuthenticated) {
      navigate('/login', { state: { from: bookPath } })
      return
    }

    if (user.role !== 'renter') {
      setBookingHint('Switch to a renter demo account to request a rental.')
      return
    }

    if (isOwnListing) {
      setBookingHint("You can't rent your own listing.")
      return
    }

    if (item.available === false) {
      setBookingHint('This item is currently unavailable.')
      return
    }

    if (checkConflict(item.id, startDate, endDate)) {
      setBookingHint('These dates are no longer available.')
      return
    }

    navigate(bookPath)
  }

  const selector = (
    <RentalSelector
      pricePerDay={item.pricePerDay}
      startDate={startDate}
      endDate={endDate}
      onStartChange={setStartDate}
      onEndChange={setEndDate}
      onContinue={handleContinueToBooking}
      available={item.available !== false && !isOwnListing}
      disabledReason={
        isOwnListing
          ? "You can't rent your own listing."
          : item.available === false
            ? 'This item is currently unavailable.'
            : ''
      }
    />
  )

  return (
    <div className="min-h-svh bg-sand">
      <Navbar variant="solid" />
      <main className="pb-24 pt-24 sm:pt-28">
        <div className="container-rl">
          <Link to="/explore" className="back-link">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to explore
          </Link>

          {ownedListing && ownedListing.status !== 'published' ? (
            <div className="mt-4 rounded-xl border border-brand/20 bg-brand-light px-4 py-3 text-sm text-brand-dark">
              You are previewing your {ownedListing.status} listing. It is not visible in
              Explore until published.
              <Link
                to={`/owner/listings/${ownedListing.id}/edit`}
                className="ml-2 font-semibold underline-offset-2 hover:underline"
              >
                Edit listing
              </Link>
            </div>
          ) : null}

          {bookingHint ? (
            <div className="mt-4">
              <InlineAlert>{bookingHint}</InlineAlert>
            </div>
          ) : null}

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ImageGallery images={item.images} title={item.title} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="space-y-5"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                  {item.category}
                </p>
                <div className="flex items-start gap-3">
                  <h1 className="min-w-0 flex-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                    {item.title}
                  </h1>
                  <button
                    type="button"
                    onClick={() => toggleSaved(item.id)}
                    className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-brand shadow-soft transition-colors hover:bg-brand-light"
                    aria-label={saved ? `Remove ${item.title} from saved items` : `Save ${item.title} for later`}
                    aria-pressed={saved}
                  >
                    <Bookmark
                      className={`h-5 w-5 ${saved ? 'fill-brand' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft">
                  <p className="inline-flex items-center gap-1">
                    <Star
                      className="h-4 w-4 fill-rating text-rating"
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-ink">{item.rating}</span>
                    <span>({item.reviews} reviews)</span>
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                    {item.location} · {item.distanceKm} km
                  </p>
                </div>

                <p className="mt-5">
                  <span className="font-display text-3xl font-bold text-brand">
                    {formatPrice(item.pricePerDay)}
                  </span>
                  <span className="ml-1 text-ink-soft">/ day</span>
                </p>

                <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                  {item.description}
                </p>

                {item.availabilityNote ? (
                  <p className="mt-3 rounded-xl bg-sand px-3 py-2 text-sm text-ink-soft">
                    Note: {item.availabilityNote}
                  </p>
                ) : null}

                {ownedListing ? (
                  <Link
                    to={`/owner/listings/${ownedListing.id}/edit`}
                    className="mt-4 inline-flex text-sm font-semibold text-brand hover:text-brand-dark"
                  >
                    Manage this listing →
                  </Link>
                ) : null}
              </div>

              {features.length > 0 ? (
                <section className="rounded-2xl border border-line bg-surface p-5 shadow-soft">
                  <h2 className="font-display text-lg font-bold text-ink">Features</h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-ink-soft"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <OwnerCard owner={item.owner} />

              <div className="hidden lg:sticky lg:top-24 lg:block">{selector}</div>
            </motion.div>
          </div>

          <div className="mt-8 lg:hidden">{selector}</div>
        </div>

        <RelatedItems items={related} />
      </main>
      <Footer />
    </div>
  )
}
