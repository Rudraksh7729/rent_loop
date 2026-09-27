import { priceRanges } from './filters.js'

export function getOwnerName(owner) {
  return typeof owner === 'string' ? owner : owner?.name || 'Owner'
}

export function getItemImage(item) {
  if (item.images?.length) return item.images[0]
  return item.image || ''
}

export function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

export function calcRentalDays(startDate, endDate) {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0
  const diff = end.getTime() - start.getTime()
  if (diff < 0) return 0
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

export function filterAndSortItems(items, { query = '', filters, sort }) {
  const normalizedQuery = query.trim().toLowerCase()
  const selectedRange = priceRanges.find((range) => range.id === filters.priceRange)

  let results = items.filter((item) => {
    if (normalizedQuery) {
      const haystack = `${item.title} ${item.category} ${item.description}`.toLowerCase()
      if (!haystack.includes(normalizedQuery)) return false
    }

    if (filters.category && item.category !== filters.category) return false
    if (filters.city && item.city !== filters.city) return false
    if (selectedRange) {
      if (item.pricePerDay < selectedRange.min || item.pricePerDay > selectedRange.max) {
        return false
      }
    }
    if (filters.rating && item.rating < Number(filters.rating)) return false
    if (filters.availableOnly && !item.available) return false

    return true
  })

  switch (sort) {
    case 'price-asc':
      results = [...results].sort((a, b) => a.pricePerDay - b.pricePerDay)
      break
    case 'price-desc':
      results = [...results].sort((a, b) => b.pricePerDay - a.pricePerDay)
      break
    case 'rating':
      results = [...results].sort((a, b) => b.rating - a.rating)
      break
    case 'distance':
      results = [...results].sort((a, b) => a.distanceKm - b.distanceKm)
      break
    default:
      results = [...results].sort((a, b) => {
        if (a.available !== b.available) return a.available ? -1 : 1
        return b.rating - a.rating
      })
  }

  return results
}

export function getActiveFilterChips(filters) {
  const chips = []
  if (filters.category) chips.push({ key: 'category', label: filters.category })
  if (filters.city) chips.push({ key: 'city', label: filters.city })
  if (filters.priceRange) {
    const range = priceRanges.find((entry) => entry.id === filters.priceRange)
    if (range) chips.push({ key: 'priceRange', label: range.label })
  }
  if (filters.rating) chips.push({ key: 'rating', label: `${filters.rating}+` })
  if (filters.availableOnly) {
    chips.push({ key: 'availableOnly', label: 'Available only' })
  }
  return chips
}
