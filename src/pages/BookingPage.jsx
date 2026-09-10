import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ImageWithFallback from '../components/ui/ImageWithFallback'
import Button from '../components/ui/Button'
import InlineAlert from '../components/ui/InlineAlert'
import Modal from '../components/ui/Modal'
import RentalSummary from '../components/rentals/RentalSummary'
import { RequireAuth } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { useListings } from '../hooks/useListings'
import { useRentals } from '../hooks/useRentals'
import { findMarketplaceItem } from '../data/listingUtils'
import { getOwnerName } from '../data/marketplaceUtils'
import {
  resolveItemOwnerId,
  validateRentalDates,
} from '../data/rentalUtils'
import { getDashboardPath } from '../data/demoUsers'

function BookingContent() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { listings } = useListings()
  const { createRentalRequest, checkConflict } = useRentals()

  const startDate = searchParams.get('start') || ''
  const endDate = searchParams.get('end') || ''

  const item = useMemo(
    () => findMarketplaceItem(id, listings, { viewerId: user?.id }),
    [id, listings, user?.id],
  )

  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  if (user?.role !== 'renter') {
    return <Navigate to={getDashboardPath(user?.role)} replace />
  }

  if (!item) {
    return (
      <div className="min-h-svh bg-sand">
        <Navbar variant="solid" />
        <main className="container-rl py-28">
          <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface px-6 py-12 text-center">
            <h1 className="font-display text-2xl font-bold text-ink">Item not found</h1>
            <Link
              to="/explore"
              className="mt-6 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              Explore items
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const ownerId = resolveItemOwnerId(item)
  const isOwnListing = ownerId === user.id
  const dateCheck = validateRentalDates(startDate, endDate)
  const conflict =
    dateCheck.ok && checkConflict(item.id, startDate, endDate)
  const unpublished = item.status && item.status !== 'published'
  const unavailable = item.available === false
  const canConfirm =
    !isOwnListing &&
    !unpublished &&
    !unavailable &&
    dateCheck.ok &&
    !conflict

  const subtotal = dateCheck.ok ? dateCheck.days * item.pricePerDay : 0

  function handleConfirm() {
    setError('')
    if (!canConfirm) {
      if (isOwnListing) setError("You can't rent your own listing.")
      else if (conflict) setError('These dates are no longer available.')
      else if (!dateCheck.ok) setError(dateCheck.error)
      else if (unavailable) setError('This item is currently unavailable.')
      else setError('This rental cannot be confirmed right now.')
      return
    }

    setBusy(true)
    window.setTimeout(() => {
      const result = createRentalRequest({
        item,
        renter: user,
        startDate,
        endDate,
      })
      setBusy(false)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setSuccessOpen(true)
    }, 280)
  }

  return (
    <div className="min-h-svh bg-sand">
      <Navbar variant="solid" />
      <main className="container-rl pb-16 pt-24 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link to={`/item/${item.id}`} className="back-link">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Item
          </Link>
          <h1 className="page-title mt-4">Confirm your rental</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Review the details, then send a demo request to the owner.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6">
            <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
              <ImageWithFallback
                src={item.images?.[0] || item.image}
                alt={item.title}
                className="aspect-[4/3] rounded-xl"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
                  {item.category}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                  {item.title}
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
                  <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                  {item.location}
                </p>
                <p className="mt-3 text-sm text-ink-soft">
                  Owner: {getOwnerName(item.owner)}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            {error ? <InlineAlert>{error}</InlineAlert> : null}
            {isOwnListing ? (
              <InlineAlert>You can&apos;t rent your own listing.</InlineAlert>
            ) : null}
            {conflict ? (
              <InlineAlert>These dates are no longer available.</InlineAlert>
            ) : null}
            {!dateCheck.ok ? (
              <InlineAlert>
                {dateCheck.error || 'Select valid rental dates from the item page.'}
              </InlineAlert>
            ) : null}
            {unavailable ? (
              <InlineAlert>This item is currently unavailable.</InlineAlert>
            ) : null}

            <RentalSummary
              startDate={startDate}
              endDate={endDate}
              durationDays={dateCheck.days}
              pricePerDay={item.pricePerDay}
              subtotal={subtotal}
            />

            <Button
              size="lg"
              className="w-full"
              disabled={!canConfirm || busy}
              onClick={handleConfirm}
            >
              {busy ? 'Sending request…' : 'Confirm Rental'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => navigate(`/item/${item.id}`)}
            >
              Back to Item
            </Button>
          </section>
        </div>
      </main>

      <Modal
        open={successOpen}
        onClose={() => navigate('/renter/rentals')}
        title="Rental request sent"
      >
        <div className="rounded-xl border border-brand/15 bg-brand-light/60 px-4 py-3">
          <p className="text-sm leading-relaxed text-ink-soft">
            Your request has been sent to the owner. You&apos;ll be notified when they
            respond.
          </p>
          <p className="mt-2 text-xs text-ink-soft">
            Demo mode — no real notification or payment was processed.
          </p>
        </div>
        <Button className="mt-6 w-full" size="lg" onClick={() => navigate('/renter/rentals')}>
          View My Rentals
        </Button>
      </Modal>
      <Footer />
    </div>
  )
}

export default function BookingPage() {
  return (
    <RequireAuth>
      <BookingContent />
    </RequireAuth>
  )
}
