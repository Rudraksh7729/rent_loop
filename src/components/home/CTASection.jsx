import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function CTASection() {
  return (
    <section id="cta" className="section-pad bg-surface">
      <div className="container-rl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-2xl bg-brand px-6 py-12 text-white shadow-lift sm:px-10 sm:py-14"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to stop buying things you barely need?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
              Browse nearby gear now. Listing accounts and payments will connect
              in a later phase.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                to="/explore"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-brand hover:bg-brand-light hover:text-brand-dark"
              >
                Browse nearby items
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="border border-white/30 text-white hover:bg-white/10 hover:text-white"
                onClick={() => {
                  document
                    .getElementById('how-it-works')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                See how listing works
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
