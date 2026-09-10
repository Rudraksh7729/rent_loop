import { useState } from 'react'
import { ImageOff } from 'lucide-react'

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  imgClassName = '',
}) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-brand-light text-brand ${className}`}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <ImageOff className="h-8 w-8 opacity-60" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${imgClassName}`}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
