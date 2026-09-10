import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ImageWithFallback from '../components/ui/ImageWithFallback'
import Button from '../components/ui/Button'
import InlineAlert from '../components/ui/InlineAlert'
import RentalStatusBadge from '../components/rentals/RentalStatusBadge'
import RentalSummary from '../components/rentals/RentalSummary'
import RentalTimeline from '../components/rentals/RentalTimeline'
import RentalActionModal from '../components/rentals/RentalActionModal'
import { RequireAuth } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { useRentals } from '../hooks/useRentals'
import { getDisplayStatus } from '../data/rentalUtils'
import { getDashboardPath } from '../data/demoUsers'

function statusMessage(display) {
  switch (display) {
    case 'pending':
      return 'Waiting for owner response'
    case 'approved':
      return 'Rental approved'
    case 'active':
      return 'Rental is currently active'
    case 'completed':
      return 'Rental completed'
    case 'rejected':
      return 'Rental request rejected'
    case 'cancelled':
      return 'Rental request cancelled'
    default:
      return ''
  }
}

function RentalDetailsContent() {
  const { id } = useParams()
  const { user } = useAuth()
  const {
    getRentalById,
    cancelRental,
    approveRental,
    rejectRental,
    completeRental,
  } = useRentals()

  const rental = getRentalById(id)
  const [notice, setNotice] = useState('')
  const [action, setAction] = useState(null)

  const display = useMemo(
    () => (rental ? getDisplayStatus(rental) : 'pending'),
    [rental],
  )

  if (!rental) {
    return (
      <div className="min-h-svh bg-sand">
        <Navbar variant="solid" />
        <main className="container-rl py-28">
          <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface px-6 py-12 text-center">
            <h1 className="font-display text-2xl font-bold text-ink">Rental not found</h1>
            <Link
              to={getDashboardPath(user.role)}
              className="mt-6 inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isRenter = user.id === rental.renterId
  const isOwner = user.id === rental.ownerId

  if (!isRenter && !isOwner) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  function runAction() {
    if (!action) return
    let result = { ok: false, error: 'Unknown action.' }
    if (action === 'cancel') result = cancelRental(rental.id, user.id)
    if (action === 'approve') result = approveRental(rental.id, user.id)
    if (action === 'reject') result = rejectRental(rental.id, user.id)
    if (action === 'complete') result = completeRental(rental.id, user.id)
    setAction(null)
    setNotice(result.ok ? 'Demo rental updated.' : result.error)
  }

  const backTo = isOwner ? '/owner/requests' : '/renter/rentals'

  return (
    <div className="min-h-svh bg-sand">
      <Navbar variant="solid" />
      <main className="container-rl space-y-6 pb-16 pt-24 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <Link to={backTo} className="back-link">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>

          {notice ? <InlineAlert tone="success">{notice}</InlineAlert> : null}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <section className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
                    {rental.itemSnapshot.category}
                  </p>
                  <h1 className="page-title mt-1">
                    {rental.itemSnapshot.title}
                  </h1>
                </div>
                <RentalStatusBadge status={display} />
              </div>

              <ImageWithFallback
                src={rental.itemSnapshot.image}
                alt={rental.itemSnapshot.title}
                className="mt-5 aspect-[16/10] rounded-2xl"
              />

              <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-soft">
                <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                {rental.itemSnapshot.location}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-sand/70 p-3 text-sm">
                  <p className="text-ink-soft">Renter</p>
                  <p className="mt-1 font-semibold text-ink">
                    {rental.renterSnapshot.name}
                  </p>
                </div>
                <div className="rounded-xl bg-sand/70 p-3 text-sm">
                  <p className="text-ink-soft">Owner</p>
                  <p className="mt-1 font-semibold text-ink">
                    {rental.ownerSnapshot.name}
                  </p>
                </div>
              </div>

              <p className="mt-4 rounded-xl bg-brand-light px-3 py-2 text-sm text-brand-dark">
                {statusMessage(display)}
              </p>

              <p className="mt-3 text-xs text-ink-soft">
                Requested {new Date(rental.createdAt).toLocaleString('en-IN')} · Demo only
              </p>

              <Link
                to={`/item/${rental.itemId}`}
                className="mt-4 inline-flex text-sm font-semibold text-brand"
              >
                View item →
              </Link>
            </section>

            <div className="space-y-4">
              <RentalSummary
                startDate={rental.startDate}
                endDate={rental.endDate}
                durationDays={rental.durationDays}
                pricePerDay={rental.pricePerDay}
                subtotal={rental.subtotal}
              />
              <RentalTimeline displayStatus={display} />

              <div className="flex flex-col gap-2">
                {isRenter && rental.status === 'pending' ? (
                  <Button variant="secondary" onClick={() => setAction('cancel')}>
                    Cancel Request
                  </Button>
                ) : null}
                {isOwner && rental.status === 'pending' ? (
                  <>
                    <Button onClick={() => setAction('approve')}>Approve Request</Button>
                    <Button variant="secondary" onClick={() => setAction('reject')}>
                      Reject Request
                    </Button>
                  </>
                ) : null}
                {isOwner && display === 'active' ? (
                  <Button onClick={() => setAction('complete')}>
                    Mark as Completed
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <RentalActionModal
        open={action === 'cancel'}
        onClose={() => setAction(null)}
        title="Cancel rental request?"
        description="This keeps the record in your history as cancelled."
        confirmLabel="Cancel Request"
        tone="danger"
        onConfirm={runAction}
      />
      <RentalActionModal
        open={action === 'approve'}
        onClose={() => setAction(null)}
        title="Approve rental request?"
        description="This marks the demo request as approved. No payment is collected."
        confirmLabel="Approve Request"
        onConfirm={runAction}
      />
      <RentalActionModal
        open={action === 'reject'}
        onClose={() => setAction(null)}
        title="Reject rental request?"
        description="This marks the demo request as rejected and keeps it in history."
        confirmLabel="Reject Request"
        tone="danger"
        onConfirm={runAction}
      />
      <RentalActionModal
        open={action === 'complete'}
        onClose={() => setAction(null)}
        title="Mark rental as completed?"
        description="Demo completion only — no return verification is performed."
        confirmLabel="Mark as Completed"
        onConfirm={runAction}
      />
      <Footer />
    </div>
  )
}

export default function RentalDetailsPage() {
  return (
    <RequireAuth>
      <RentalDetailsContent />
    </RequireAuth>
  )
}
