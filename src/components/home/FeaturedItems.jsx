import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { featuredItems } from '../../data/featuredItems'
import SectionHeading from '../ui/SectionHeading'
import ItemCard from '../ui/ItemCard'

export default function FeaturedItems() {
  return (
    <section id="featured" className="section-pad bg-surface">
      <div className="container-rl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Nearby demo listings"
            title="Featured items around Chandigarh"
            description="Realistic sample listings showing price per day, distance, owner, and availability."
          />
          <Link
            to="/explore"
            className="text-sm font-semibold text-brand hover:text-brand-dark sm:text-right"
          >
            Explore all items →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
