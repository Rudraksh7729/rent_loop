import { motion } from 'framer-motion'
import { BadgeCheck, MessageSquareText, ShieldCheck, Star } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

const trustPoints = [
  {
    id: 'profiles',
    title: 'Clear owner profiles',
    description: 'See who you are renting from before you book.',
    icon: BadgeCheck,
  },
  {
    id: 'ratings',
    title: 'Visible ratings',
    description: 'Ratings and review counts help renters compare items at a glance.',
    icon: Star,
  },
  {
    id: 'communication',
    title: 'Direct coordination',
    description: 'Owners and renters align on pickup, return, and condition.',
    icon: MessageSquareText,
  },
  {
    id: 'safety',
    title: 'Trust-first design',
    description: 'Availability, distance, and pricing stay transparent—no gimmicks.',
    icon: ShieldCheck,
  },
]

export default function TrustSection() {
  return (
    <section id="trust" className="section-pad bg-sand">
      <div className="container-rl">
        <SectionHeading
          eyebrow="Trust"
          title="Renting works when people feel safe."
          description="RentLoop is designed around transparency—who owns the item, how far it is, what it costs per day, and how others rated past rentals."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point, index) => {
            const Icon = point.icon
            return (
              <motion.article
                key={point.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-2xl border border-line bg-surface p-6 shadow-soft"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {point.description}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
