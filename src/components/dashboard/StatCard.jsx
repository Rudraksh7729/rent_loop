export default function StatCard({ label, value, hint }) {
  return (
    <article className="rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{hint}</p> : null}
    </article>
  )
}
