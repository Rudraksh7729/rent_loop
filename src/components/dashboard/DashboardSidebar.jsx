import { NavLink } from 'react-router-dom'
import {
  Bookmark,
  ClipboardList,
  Compass,
  LayoutDashboard,
  Package,
  UserRound,
  Wallet,
} from 'lucide-react'

const renterLinks = [
  { to: '/renter/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/renter/rentals', label: 'My Rentals', icon: ClipboardList },
  { to: '/renter/dashboard#saved', label: 'Saved', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/explore', label: 'Explore', icon: Compass },
]

const ownerLinks = [
  { to: '/owner/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/owner/listings', label: 'My Listings', icon: Package },
  { to: '/owner/requests', label: 'Rental Requests', icon: ClipboardList },
  { to: '/owner/dashboard#earnings', label: 'Earnings', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

function NavItems({ links, onNavigate, compact = false }) {
  return links.map((link) => {
    const Icon = link.icon
    const isHash = link.to.includes('#')
    const shortLabel =
      link.label === 'Rental Requests'
        ? 'Requests'
        : link.label === 'My Rentals'
          ? 'Rentals'
          : link.label === 'My Listings'
            ? 'Listings'
            : link.label

    if (isHash) {
      return (
        <a
          key={link.to}
          href={link.to}
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-light hover:text-brand ${
            compact ? 'flex-col justify-center gap-1 px-1 py-2 text-center' : ''
          }`}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {compact ? (
            <span className="text-[10px] font-medium leading-tight">{shortLabel}</span>
          ) : (
            <span>{link.label}</span>
          )}
        </a>
      )
    }

    return (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.end}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-brand-light text-brand'
              : 'text-ink-soft hover:bg-brand-light hover:text-brand'
          } ${compact ? 'flex-col justify-center gap-1 px-1 py-2 text-center' : ''}`
        }
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {compact ? (
          <span className="text-[10px] font-medium leading-tight">{shortLabel}</span>
        ) : (
          <span>{link.label}</span>
        )}
      </NavLink>
    )
  })
}

export default function DashboardSidebar({ role, onNavigate }) {
  const links = role === 'owner' ? ownerLinks : renterLinks

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-24 rounded-2xl border border-line bg-surface p-3 shadow-soft">
        <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
          {role === 'owner' ? 'Owner menu' : 'Renter menu'}
        </p>
        <nav className="space-y-1" aria-label="Dashboard">
          <NavItems links={links} onNavigate={onNavigate} />
        </nav>
      </div>
    </aside>
  )
}

export function DashboardMobileNav({ role }) {
  const links = role === 'owner' ? ownerLinks.slice(0, 4) : renterLinks.slice(0, 4)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-sand/95 px-2 py-1.5 backdrop-blur-md lg:hidden"
      aria-label="Dashboard mobile"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-0.5">
        <NavItems links={links} compact />
      </div>
    </nav>
  )
}
