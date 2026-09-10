import { motion } from 'framer-motion'
import { PackagePlus, Search } from 'lucide-react'

const roles = [
  {
    id: 'renter',
    title: 'Renter',
    description: 'Find and rent useful items nearby.',
    icon: Search,
  },
  {
    id: 'owner',
    title: 'Owner',
    description: 'List your unused items and earn from them.',
    icon: PackagePlus,
  },
]

export default function RoleSelector({ value, onChange, error }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">
        How will you use RentLoop?
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {roles.map((role) => {
          const Icon = role.icon
          const selected = value === role.id
          return (
            <motion.button
              key={role.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(role.id)}
              aria-pressed={selected}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                selected
                  ? 'border-brand bg-brand-light shadow-[0_0_0_1px_rgba(26,107,92,0.25)]'
                  : 'border-line bg-sand/50 hover:border-brand/40'
              }`}
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                  selected ? 'bg-brand text-white' : 'bg-surface text-brand'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="mt-3 block font-display text-lg font-bold text-ink">
                {role.title}
              </span>
              <span className="mt-1 block text-sm text-ink-soft">
                {role.description}
              </span>
            </motion.button>
          )
        })}
      </div>
      {error ? (
        <p className="mt-2 text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
