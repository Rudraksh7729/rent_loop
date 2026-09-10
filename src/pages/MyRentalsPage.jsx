import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import RentalCard from '../components/rentals/RentalCard'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { RequireRole } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { useRentals } from '../hooks/useRentals'
import { filterRentalsByTab } from '../data/rentalUtils'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'closed', label: 'Cancelled / Rejected' },
]

function MyRentalsContent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { getRenterRentals } = useRentals()
  const [tab, setTab] = useState('all')

  const rentals = useMemo(() => getRenterRentals(user.id), [getRenterRentals, user.id])
  const filtered = useMemo(() => filterRentalsByTab(rentals, tab), [rentals, tab])

  return (
    <DashboardLayout role="renter">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6"
      >
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="page-title">My Rentals</h1>
            <p className="mt-2 text-sm text-ink-soft">
              Track your demo rental requests and history.
            </p>
          </div>
          <Button onClick={() => navigate('/explore')}>Explore Items</Button>
        </header>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Rental status">
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
            title="No rentals yet"
            description="Explore nearby items and find something useful to rent."
            actionLabel="Explore Items"
            actionTo="/explore"
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((rental) => (
              <RentalCard key={rental.id} rental={rental} perspective="renter" />
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}

export default function MyRentalsPage() {
  return (
    <RequireRole role="renter">
      <MyRentalsContent />
    </RequireRole>
  )
}
