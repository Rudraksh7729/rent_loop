import { items, getItemById as getMockItemById, getRelatedItems as getMockRelated } from './items'
import { normalizeListing } from './listingStorage'

/** Convert an owner listing into the marketplace item shape used by Explore/Details. */
export function listingToMarketplaceItem(listing) {
  const safe = normalizeListing(listing)
  if (!safe) return null

  return {
    ...safe,
    image: safe.images[0] || '',
    featured: false,
  }
}

export function isPublicListing(listing) {
  return listing?.status === 'published'
}

export function getPublicOwnerListings(listings = []) {
  return listings
    .filter(isPublicListing)
    .map(listingToMarketplaceItem)
    .filter(Boolean)
}

export function getMarketplaceCatalog(ownerListings = []) {
  const publicOwnerItems = getPublicOwnerListings(ownerListings)
  const mockIds = new Set(items.map((item) => item.id))
  const uniqueOwnerItems = publicOwnerItems.filter((item) => !mockIds.has(item.id))
  return [...uniqueOwnerItems, ...items]
}

export function findMarketplaceItem(id, ownerListings = [], options = {}) {
  const fromOwner = ownerListings.find((listing) => listing.id === id)
  if (fromOwner) {
    const isOwnerViewer =
      Boolean(options.viewerId) && fromOwner.ownerId === options.viewerId
    if (!isPublicListing(fromOwner) && !isOwnerViewer) return null
    return listingToMarketplaceItem(fromOwner)
  }
  return getMockItemById(id) || null
}

export function findRelatedMarketplaceItems(item, ownerListings = [], limit = 4) {
  if (!item) return []
  const catalog = getMarketplaceCatalog(ownerListings).filter((entry) => entry.id !== item.id)
  const sameCategory = catalog.filter((entry) => entry.category === item.category)
  const others = catalog.filter((entry) => entry.category !== item.category)
  return [...sameCategory, ...others].slice(0, limit)
}

export function emptyListingForm() {
  return {
    title: '',
    category: '',
    description: '',
    pricePerDay: '',
    location: '',
    city: '',
    available: true,
    availabilityNote: '',
    features: [],
    images: [],
  }
}

export function listingToFormValues(listing) {
  if (!listing) return emptyListingForm()
  return {
    title: listing.title || '',
    category: listing.category || '',
    description: listing.description || '',
    pricePerDay: String(listing.pricePerDay ?? ''),
    location: listing.location || '',
    city: listing.city || '',
    available: Boolean(listing.available),
    availabilityNote: listing.availabilityNote || '',
    features: Array.isArray(listing.features) ? [...listing.features] : [],
    images: Array.isArray(listing.images) ? [...listing.images] : [],
  }
}

export function buildListingPreview(form, owner) {
  const price = Number(form.pricePerDay)
  return {
    id: 'preview',
    title: form.title || 'Untitled item',
    category: form.category || 'Category',
    description: form.description || 'Add a short description for renters.',
    pricePerDay: Number.isFinite(price) && price > 0 ? price : 0,
    location: form.location || 'Location',
    city: form.city || '',
    distanceKm: 2.5,
    rating: 0,
    reviews: 0,
    images: form.images.length ? form.images : [''],
    image: form.images[0] || '',
    features: form.features,
    available: Boolean(form.available),
    owner: {
      name: owner?.name || 'Owner',
      avatar: owner?.avatar || '',
      memberSince: owner?.memberSince || new Date().getFullYear(),
      rating: owner?.rating || 5,
      rentals: owner?.rentals || 0,
    },
  }
}

export { getMockRelated }
