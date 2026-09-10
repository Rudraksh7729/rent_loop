import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../layout/Navbar'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-svh bg-sand">
      <Navbar variant="solid" />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(26,107,92,0.07),_transparent_55%)]"
        aria-hidden="true"
      />
      <main className="container-rl relative flex justify-center pb-16 pt-24 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-lift sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              RentLoop
            </p>
            <h1 className="page-title mt-2">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
              {subtitle}
            </p>
            <div className="mt-6">{children}</div>
            {footer ? <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div> : null}
          </div>
          <p className="mt-4 text-center text-xs text-ink-soft">
            Demo mode — no real account is created.{' '}
            <Link to="/" className="font-semibold text-brand hover:text-brand-dark">
              Back home
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
