import { useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import Button from './Button'

export default function SearchBar({ className = '', onSearch }) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Chandigarh')

  function handleSubmit(event) {
    event.preventDefault()
    onSearch?.({ query: query.trim(), location: location.trim() })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-2 rounded-2xl border border-line bg-surface p-2 shadow-lift sm:flex-row sm:items-center ${className}`}
      role="search"
      aria-label="Search rental items nearby"
    >
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-3 transition-colors focus-within:bg-brand-light/40">
        <Search className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <span className="sr-only">What do you need?</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Camera, tent, drill…"
          className="w-full min-w-0 border-0 bg-transparent text-ink placeholder:text-ink-soft/70 focus:outline-none"
        />
      </label>

      <div className="hidden h-8 w-px bg-line sm:block" aria-hidden="true" />

      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-3 transition-colors focus-within:bg-brand-light/40 sm:max-w-[220px]">
        <MapPin className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <span className="sr-only">Near location</span>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Near you"
          className="w-full min-w-0 border-0 bg-transparent text-ink placeholder:text-ink-soft/70 focus:outline-none"
        />
      </label>

      <Button type="submit" size="lg" className="w-full sm:w-auto sm:shrink-0">
        Search nearby
      </Button>
    </form>
  )
}
