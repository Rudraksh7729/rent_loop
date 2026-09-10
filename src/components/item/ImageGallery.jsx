import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ImageWithFallback from '../ui/ImageWithFallback'

export default function ImageGallery({ images = [], title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const safeImages = images.length > 0 ? images : ['']
  const activeImage = safeImages[Math.min(activeIndex, safeImages.length - 1)]

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-brand-light sm:aspect-[5/4]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage || activeIndex}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={activeImage}
              alt={`${title} photo ${activeIndex + 1}`}
              className="h-full w-full"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {safeImages.length > 1 ? (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:h-20 sm:w-24 ${
                index === activeIndex
                  ? 'border-brand'
                  : 'border-transparent hover:border-line'
              }`}
            >
              <ImageWithFallback
                src={image}
                alt=""
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
