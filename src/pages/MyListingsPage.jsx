import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import OwnerListingCard from '../components/listings/OwnerListingCard'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import InlineAlert from '../components/ui/InlineAlert'
import EmptyState from '../components/ui/EmptyState'
import { RequireRole } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { useListings } from '../hooks/useListings'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
  { id: 'paused', label: 'Paused' },
]

function MyListingsContent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    getOwnerListings,
    deleteListing,
    publishListing,
    pauseListing,
  } = useListings()
  const [tab, setTab] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [notice, setNotice] = useState('')

  const listings = useMemo(() => getOwnerListings(user.id), [getOwnerListings, user.id])

  const filtered = useMemo(() => {
    if (tab === 'all') return listings
    return listings.filter((listing) => listing.status === tab)
  }, [listings, tab])

  function handlePublish(id) {
    const result = publishListing(id, user.id)
    setNotice(result.ok ? 'Listing published in demo mode.' : result.error)
  }

  function handlePause(id) {
    const result = pauseListing(id, user.id)
    setNotice(result.ok ? 'Listing paused. It is hidden from Explore.' : result.error)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    const result = deleteListing(deleteTarget.id, user.id)
    setDeleteTarget(null)
    setNotice(result.ok ? 'Listing deleted from this browser.' : result.error)
  }

  return (
    <DashboardLayout role="owner">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6"
      >
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="page-title">My Listings</h1>
            <p className="mt-2 text-sm text-ink-soft">
              Manage drafts, published items, and paused listings in demo mode.
            </p>
          </div>
          <Button onClick={() => navigate('/owner/listings/new')}>List an Item</Button>
        </header>

        {notice ? (
          <InlineAlert tone={notice.toLowerCase().includes('deleted') || notice.toLowerCase().includes('paused') || notice.toLowerCase().includes('published') ? 'success' : 'error'}>
            {notice}
          </InlineAlert>
        ) : null}

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Listing status">
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
            icon={Package}
            title="No listings yet"
            description="Start earning from items you don't use every day."
            actionLabel="List an Item"
            actionTo="/owner/listings/new"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((listing) => (
              <OwnerListingCard
                key={listing.id}
                listing={listing}
                onPublish={() => handlePublish(listing.id)}
                onPause={() => handlePause(listing.id)}
                onDelete={() => setDeleteTarget(listing)}
              />
            ))}
          </div>
        )}
      </motion.div>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this listing?"
      >
        <p className="text-sm leading-relaxed text-ink-soft">
          This action cannot be undone. The listing will be removed from this browser&apos;s
          demo data.
        </p>
        <p className="mt-3 text-sm font-semibold text-ink">{deleteTarget?.title}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </Button>
          <Button className="flex-1" variant="danger" onClick={confirmDelete}>
            Delete Listing
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default function MyListingsPage() {
  return (
    <RequireRole role="owner">
      <MyListingsContent />
    </RequireRole>
  )
}
