import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList, Search } from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import StatCard from '../components/dashboard/StatCard'
import RentalCard from '../components/rentals/RentalCard'
import ItemCard from '../components/ui/ItemCard'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { RequireRole } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { useRentals } from '../hooks/useRentals'
import { getMarketplaceCatalog } from '../data/listingUtils'
import { useListings } from '../hooks/useListings'
import { useSavedItems } from '../hooks/useSavedItems'
import { getDisplayStatus } from '../data/rentalUtils'

function greetingForNow() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function RenterDashboardContent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { getRenterRentals } = useRentals()
  const { listings } = useListings()
  const { savedIds } = useSavedItems()
  const firstName = user.name.split(' ')[0]
  const catalog = useMemo(() => getMarketplaceCatalog(listings), [listings])
  const recommended = useMemo(
    () => catalog.filter((item) => !savedIds.includes(item.id)).slice(0, 4),
    [catalog, savedIds],
  )
  const saved = useMemo(() => catalog.filter((item) => savedIds.includes(item.id)), [catalog, savedIds])
  const rentals = useMemo(() => getRenterRentals(user.id), [getRenterRentals, user.id])

  const stats = useMemo(() => {
    const displays = rentals.map((rental) => getDisplayStatus(rental))
    return {
      active: displays.filter((status) => status === 'active').length,
      upcoming: displays.filter((status) => status === 'approved').length,
      pending: displays.filter((status) => status === 'pending').length,
      completed: displays.filter((status) => status === 'completed').length,
    }
  }, [rentals])

  const active = rentals.filter((rental) => getDisplayStatus(rental) === 'active')
  const upcoming = rentals.filter((rental) => getDisplayStatus(rental) === 'approved')

  return (
    <DashboardLayout role="renter">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        <header>
          <h1 className="page-title">
            {greetingForNow()}, {firstName}
          </h1>
          <p className="mt-2 text-sm text-ink-soft sm:text-base">
            Here&apos;s what&apos;s happening with your rentals.
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            Demo rentals from this browser only.
          </p>
        </header>

        <section className="flex flex-wrap gap-2 sm:gap-3">
          <Button onClick={() => navigate('/explore')}>
            <Search className="h-4 w-4" aria-hidden="true" />
            Explore Items
          </Button>
          <Button variant="secondary" onClick={() => navigate('/renter/rentals')}>
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            View My Rentals
          </Button>
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            Edit Profile
          </Button>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Active Rentals" value={stats.active} />
          <StatCard label="Upcoming" value={stats.upcoming} />
          <StatCard label="Pending Requests" value={stats.pending} />
          <StatCard label="Completed" value={stats.completed} />
        </section>

        <section id="rentals" className="scroll-mt-28 space-y-4">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-bold text-ink">Active Rentals</h2>
            <Link to="/renter/rentals" className="text-sm font-semibold text-brand hover:text-brand-dark">
              View all →
            </Link>
          </div>
          {active.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No active rentals yet"
              description="Explore nearby items and send a rental request to get started."
              actionLabel="Explore Items"
              actionTo="/explore"
              className="py-10 sm:py-12"
            />
          ) : (
            <div className="space-y-4">
              {active.map((rental) => (
                <RentalCard key={rental.id} rental={rental} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">Upcoming Rentals</h2>
          {upcoming.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No upcoming rentals"
              description="Approved requests will appear here before the start date."
              actionLabel="View My Rentals"
              actionTo="/renter/rentals"
              className="py-10 sm:py-12"
            />
          ) : (
            <div className="space-y-4">
              {upcoming.map((rental) => (
                <RentalCard key={rental.id} rental={rental} />
              ))}
            </div>
          )}
        </section>

        <section id="saved" className="scroll-mt-28 space-y-4">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-bold text-ink">Saved Items</h2>
            <Link to="/explore" className="text-sm font-semibold text-brand hover:text-brand-dark">
              Browse more →
            </Link>
          </div>
          {saved.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No saved items yet"
              description="Tap the bookmark on an item to save it for later."
              actionLabel="Explore Items"
              actionTo="/explore"
              className="py-10 sm:py-12"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {saved.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">Recommended nearby</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommended.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </motion.div>
    </DashboardLayout>
  )
}

export default function RenterDashboard() {
  return (
    <RequireRole role="renter">
      <RenterDashboardContent />
    </RequireRole>
  )
}
