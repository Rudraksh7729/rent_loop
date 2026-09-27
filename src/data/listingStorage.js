const LISTINGS_STORAGE_KEY = 'rentloop_listings'

export const LISTING_STATUSES = ['published', 'draft', 'paused']

export const FEATURE_SUGGESTIONS = [
  'Good condition',
  'Includes accessories',
  'Easy pickup',
  'Recently serviced',
  'Available for pickup',
  'Suitable for outdoor use',
]

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function normalizeListing(raw) {
  if (!raw || typeof raw !== 'object') return null
  if (!isNonEmptyString(raw.id) || !isNonEmptyString(raw.ownerId)) return null
  if (!isNonEmptyString(raw.title) || !isNonEmptyString(raw.category)) return null
  if (!LISTING_STATUSES.includes(raw.status)) return null

  const pricePerDay = Number(raw.pricePerDay)
  if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) return null

  const images = Array.isArray(raw.images)
    ? raw.images.filter((src) => isNonEmptyString(src)).slice(0, 5)
    : []

  const features = Array.isArray(raw.features)
    ? raw.features.filter((entry) => isNonEmptyString(entry)).map((entry) => entry.trim())
    : []

  return {
    id: raw.id,
    ownerId: raw.ownerId,
    title: raw.title.trim(),
    category: raw.category.trim(),
    description: isNonEmptyString(raw.description) ? raw.description.trim() : '',
    pricePerDay: Math.round(pricePerDay),
    location: isNonEmptyString(raw.location) ? raw.location.trim() : '',
    city: isNonEmptyString(raw.city) ? raw.city.trim() : '',
    distanceKm:
      typeof raw.distanceKm === 'number' && Number.isFinite(raw.distanceKm)
        ? raw.distanceKm
        : 2.5,
    rating: typeof raw.rating === 'number' ? raw.rating : 0,
    reviews: typeof raw.reviews === 'number' ? raw.reviews : 0,
    images,
    features,
    available: Boolean(raw.available),
    availabilityNote: isNonEmptyString(raw.availabilityNote)
      ? raw.availabilityNote.trim()
      : '',
    status: raw.status,
    createdAt: isNonEmptyString(raw.createdAt)
      ? raw.createdAt
      : new Date().toISOString(),
    updatedAt: isNonEmptyString(raw.updatedAt)
      ? raw.updatedAt
      : new Date().toISOString(),
    owner: {
      name: isNonEmptyString(raw.owner?.name) ? raw.owner.name : 'Owner',
      avatar: isNonEmptyString(raw.owner?.avatar) ? raw.owner.avatar : '',
      memberSince:
        typeof raw.owner?.memberSince === 'number'
          ? raw.owner.memberSince
          : new Date().getFullYear(),
      rating: typeof raw.owner?.rating === 'number' ? raw.owner.rating : 5,
      rentals: typeof raw.owner?.rentals === 'number' ? raw.owner.rentals : 0,
    },
    source: 'owner',
  }
}

export function loadListings() {
  try {
    const raw = localStorage.getItem(LISTINGS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(LISTINGS_STORAGE_KEY)
      return []
    }
    return parsed.map(normalizeListing).filter(Boolean)
  } catch {
    localStorage.removeItem(LISTINGS_STORAGE_KEY)
    return []
  }
}

export function saveListings(listings) {
  const safe = (Array.isArray(listings) ? listings : [])
    .map(normalizeListing)
    .filter(Boolean)

  try {
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(safe))
    return safe
  } catch (error) {
    if (error?.name === 'QuotaExceededError' || error?.code === 22) {
      return null
    }
    throw error
  }
}

export function createListingId() {
  return `listing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
