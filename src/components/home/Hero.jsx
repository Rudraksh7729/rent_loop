import { motion } from 'framer-motion'
import SearchBar from '../ui/SearchBar'
import ImageWithFallback from '../ui/ImageWithFallback'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1800&q=80'

export default function Hero({ onSearch }) {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-white"
    >
      <ImageWithFallback
        src={HERO_IMAGE}
        alt="Camping gear ready to share—tents and outdoor equipment in nature"
        className="absolute inset-0 h-full w-full"
        imgClassName="h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/35"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/30"
        aria-hidden="true"
      />

      <div className="container-rl relative flex min-h-[100svh] flex-col justify-end pb-16 pt-28 sm:justify-center sm:pb-20 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Rent<span className="text-brand-mint">Loop</span>
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]">
            Don&apos;t Buy It. Rent It.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Rent useful items from people nearby—or earn from gear you already
            own. Built for students and local everyday needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="mt-8 w-full max-w-3xl"
        >
          <SearchBar onSearch={onSearch} />
          <p className="mt-3 text-sm text-white/65">
            Search opens the nearby marketplace with demo listings.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
