const RENTALS_STORAGE_KEY = 'rentloop_rentals'

export const RENTAL_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'active',
  'completed',
  'cancelled',
]

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isISODate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function normalizeSnapshot(raw = {}) {
  return {
    id: isNonEmptyString(raw.id) ? raw.id : '',
    name: isNonEmptyString(raw.name) ? raw.name : 'User',
    email: isNonEmptyString(raw.email) ? raw.email : '',
    avatar: isNonEmptyString(raw.avatar) ? raw.avatar : '',
  }
}

function normalizeItemSnapshot(raw = {}) {
  return {
    id: isNonEmptyString(raw.id) ? raw.id : '',
    title: isNonEmptyString(raw.title) ? raw.title : 'Item',
    category: isNonEmptyString(raw.category) ? raw.category : '',
    image: isNonEmptyString(raw.image) ? raw.image : '',
    location: isNonEmptyString(raw.location) ? raw.location : '',
    city: isNonEmptyString(raw.city) ? raw.city : '',
  }
}

export function normalizeRental(raw) {
  if (!raw || typeof raw !== 'object') return null
  if (!isNonEmptyString(raw.id)) return null
  if (!isNonEmptyString(raw.itemId)) return null
  if (!isNonEmptyString(raw.renterId) || !isNonEmptyString(raw.ownerId)) return null
  if (!RENTAL_STATUSES.includes(raw.status)) return null
  if (!isISODate(raw.startDate) || !isISODate(raw.endDate)) return null

  const durationDays = Number(raw.durationDays)
  const pricePerDay = Number(raw.pricePerDay)
  const subtotal = Number(raw.subtotal)
  if (!Number.isFinite(durationDays) || durationDays < 1) return null
  if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) return null
  if (!Number.isFinite(subtotal) || subtotal <= 0) return null

  return {
    id: raw.id,
    itemId: raw.itemId,
    renterId: raw.renterId,
    ownerId: raw.ownerId,
    itemSnapshot: normalizeItemSnapshot(raw.itemSnapshot),
    renterSnapshot: normalizeSnapshot(raw.renterSnapshot),
    ownerSnapshot: normalizeSnapshot(raw.ownerSnapshot),
    startDate: raw.startDate,
    endDate: raw.endDate,
    durationDays: Math.round(durationDays),
    pricePerDay: Math.round(pricePerDay),
    subtotal: Math.round(subtotal),
    status: raw.status,
    createdAt: isNonEmptyString(raw.createdAt)
      ? raw.createdAt
      : new Date().toISOString(),
    updatedAt: isNonEmptyString(raw.updatedAt)
      ? raw.updatedAt
      : new Date().toISOString(),
  }
}

export function loadRentals() {
  try {
    const raw = localStorage.getItem(RENTALS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(RENTALS_STORAGE_KEY)
      return []
    }
    return parsed.map(normalizeRental).filter(Boolean)
  } catch {
    localStorage.removeItem(RENTALS_STORAGE_KEY)
    return []
  }
}

export function saveRentals(rentals) {
  const safe = (Array.isArray(rentals) ? rentals : [])
    .map(normalizeRental)
    .filter(Boolean)
  localStorage.setItem(RENTALS_STORAGE_KEY, JSON.stringify(safe))
  return safe
}

export function createRentalId() {
  return `rental-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
