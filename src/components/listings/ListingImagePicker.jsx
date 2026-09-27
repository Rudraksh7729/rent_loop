import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Star, X } from 'lucide-react'
import ImageWithFallback from '../ui/ImageWithFallback'
import Button from '../ui/Button'
import { DEMO_LISTING_IMAGES } from '../../data/demoListingImages'

const MAX_IMAGES = 5
const MAX_FILE_BYTES = 1.5 * 1024 * 1024
const MAX_TOTAL_DATA_BYTES = 5 * 1024 * 1024

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read image.'))
    reader.readAsDataURL(file)
  })
}

export default function ListingImagePicker({ images, onChange, error }) {
  const inputRef = useRef(null)
  const [localError, setLocalError] = useState('')

  async function handleFiles(fileList) {
    setLocalError('')
    const files = Array.from(fileList || [])
    if (!files.length) return

    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) {
      setLocalError(`You can add up to ${MAX_IMAGES} photos.`)
      return
    }

    const selected = files.slice(0, remaining)
    const nextImages = [...images]
    let totalBytes = nextImages.reduce((total, src) => total + src.length, 0)

    for (const file of selected) {
      if (!file.type.startsWith('image/')) {
        setLocalError('Only image files are supported.')
        continue
      }
      if (file.size > MAX_FILE_BYTES) {
        setLocalError('Each image should be under 1.5 MB for this demo.')
        continue
      }
      try {
        const dataUrl = await readFileAsDataUrl(file)
        if (dataUrl) {
          if (totalBytes + dataUrl.length > MAX_TOTAL_DATA_BYTES) {
            setLocalError('Keep all listing photos under 5 MB total for this demo.')
            continue
          }
          nextImages.push(dataUrl)
          totalBytes += dataUrl.length
        }
      } catch {
        setLocalError('Could not read one of the selected images.')
      }
    }

    onChange(nextImages.slice(0, MAX_IMAGES))
  }

  function removeAt(index) {
    onChange(images.filter((_, i) => i !== index))
  }

  function makePrimary(index) {
    if (index === 0) return
    const next = [...images]
    const [picked] = next.splice(index, 1)
    next.unshift(picked)
    onChange(next)
  }

  function addDemoImage() {
    const unused = DEMO_LISTING_IMAGES.find((src) => !images.includes(src))
    if (!unused) {
      setLocalError('All demo photos are already added.')
      return
    }
    if (images.length >= MAX_IMAGES) {
      setLocalError(`You can add up to ${MAX_IMAGES} photos.`)
      return
    }
    onChange([...images, unused])
    setLocalError('')
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ink">Add photos</p>
          <p className="text-xs text-ink-soft">
            Add up to {MAX_IMAGES} photos. Local files are stored as demo data in this browser.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={addDemoImage}>
            Use demo photo
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES}
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            Choose files
          </Button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
        aria-label="Upload listing photos"
      />

      {images[0] ? (
        <ImageWithFallback
          src={images[0]}
          alt="Primary listing photo"
          className="aspect-[16/10] rounded-2xl border border-line"
        />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-sand/50 text-ink-soft hover:border-brand hover:text-brand"
        >
          <ImagePlus className="h-7 w-7" aria-hidden="true" />
          <span className="text-sm font-medium">Add a primary photo</span>
        </button>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        <AnimatePresence initial={false}>
          {images.map((src, index) => (
            <motion.div
              key={`${src.slice(0, 40)}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-line"
            >
              <ImageWithFallback src={src} alt="" className="h-full w-full" />
              {index === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Primary
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makePrimary(index)}
                  className="absolute left-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface/95 text-brand"
                  aria-label={`Make photo ${index + 1} primary`}
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-white"
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {(error || localError) && (
        <p className="text-sm text-accent" role="alert">
          {error || localError}
        </p>
      )}
    </div>
  )
}
