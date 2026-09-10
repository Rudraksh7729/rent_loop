import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Search } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FilterPanel from '../components/marketplace/FilterPanel'
import FilterDrawer from '../components/marketplace/FilterDrawer'
import ResultsHeader from '../components/marketplace/ResultsHeader'
import EmptyState from '../components/marketplace/EmptyState'
import ItemCard from '../components/ui/ItemCard'
import Button from '../components/ui/Button'
import { defaultFilters } from '../data/filters'
import {
  filterAndSortItems,
  getActiveFilterChips,
} from '../data/marketplaceUtils'
import { getMarketplaceCatalog } from '../data/listingUtils'
import { useListings } from '../hooks/useListings'

function filtersFromParams(params) {
  return {
    category: params.get('category') || '',
    city: params.get('city') || '',
    priceRange: params.get('price') || '',
    rating: params.get('rating') || '',
    availableOnly: params.get('available') === '1',
  }
}

export default function ExplorePage() {
  const { listings } = useListings()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams))
  const [sort, setSort] = useState(searchParams.get('sort') || 'recommended')
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
    setFilters(filtersFromParams(searchParams))
    setSort(searchParams.get('sort') || 'recommended')
  }, [searchParams])

  const catalog = useMemo(() => getMarketplaceCatalog(listings), [listings])

  const results = useMemo(
    () => filterAndSortItems(catalog, { query, filters, sort }),
    [catalog, query, filters, sort],
  )

  const chips = useMemo(() => getActiveFilterChips(filters), [filters])

  function syncParams(nextQuery, nextFilters, nextSort) {
    const params = new URLSearchParams()
    if (nextQuery.trim()) params.set('q', nextQuery.trim())
    if (nextFilters.category) params.set('category', nextFilters.category)
    if (nextFilters.city) params.set('city', nextFilters.city)
    if (nextFilters.priceRange) params.set('price', nextFilters.priceRange)
    if (nextFilters.rating) params.set('rating', nextFilters.rating)
    if (nextFilters.availableOnly) params.set('available', '1')
    if (nextSort && nextSort !== 'recommended') params.set('sort', nextSort)
    setSearchParams(params, { replace: true })
  }

  function handleFiltersChange(nextFilters) {
    setFilters(nextFilters)
    syncParams(query, nextFilters, sort)
  }

  function handleClearFilters() {
    setFilters(defaultFilters)
    setQuery('')
    setSort('recommended')
    setSearchParams({}, { replace: true })
  }

  function handleRemoveChip(key) {
    const nextFilters = {
      ...filters,
      [key]: key === 'availableOnly' ? false : '',
    }
    handleFiltersChange(nextFilters)
  }

  function handleQueryChange(value) {
    setQuery(value)
    syncParams(value, filters, sort)
  }

  function handleSortChange(value) {
    setSort(value)
    syncParams(query, filters, value)
  }

  return (
    <div className="min-h-svh bg-sand">
      <Navbar variant="solid" />
      <main className="pb-16 pt-24 sm:pt-28">
        <div className="container-rl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              Explore
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
              Find what you need nearby.
            </h1>
            <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
              Explore useful things available for rent from people around you.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            role="search"
            aria-label="Search marketplace items"
            onSubmit={(event) => event.preventDefault()}
            className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-2 shadow-soft sm:flex-row sm:items-center"
          >
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-3 transition-colors focus-within:bg-brand-light/40">
              <Search className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
              <span className="sr-only">Search cameras, bikes, tools</span>
              <input
                type="search"
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder="Search cameras, bikes, tools..."
                className="w-full min-w-0 border-0 bg-transparent text-ink placeholder:text-ink-soft/70 focus:outline-none"
              />
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <Filter className="h-4 w-4" aria-hidden="true" />
                Filters
              </Button>
            </div>
          </motion.form>

          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <FilterPanel
                  filters={filters}
                  onChange={handleFiltersChange}
                  onClear={handleClearFilters}
                />
              </div>
            </div>

            <div className="min-w-0 space-y-6">
              <ResultsHeader
                count={results.length}
                chips={chips}
                sort={sort}
                onSortChange={handleSortChange}
                onRemoveChip={handleRemoveChip}
                onClear={handleClearFilters}
              />

              {results.length === 0 ? (
                <EmptyState onClear={handleClearFilters} />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: Math.min(index * 0.03, 0.24) }}
                    >
                      <ItemCard item={item} />
                    </motion.div>
                  ))}
                </div>
              )}

              <p className="text-center text-sm text-ink-soft">
                Looking for something else?{' '}
                <Link to="/" className="font-semibold text-brand hover:text-brand-dark">
                  Back to home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={handleFiltersChange}
        onClear={handleClearFilters}
      />
      <Footer />
    </div>
  )
}
