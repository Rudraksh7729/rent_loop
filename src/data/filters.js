export const filterCategories = [
  'Electronics',
  'Tools',
  'Sports',
  'Travel',
  'Events',
  'Photography',
  'Other',
]

export const demoCities = ['Chandigarh', 'Mohali', 'Panchkula']

export const priceRanges = [
  { id: 'under-300', label: 'Under ₹300/day', min: 0, max: 299 },
  { id: '300-500', label: '₹300–₹500/day', min: 300, max: 500 },
  { id: '500-1000', label: '₹500–₹1000/day', min: 501, max: 1000 },
  { id: '1000-plus', label: '₹1000+/day', min: 1001, max: Infinity },
]

export const ratingFilters = [
  { id: '4.5', label: '4.5+', value: 4.5 },
  { id: '4.0', label: '4.0+', value: 4.0 },
  { id: '3.5', label: '3.5+', value: 3.5 },
]

export const sortOptions = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Rating' },
  { id: 'distance', label: 'Distance' },
]

export const defaultFilters = {
  category: '',
  city: '',
  priceRange: '',
  rating: '',
  availableOnly: false,
}
