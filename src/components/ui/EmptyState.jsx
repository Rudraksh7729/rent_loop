import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import Button from './Button'
import { buttonClasses } from './buttonStyles'

export default function EmptyState({
  icon = SearchX,
  title = 'No items found',
  description = 'Try changing your filters or searching for something else.',
  actionLabel,
  onAction,
  actionTo,
  className = '',
}) {
  const Icon = icon

  return (
    <div
      className={`flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center sm:py-16 ${className}`}
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-2xl font-bold text-ink">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
      {actionTo && actionLabel ? (
        <Link to={actionTo} className={`mt-6 ${buttonClasses()}`}>
          {actionLabel}
        </Link>
      ) : null}
      {onAction && actionLabel && !actionTo ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
