import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Button from '../ui/Button'
import ImageWithFallback from '../ui/ImageWithFallback'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardPath } from '../../data/demoUsers'

const landingLinks = [
  { to: '/explore', label: 'Explore' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#why-rentloop', label: 'Why RentLoop' },
  { to: '/#featured', label: 'Nearby items' },
]

const appLinks = [
  { to: '/explore', label: 'Explore' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#why-rentloop', label: 'Why RentLoop' },
]

export default function Navbar({ variant = 'auto' }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const isLanding = location.pathname === '/'
  const links = isLanding ? landingLinks : appLinks
  const solid = variant === 'solid' || scrolled || open || !isLanding

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return
    const id = location.hash.replace('#', '')
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
    return () => window.clearTimeout(timer)
  }, [location.pathname, location.hash])

  function handleNavClick() {
    setOpen(false)
  }

  function handleLogout() {
    handleNavClick()
    logout()
    navigate('/')
  }

  const ghostClass = solid ? '' : 'text-white hover:bg-white/10 hover:text-white'
  const primaryClass = solid
    ? ''
    : 'bg-white text-brand hover:bg-brand-light hover:text-brand-dark'
  const secondaryOnHero = solid
    ? ''
    : 'border-white/35 bg-transparent text-white hover:border-white hover:bg-white/10 hover:text-white'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? 'border-b border-line/80 bg-sand/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-rl flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
        <Link
          to="/"
          className={`font-display text-xl font-extrabold tracking-tight sm:text-2xl ${
            solid ? 'text-ink' : 'text-white'
          }`}
          onClick={handleNavClick}
        >
          Rent
          <span className={solid ? 'text-brand' : 'text-brand-mint'}>Loop</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) =>
            link.to.startsWith('/#') ? (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  solid
                    ? 'text-ink-soft hover:text-brand'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors ${
                    solid
                      ? isActive
                        ? 'text-brand'
                        : 'text-ink-soft hover:text-brand'
                      : isActive
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && solid ? (
                      <span
                        className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand"
                        aria-hidden="true"
                      />
                    ) : null}
                  </>
                )}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath(user.role)}
                className={`inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold transition-colors ${
                  solid
                    ? 'text-ink hover:bg-brand-light hover:text-brand'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <ImageWithFallback
                  src={user.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full ring-2 ring-brand/15"
                  imgClassName="rounded-full object-cover"
                />
                <span className="max-w-[8rem] truncate">{user.name.split(' ')[0]}</span>
              </Link>
              <Button
                size="sm"
                className={primaryClass}
                onClick={() => navigate(getDashboardPath(user.role))}
              >
                Dashboard
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className={secondaryOnHero}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className={ghostClass}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                size="sm"
                className={primaryClass}
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border md:hidden ${
            solid
              ? 'border-line bg-surface text-ink'
              : 'border-white/30 bg-white/10 text-white'
          }`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="border-t border-line bg-sand md:hidden"
          >
            <nav className="container-rl flex flex-col gap-1 py-4" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleNavClick}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-brand-light hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-1 pb-2">
                      <ImageWithFallback
                        src={user.avatar}
                        alt=""
                        className="h-10 w-10 rounded-full"
                        imgClassName="rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-ink">{user.name}</p>
                        <p className="text-xs capitalize text-ink-soft">{user.role}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        handleNavClick()
                        navigate(getDashboardPath(user.role))
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        handleNavClick()
                        navigate('/profile')
                      }}
                    >
                      Profile
                    </Button>
                    <Button variant="ghost" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        handleNavClick()
                        navigate('/login')
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        handleNavClick()
                        navigate('/signup')
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
