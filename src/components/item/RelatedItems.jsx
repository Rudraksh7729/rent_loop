import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ItemCard from '../ui/ItemCard'

export default function RelatedItems({ items }) {
  if (!items?.length) return null

  return (
    <section className="section-pad border-t border-line bg-sand">
      <div className="container-rl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            You might also like
          </h2>
          <Link
            to="/explore"
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            Browse all items →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
