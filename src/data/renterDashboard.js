import { items, getItemById } from './items'

function withItem(itemId, extra) {
  const item = getItemById(itemId)
  return {
    id: `${itemId}-${extra.status}`,
    itemId,
    title: item.title,
    image: item.images[0],
    pricePerDay: item.pricePerDay,
    owner: item.owner.name,
    ...extra,
  }
}

export const renterStats = {
  activeRentals: 1,
  upcoming: 2,
  completed: 5,
  savedItems: 4,
}

export const activeRentals = [
  withItem('sony-alpha-a7iii', {
    startDate: '2026-08-12',
    endDate: '2026-08-16',
    total: 3200,
    status: 'Active',
  }),
]

export const upcomingRentals = [
  withItem('quechua-tent-3', {
    startDate: '2026-08-22',
    endDate: '2026-08-24',
    total: 560,
    status: 'Upcoming',
  }),
  withItem('jbl-partybox-310', {
    startDate: '2026-08-28',
    endDate: '2026-08-29',
    total: 600,
    status: 'Upcoming',
  }),
]

export const savedItemIds = [
  'gopro-hero11',
  'trek-marlin-7',
  'bosch-drill-kit',
  'playstation-5',
]

export function getSavedItems() {
  return savedItemIds.map((id) => items.find((item) => item.id === id)).filter(Boolean)
}

export function getRecommendedItems() {
  return items.filter((item) => item.featured).slice(0, 4)
}
