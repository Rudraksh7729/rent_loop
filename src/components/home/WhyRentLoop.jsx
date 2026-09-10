import { motion } from 'framer-motion'
import { MapPinned, Recycle, Wallet, Clock3 } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

const reasons = [
  {
    id: 'local',
    title: 'Truly local',
    description:
      'Discover useful items a few kilometres away—not shipped from a warehouse.',
    icon: MapPinned,
  },
  {
    id: 'smart',
    title: 'Smarter than buying',
    description:
      'Pay only for the days you need a camera, projector, or power tool.',
    icon: Wallet,
  },
  {
    id: 'unused',
    title: 'Idle things earn',
    description:
      'Owners list gear they barely use and turn it into quiet extra income.',
    icon: Recycle,
  },
  {
    id: 'convenient',
    title: 'Built for short rentals',
    description:
      'Clear daily pricing, availability, and return timing at the centre of the experience.',
    icon: Clock3,
  },
]

export default function WhyRentLoop() {
  return (
    <section id="why-rentloop" className="section-pad bg-surface">
      <div className="container-rl">
        <SectionHeading
          eyebrow="Why RentLoop"
          title="A marketplace for borrowing, not clutter."
          description="RentLoop is community-driven rental—nearby, trustworthy, and designed around duration instead of checkout carts."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <motion.article
                key={reason.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-2xl border border-line bg-sand/60 p-6"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-ink">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {reason.description}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
