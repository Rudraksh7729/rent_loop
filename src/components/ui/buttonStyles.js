const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-[color,background-color,border-color,transform] duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary:
    'bg-surface text-ink border border-line hover:border-brand hover:text-brand',
  ghost: 'bg-transparent text-ink hover:bg-brand-light hover:text-brand',
  accent: 'bg-accent text-white hover:brightness-95',
  danger:
    'bg-danger-bg text-danger-fg border border-danger-fg/15 hover:bg-danger-fg hover:text-white',
}

const sizes = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function buttonClasses(variant = 'primary', size = 'md', className = '') {
  return `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`.trim()
}
