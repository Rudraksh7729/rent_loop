import ImageWithFallback from '../ui/ImageWithFallback'

export default function ProfileHeader({ user }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
      <div className="h-28 bg-gradient-to-r from-brand to-brand-dark sm:h-32" />
      <div className="relative px-5 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <ImageWithFallback
              src={user.avatar}
              alt={`${user.name} avatar`}
              className="h-24 w-24 rounded-2xl border-4 border-surface shadow-soft sm:h-28 sm:w-28"
              imgClassName="rounded-xl object-cover"
            />
            <div className="pb-1">
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {user.name}
              </h1>
              <p className="mt-1 text-sm text-ink-soft">{user.email}</p>
            </div>
          </div>
          <span className="status-badge status-published inline-flex w-fit uppercase tracking-[0.12em]">
            {user.role}
          </span>
        </div>
      </div>
    </section>
  )
}
