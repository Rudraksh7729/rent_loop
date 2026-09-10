import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../../data/categories'
import SectionHeading from '../ui/SectionHeading'
import ImageWithFallback from '../ui/ImageWithFallback'

export default function Categories() {
  return (
    <section id="categories" className="section-pad bg-sand">
      <div className="container-rl">
        <SectionHeading
          eyebrow="Categories"
          title="What do people rent nearby?"
          description="Everyday useful items—borrowed from your neighbourhood instead of bought new."
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <Link
                to={`/explore?category=${encodeURIComponent(category.filterCategory)}`}
                className="group block overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-shadow duration-200 hover:shadow-lift focus-visible:outline-offset-4"
              >
                <ImageWithFallback
                  src={category.image}
                  alt={`${category.name} for rent`}
                  className="aspect-[4/3]"
                  imgClassName="transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div className="p-3 sm:p-3.5">
                  <h3 className="font-display text-sm font-bold text-ink sm:text-base">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 hidden text-xs text-ink-soft sm:block">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
