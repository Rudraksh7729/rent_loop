import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList, Package } from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import StatCard from '../components/dashboard/StatCard'
import ListingCard from '../components/dashboard/ListingCard'
import RentalRequestCard from '../components/rentals/RentalRequestCard'
import EarningsOverview from '../components/dashboard/EarningsOverview'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { RequireRole } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { useListings } from '../hooks/useListings'
import { useRentals } from '../hooks/useRentals'
import { formatPrice } from '../data/marketplaceUtils'
import { getDisplayStatus } from '../data/rentalUtils'

function OwnerDashboardContent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { getOwnerListings } = useListings()
  const { getOwnerRentals } = useRentals()
  const firstName = user.name.split(' ')[0]

  const listings = useMemo(() => getOwnerListings(user.id), [getOwnerListings, user.id])
  const rentals = useMemo(() => getOwnerRentals(user.id), [getOwnerRentals, user.id])

  const stats = useMemo(() => {
    const pending = rentals.filter((rental) => rental.status === 'pending').length
    const upcoming = rentals.filter(
      (rental) => getDisplayStatus(rental) === 'approved',
    ).length
    const active = rentals.filter((rental) => getDisplayStatus(rental) === 'active').length
    const completed = rentals.filter(
      (rental) => getDisplayStatus(rental) === 'completed',
    )
    const earningsByMonth = completed.reduce((map, rental) => {
      const date = new Date(rental.endDate)
      const key = Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 7)
      if (key) map[key] = (map[key] || 0) + rental.subtotal
      return map
    }, {})
    const breakdown = Object.entries(earningsByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, amount]) => ({
        label: new Date(`${key}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short' }),
        amount,
      }))
    const earnings = completed.reduce((sum, rental) => sum + rental.subtotal, 0)

    return { pending, upcoming, active, earnings, breakdown }
  }, [rentals])

  const recentListings = listings.slice(0, 4).map((listing) => ({
    id: listing.id,
    title: listing.title,
    image: listing.images?.[0] || '',
    pricePerDay: listing.pricePerDay,
    category: listing.category,
    status:
      listing.status === 'published'
        ? 'Published'
        : listing.status === 'paused'
          ? 'Paused'
          : 'Draft',
    available: listing.available,
  }))

  const recentRequests = rentals.slice(0, 3)

  return (
    <DashboardLayout role="owner">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="page-title">Welcome back, {firstName}</h1>
            <p className="mt-2 text-sm text-ink-soft sm:text-base">
              Manage your listings and rental activity.
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              Stats and earnings are calculated from rental activity saved in this browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate('/owner/requests')}>
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              View Requests
            </Button>
            <Button size="lg" onClick={() => navigate('/owner/listings/new')}>
              List an Item
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Pending Requests" value={stats.pending} />
          <StatCard label="Approved / Upcoming" value={stats.upcoming} />
          <StatCard label="Active Rentals" value={stats.active} />
          <StatCard
            label="Earnings"
            value={formatPrice(stats.earnings)}
            hint="From completed rentals"
          />
        </section>

        <section id="listings" className="scroll-mt-28 space-y-4">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-bold text-ink">Recent listings</h2>
            <Link to="/owner/listings" className="text-sm font-semibold text-brand hover:text-brand-dark">
              View all →
            </Link>
          </div>

          {recentListings.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No listings yet"
              description="Start earning from items you don't use every day."
              actionLabel="List an Item"
              actionTo="/owner/listings/new"
              className="py-10 sm:py-12"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {recentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        <section id="requests" className="scroll-mt-28 space-y-4">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-bold text-ink">Rental Requests</h2>
            <Link to="/owner/requests" className="text-sm font-semibold text-brand hover:text-brand-dark">
              View all →
            </Link>
          </div>
          {recentRequests.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No requests yet"
              description="New rental requests will appear here when renters book your items."
              actionLabel="View My Listings"
              actionTo="/owner/listings"
              className="py-10 sm:py-12"
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {recentRequests.map((rental) => (
                <RentalRequestCard key={rental.id} rental={rental} />
              ))}
            </div>
          )}
        </section>

        <section id="earnings" className="scroll-mt-28">
          <EarningsOverview
            total={stats.demoEarnings || 0}
            breakdown={stats.breakdown}
          />
        </section>
      </motion.div>
    </DashboardLayout>
  )
}

export default function OwnerDashboard() {
  return (
    <RequireRole role="owner">
      <OwnerDashboardContent />
    </RequireRole>
  )
}
