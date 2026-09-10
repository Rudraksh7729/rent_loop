import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FormField from '../components/ui/FormField'
import InlineAlert from '../components/ui/InlineAlert'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ListingImagePicker from '../components/listings/ListingImagePicker'
import FeatureEditor from '../components/listings/FeatureEditor'
import ListingPreviewPanel from '../components/listings/ListingPreviewPanel'
import { RequireRole } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { useListings } from '../hooks/useListings'
import { filterCategories, demoCities } from '../data/filters'
import {
  buildListingPreview,
  emptyListingForm,
  listingToFormValues,
} from '../data/listingUtils'

function validateListingForm(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Item name is required.'
  else if (form.title.trim().length < 3) errors.title = 'Use at least 3 characters.'
  else if (form.title.trim().length > 80) errors.title = 'Keep the name under 80 characters.'

  if (!form.category) errors.category = 'Choose a category.'

  if (!form.description.trim()) errors.description = 'Description is required.'
  else if (form.description.trim().length < 20) {
    errors.description = 'Add a bit more detail (20+ characters).'
  } else if (form.description.trim().length > 800) {
    errors.description = 'Keep the description under 800 characters.'
  }

  const price = Number(form.pricePerDay)
  if (!form.pricePerDay || Number.isNaN(price)) errors.pricePerDay = 'Enter a daily price.'
  else if (price <= 0) errors.pricePerDay = 'Price must be greater than 0.'
  else if (price > 100000) errors.pricePerDay = 'Enter a realistic daily rental price.'

  if (!form.location.trim()) errors.location = 'Location is required.'
  if (!form.city) errors.city = 'Choose a city.'
  if (!form.images.length) errors.images = 'Add at least one photo.'

  return errors
}

function CreateListingContent() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getListingById, createListing, updateListing } = useListings()

  const existing = isEditing ? getListingById(id) : null
  const [form, setForm] = useState(() =>
    existing ? listingToFormValues(existing) : emptyListingForm(),
  )
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successText, setSuccessText] = useState('')

  useEffect(() => {
    if (!isEditing) return
    if (!existing || existing.ownerId !== user.id) {
      navigate('/owner/listings', { replace: true })
      return
    }
    setForm(listingToFormValues(existing))
  }, [isEditing, existing, user.id, navigate])

  const preview = useMemo(() => buildListingPreview(form, user), [form, user])

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function runValidation() {
    const nextErrors = validateListingForm(form)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSave(status) {
    setMessage('')
    if (!runValidation()) {
      setMessage('Please fix the highlighted fields before continuing.')
      return
    }

    setBusy(true)
    window.setTimeout(() => {
      const result = isEditing
        ? updateListing(id, { ownerId: user.id, form, status })
        : createListing({ owner: user, form, status })

      setBusy(false)
      if (!result.ok) {
        setMessage(result.error || 'Could not save listing.')
        return
      }

      setSuccessText(
        status === 'draft'
          ? 'Draft saved in demo mode.'
          : 'Listing published in demo mode.',
      )
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
          <Link to="/owner/listings" className="back-link">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to My Listings
          </Link>
          <h1 className="page-title mt-4">
            {isEditing ? 'Edit your listing' : 'List your item'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft sm:text-base">
            Turn things you don&apos;t use every day into extra income.
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            Demo mode — listings are saved in this browser only.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              handleSave('published')
            }}
            noValidate
          >
            {message ? <InlineAlert>{message}</InlineAlert> : null}

            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="font-display text-xl font-bold text-ink">
                1. Basic information
              </h2>
              <div className="mt-4 space-y-4">
                <FormField
                  id="listing-title"
                  label="Item Name"
                  value={form.title}
                  onChange={(event) => update('title', event.target.value)}
                  error={errors.title}
                  placeholder="Sony Alpha Camera"
                />

                <label className="block text-sm" htmlFor="listing-category">
                  <span className="mb-1.5 block font-medium text-ink">Category</span>
                  <select
                    id="listing-category"
                    value={form.category}
                    onChange={(event) => update('category', event.target.value)}
                    className="input-rl"
                    aria-invalid={Boolean(errors.category)}
                  >
                    <option value="">Select a category</option>
                    {filterCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category ? (
                    <span className="mt-1.5 block text-sm text-accent" role="alert">
                      {errors.category}
                    </span>
                  ) : null}
                </label>

                <label className="block text-sm" htmlFor="listing-description">
                  <span className="mb-1.5 block font-medium text-ink">Description</span>
                  <textarea
                    id="listing-description"
                    rows={5}
                    value={form.description}
                    onChange={(event) => update('description', event.target.value)}
                    className="input-rl"
                    placeholder="What is included, condition, and who it is perfect for."
                    aria-invalid={Boolean(errors.description)}
                  />
                  <span className="mt-1.5 flex justify-between gap-3 text-xs text-ink-soft">
                    <span>{errors.description || 'Be specific and honest.'}</span>
                    <span>{form.description.length}/800</span>
                  </span>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="font-display text-xl font-bold text-ink">2. Photos</h2>
              <div className="mt-4">
                <ListingImagePicker
                  images={form.images}
                  onChange={(images) => update('images', images)}
                  error={errors.images}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="font-display text-xl font-bold text-ink">3. Rental details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2" htmlFor="listing-price">
                  <span className="mb-1.5 block font-medium text-ink">Price per day</span>
                  <span className="flex items-center gap-2 rounded-xl border border-line bg-sand/40 px-3 focus-within:border-brand">
                    <span className="font-semibold text-brand">₹</span>
                    <input
                      id="listing-price"
                      type="number"
                      min="1"
                      step="1"
                      value={form.pricePerDay}
                      onChange={(event) => update('pricePerDay', event.target.value)}
                      className="w-full border-0 bg-transparent py-2.5 text-ink focus:outline-none"
                      placeholder="500"
                      aria-invalid={Boolean(errors.pricePerDay)}
                    />
                    <span className="shrink-0 text-xs text-ink-soft">/ day</span>
                  </span>
                  {errors.pricePerDay ? (
                    <span className="mt-1.5 block text-sm text-accent" role="alert">
                      {errors.pricePerDay}
                    </span>
                  ) : null}
                </label>

                <FormField
                  id="listing-location"
                  label="Location"
                  value={form.location}
                  onChange={(event) => update('location', event.target.value)}
                  error={errors.location}
                  placeholder="Sector 17, Chandigarh"
                />

                <label className="block text-sm" htmlFor="listing-city">
                  <span className="mb-1.5 block font-medium text-ink">City</span>
                  <select
                    id="listing-city"
                    value={form.city}
                    onChange={(event) => update('city', event.target.value)}
                    className="input-rl"
                  >
                    <option value="">Select a city</option>
                    {demoCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city ? (
                    <span className="mt-1.5 block text-sm text-accent" role="alert">
                      {errors.city}
                    </span>
                  ) : null}
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="font-display text-xl font-bold text-ink">4. Availability</h2>
              <div className="mt-4 space-y-4">
                <label className="flex items-center justify-between gap-4 rounded-xl border border-line bg-sand/40 px-4 py-3">
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      Available for rent
                    </span>
                    <span className="text-xs text-ink-soft">
                      Turn off if the item is temporarily not rentable.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(event) => update('available', event.target.checked)}
                    className="h-5 w-5 accent-brand"
                  />
                </label>
                <FormField
                  id="listing-note"
                  label="Availability note (optional)"
                  value={form.availabilityNote}
                  onChange={(event) => update('availabilityNote', event.target.value)}
                  placeholder="Available on weekends"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="font-display text-xl font-bold text-ink">5. Features</h2>
              <div className="mt-4">
                <FeatureEditor
                  features={form.features}
                  onChange={(features) => update('features', features)}
                />
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => {
                  if (!runValidation()) {
                    setMessage('Please fix the highlighted fields before previewing.')
                    return
                  }
                  setPreviewOpen(true)
                }}
              >
                Preview Listing
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => handleSave('draft')}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Publish Listing'}
              </Button>
            </div>
          </form>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-line bg-surface p-5">
              <ListingPreviewPanel preview={preview} />
            </div>
          </aside>
        </div>
      </main>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Listing preview"
      >
        <ListingPreviewPanel preview={preview} />
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            onClick={() => {
              setPreviewOpen(false)
              handleSave('published')
            }}
          >
            Publish Listing
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setPreviewOpen(false)}
          >
            Keep editing
          </Button>
        </div>
      </Modal>

      <Modal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false)
          navigate('/owner/listings')
        }}
        title={successText}
      >
        <p className="text-sm text-ink-soft">
          Your listing is stored locally for this demo. It is not published to a real
          server.
        </p>
        <Button
          className="mt-6 w-full"
          onClick={() => {
            setSuccessOpen(false)
            navigate('/owner/listings')
          }}
        >
          Go to My Listings
        </Button>
      </Modal>

      <Footer />
    </div>
  )
}

export default function CreateListingPage() {
  return (
    <RequireRole role="owner">
      <CreateListingContent />
    </RequireRole>
  )
}
