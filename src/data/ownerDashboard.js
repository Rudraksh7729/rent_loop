import { getItemById } from './items'

export const ownerStats = {
  activeListings: 4,
  currentRentals: 2,
  pendingRequests: 3,
  demoEarnings: 18450,
}

export const ownerListings = [
  {
    itemId: 'epson-eb-x06',
    status: 'Listed',
    available: true,
  },
  {
    itemId: 'lg-ultragear-monitor',
    status: 'Listed',
    available: true,
  },
  {
    itemId: 'party-led-lights',
    status: 'Paused',
    available: false,
  },
  {
    itemId: 'karcher-washer',
    status: 'Listed',
    available: true,
  },
].map((entry) => {
  const item = getItemById(entry.itemId)
  return {
    id: entry.itemId,
    title: item.title,
    image: item.images[0],
    pricePerDay: item.pricePerDay,
    category: item.category,
    status: entry.status,
    available: entry.available,
  }
})

export const rentalRequests = [
  {
    id: 'req-1',
    renterName: 'Ananya Gill',
    itemTitle: 'Epson EB-X06 Projector',
    startDate: '2026-08-18',
    endDate: '2026-08-20',
    amount: 900,
    status: 'Pending',
  },
  {
    id: 'req-2',
    renterName: 'Ishaan Verma',
    itemTitle: 'LG UltraGear 27" Gaming Monitor',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    amount: 1000,
    status: 'Approved',
  },
  {
    id: 'req-3',
    renterName: 'Meera Joshi',
    itemTitle: 'Kärcher Pressure Washer',
    startDate: '2026-08-01',
    endDate: '2026-08-02',
    amount: 400,
    status: 'Completed',
  },
]

export const earningsBreakdown = [
  { label: 'May', amount: 3200 },
  { label: 'Jun', amount: 4100 },
  { label: 'Jul', amount: 5250 },
  { label: 'Aug', amount: 5900 },
]
