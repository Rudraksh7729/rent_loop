import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import RentalRequestCard from '../components/rentals/RentalRequestCard'
import InlineAlert from '../components/ui/InlineAlert'
import EmptyState from '../components/ui/EmptyState'
import RentalActionModal from '../components/rentals/RentalActionModal'
import { RequireRole } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { useRentals } from '../hooks/useRentals'
import { getDisplayStatus } from '../data/rentalUtils'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'closed', label: 'Rejected / Cancelled' },
]

function OwnerRequestsContent() {
  const { user } = useAuth()
  const { getOwnerRentals, approveRental, rejectRental } = useRentals()
  const [tab, setTab] = useState('pending')
  const [notice, setNotice] = useState('')
  const [action, setAction] = useState(null)

  const rentals = useMemo(() => getOwnerRentals(user.id), [getOwnerRentals, user.id])

  const filtered = useMemo(() => {
    return rentals.filter((rental) => {
      const display = getDisplayStatus(rental)
      if (tab === 'all') return true
      if (tab === 'closed') return display === 'rejected' || display === 'cancelled'
      return display === tab || (tab === 'pending' && rental.status === 'pending')
    })
  }, [rentals, tab])

  function runAction() {
    if (!action) return
    const result =
      action.type === 'approve'
        ? approveRental(action.rental.id, user.id)
        : rejectRental(action.rental.id, user.id)
    setAction(null)
    setNotice(
      result.ok
        ? action.type === 'approve'
          ? 'Rental request approved'
          : 'Rental request rejected'
        : result.error,
    )
  }

  return (
    <DashboardLayout role="owner">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6"
      >
        <header>
          <h1 className="page-title">Rental Requests</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Review demo rental requests for your listings and marketplace items.
          </p>
        </header>

        {notice ? (
          <InlineAlert
            tone={
              notice.includes('approved') || notice.includes('rejected')
                ? 'success'
                : 'error'
            }
          >
            {notice}
          </InlineAlert>
        ) : null}

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Request status">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={tab === entry.id}
              onClick={() => setTab(entry.id)}
              className={`filter-tab ${
                tab === entry.id ? 'filter-tab-active' : 'filter-tab-idle'
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No requests yet"
            description="New rental requests will appear here when renters book your items."
            actionLabel="Manage listings"
            actionTo="/owner/listings"
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((rental) => (
              <RentalRequestCard
                key={rental.id}
                rental={rental}
                onApprove={() => setAction({ type: 'approve', rental })}
                onReject={() => setAction({ type: 'reject', rental })}
              />
            ))}
          </div>
        )}
      </motion.div>

      <RentalActionModal
        open={Boolean(action)}
        onClose={() => setAction(null)}
        title={
          action?.type === 'approve' ? 'Approve rental request?' : 'Reject rental request?'
        }
        description={
          action?.type === 'approve'
            ? 'This marks the demo request as approved. No payment is collected.'
            : 'This marks the demo request as rejected. The record is kept in history.'
        }
        confirmLabel={action?.type === 'approve' ? 'Approve Request' : 'Reject Request'}
        tone={action?.type === 'reject' ? 'danger' : 'primary'}
        onConfirm={runAction}
      />
    </DashboardLayout>
  )
}

export default function OwnerRentalRequestsPage() {
  return (
    <RequireRole role="owner">
      <OwnerRequestsContent />
    </RequireRole>
  )
}
