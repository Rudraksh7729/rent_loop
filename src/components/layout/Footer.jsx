import { Link } from 'react-router-dom'

const footerLinks = [
  { to: '/explore', label: 'Explore marketplace' },
  { to: '/#categories', label: 'Categories' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#trust', label: 'Trust & safety' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-sand">
      <div className="container-rl grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
            Rent<span className="text-brand-light">Loop</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-sand/75">
            Don&apos;t Buy It. Rent It. A local marketplace where unused things
            earn and everyday needs get covered nearby.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-sand/60">
            Explore
          </h2>
          <ul className="mt-4 space-y-2">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-sand/85 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-sand/60">
            Demo note
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-sand/75">
            Marketplace browsing uses local demo data. Booking and payments will
            connect to real APIs in a later phase.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-rl flex flex-col gap-2 py-5 text-xs text-sand/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RentLoop · College BEE project demo</p>
          <p>Built for local sharing, not cluttered commerce.</p>
        </div>
      </div>
    </footer>
  )
}
