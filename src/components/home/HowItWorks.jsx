import { motion } from 'framer-motion'
import { renterSteps, ownerSteps } from '../../data/howItWorks'
import SectionHeading from '../ui/SectionHeading'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad bg-sand">
      <div className="container-rl">
        <SectionHeading
          eyebrow="How it works"
          title="Rent in three steps. Earn in one."
          description="A simple loop between people who need something for a few days and people who already own it."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {renterSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-2xl border border-line bg-surface p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-ink-soft">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.description}
                </p>
              </motion.article>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-4 rounded-2xl border border-brand/20 bg-brand-light p-6 sm:flex sm:items-center sm:justify-between sm:gap-6"
        >
          {ownerSteps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">
                    For owners
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
