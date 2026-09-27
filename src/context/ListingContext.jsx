import { createContext, useMemo, useState } from 'react'
import {
  createListingId,
  loadListings,
  normalizeListing,
  saveListings,
} from '../data/listingStorage'

export const ListingContext = createContext(null)

export function ListingProvider({ children }) {
  const [listings, setListings] = useState(() => loadListings())

  const value = useMemo(() => {
    function persist(next) {
      const saved = saveListings(next)
      if (!saved) {
        return { ok: false, error: 'Browser storage is full. Remove an existing listing photo or listing and try again.' }
      }
      setListings(saved)
      return { ok: true, listings: saved }
    }

    function getListings() {
      return listings
    }

    function getListingById(id) {
      return listings.find((listing) => listing.id === id) || null
    }

    function getOwnerListings(ownerId) {
      return listings
        .filter((listing) => listing.ownerId === ownerId)
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    }

    function getPublishedListings() {
      return listings.filter((listing) => listing.status === 'published')
    }

    function createListing({ owner, form, status }) {
      if (!owner?.id) return { ok: false, error: 'Owner session required.' }
      if (!['published', 'draft', 'paused'].includes(status)) {
        return { ok: false, error: 'Invalid listing status.' }
      }

      const now = new Date().toISOString()
      const listing = normalizeListing({
        id: createListingId(),
        ownerId: owner.id,
        title: form.title,
        category: form.category,
        description: form.description,
        pricePerDay: Number(form.pricePerDay),
        location: form.location,
        city: form.city,
        distanceKm: 2.5,
        rating: 0,
        reviews: 0,
        images: form.images,
        features: form.features,
        available: Boolean(form.available),
        availabilityNote: form.availabilityNote,
        status,
        createdAt: now,
        updatedAt: now,
        owner: {
          name: owner.name,
          avatar: owner.avatar,
          memberSince: owner.memberSince,
          rating: owner.rating,
          rentals: 0,
        },
      })

      if (!listing) return { ok: false, error: 'Could not create listing. Check required fields.' }

      const result = persist([listing, ...listings])
      if (!result.ok) return result
      return { ok: true, listing }
    }

    function updateListing(id, { ownerId, form, status }) {
      const existing = listings.find((listing) => listing.id === id)
      if (!existing) return { ok: false, error: 'Listing not found.' }
      if (existing.ownerId !== ownerId) {
        return { ok: false, error: 'You can only edit your own listings.' }
      }

      const nextStatus = status || existing.status
      if (!['published', 'draft', 'paused'].includes(nextStatus)) {
        return { ok: false, error: 'Invalid listing status.' }
      }

      const updated = normalizeListing({
        ...existing,
        title: form.title,
        category: form.category,
        description: form.description,
        pricePerDay: Number(form.pricePerDay),
        location: form.location,
        city: form.city,
        images: form.images,
        features: form.features,
        available: Boolean(form.available),
        availabilityNote: form.availabilityNote,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      })

      if (!updated) return { ok: false, error: 'Could not update listing. Check required fields.' }

      const result = persist(listings.map((listing) => (listing.id === id ? updated : listing)))
      if (!result.ok) return result
      return { ok: true, listing: updated }
    }

    function deleteListing(id, ownerId) {
      const existing = listings.find((listing) => listing.id === id)
      if (!existing) return { ok: false, error: 'Listing not found.' }
      if (existing.ownerId !== ownerId) {
        return { ok: false, error: 'You can only delete your own listings.' }
      }
      const result = persist(listings.filter((listing) => listing.id !== id))
      if (!result.ok) return result
      return { ok: true }
    }

    function setListingStatus(id, ownerId, status) {
      const existing = listings.find((listing) => listing.id === id)
      if (!existing) return { ok: false, error: 'Listing not found.' }
      if (existing.ownerId !== ownerId) {
        return { ok: false, error: 'You can only manage your own listings.' }
      }
      if (!['published', 'draft', 'paused'].includes(status)) {
        return { ok: false, error: 'Invalid status.' }
      }

      const updated = normalizeListing({
        ...existing,
        status,
        updatedAt: new Date().toISOString(),
      })
      if (!updated) return { ok: false, error: 'Could not update listing.' }

      const result = persist(listings.map((listing) => (listing.id === id ? updated : listing)))
      if (!result.ok) return result
      return { ok: true, listing: updated }
    }

    function publishListing(id, ownerId) {
      return setListingStatus(id, ownerId, 'published')
    }

    function pauseListing(id, ownerId) {
      return setListingStatus(id, ownerId, 'paused')
    }

    return {
      listings,
      getListings,
      getListingById,
      getOwnerListings,
      getPublishedListings,
      createListing,
      updateListing,
      deleteListing,
      publishListing,
      pauseListing,
      setListingStatus,
    }
  }, [listings])

  return <ListingContext.Provider value={value}>{children}</ListingContext.Provider>
}
