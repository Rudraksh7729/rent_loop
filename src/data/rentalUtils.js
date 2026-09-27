import { calcRentalDays } from './marketplaceUtils.js'

/** Built-in mock catalog bookings route to the demo owner for presentations. */
export const MOCK_CATALOG_OWNER_ID = 'demo-owner'

export function todayISO(date = new Date()) {
  const copy = new Date(date)
  const offset = copy.getTimezoneOffset()
  const local = new Date(copy.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

export function resolveItemOwnerId(item) {
  if (!item) return ''
  if (item.ownerId) return item.ownerId
  if (item.source === 'owner' && item.owner?.id) return item.owner.id
  return MOCK_CATALOG_OWNER_ID
}

export function datesOverlap(startA, endA, startB, endB) {
  return startA <= endB && startB <= endA
}

/**
 * Display lifecycle status based on stored status + calendar dates.
 */
export function getDisplayStatus(rental, today = todayISO()) {
  if (!rental) return 'pending'
  const { status, startDate, endDate } = rental

  if (status === 'pending' || status === 'rejected' || status === 'cancelled') {
    return status
  }

  if (status === 'completed') return 'completed'

  if (status === 'approved' || status === 'active') {
    if (today > endDate) return 'completed'
    if (today >= startDate) return 'active'
    return 'approved'
  }

  return status
}

export function getDisplayLabel(displayStatus) {
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return labels[displayStatus] || displayStatus
}

export function hasDateConflict(rentals, itemId, startDate, endDate, ignoreRentalId) {
  return rentals.some((rental) => {
    if (rental.itemId !== itemId) return false
    if (ignoreRentalId && rental.id === ignoreRentalId) return false
    if (rental.status !== 'approved' && rental.status !== 'active') return false
    const display = getDisplayStatus(rental)
    if (display === 'completed') return false
    return datesOverlap(startDate, endDate, rental.startDate, rental.endDate)
  })
}

export function validateRentalDates(startDate, endDate, today = todayISO()) {
  if (!startDate || !endDate) {
    return { ok: false, error: 'Select both start and end dates.', days: 0 }
  }

  const isoDate = /^\d{4}-\d{2}-\d{2}$/
  if (!isoDate.test(startDate) || !isoDate.test(endDate)) {
    return { ok: false, error: 'Select valid rental dates.', days: 0 }
  }

  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { ok: false, error: 'Select valid rental dates.', days: 0 }
  }

  if (startDate < today || endDate < today) {
    return { ok: false, error: 'Rental dates cannot be in the past.', days: 0 }
  }

  const days = calcRentalDays(startDate, endDate)
  if (days < 1) {
    return { ok: false, error: 'End date must be on or after the start date.', days: 0 }
  }

  return { ok: true, days }
}

export function buildItemSnapshot(item) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.images?.[0] || item.image || '',
    location: item.location || '',
    city: item.city || '',
  }
}

export function buildUserSnapshot(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email || '',
    avatar: user.avatar || '',
  }
}

export function filterRentalsByTab(rentals, tab, today = todayISO()) {
  return rentals.filter((rental) => {
    const display = getDisplayStatus(rental, today)
    switch (tab) {
      case 'pending':
        return display === 'pending'
      case 'upcoming':
        return display === 'approved'
      case 'active':
        return display === 'active'
      case 'completed':
        return display === 'completed'
      case 'closed':
        return display === 'cancelled' || display === 'rejected'
      default:
        return true
    }
  })
}

export function getTimelineStage(displayStatus) {
  switch (displayStatus) {
    case 'pending':
      return 0
    case 'rejected':
    case 'cancelled':
      return 1
    case 'approved':
      return 2
    case 'active':
      return 3
    case 'completed':
      return 4
    default:
      return 0
  }
}

export function isItemBookable(item) {
  if (!item) return false
  if (item.status && item.status !== 'published') return false
  return Boolean(item.available !== false)
}
