const stages = [
  { id: 'sent', label: 'Request Sent' },
  { id: 'response', label: 'Owner Response' },
  { id: 'approved', label: 'Approved' },
  { id: 'active', label: 'Rental Active' },
  { id: 'completed', label: 'Completed' },
]

export default function RentalTimeline({ displayStatus }) {
  let current = 0
  let terminalNote = ''

  if (displayStatus === 'pending') current = 0
  else if (displayStatus === 'rejected') {
    current = 1
    terminalNote = 'Rejected'
  } else if (displayStatus === 'cancelled') {
    current = 1
    terminalNote = 'Cancelled'
  } else if (displayStatus === 'approved') current = 2
  else if (displayStatus === 'active') current = 3
  else if (displayStatus === 'completed') current = 4

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="font-display text-lg font-bold text-ink">Rental timeline</h2>
      <ol className="mt-5 space-y-0">
        {stages.map((stage, index) => {
          const reached = index <= current
          const isCurrent = index === current
          const isTerminalBranch =
            terminalNote &&
            index === 1 &&
            (displayStatus === 'rejected' || displayStatus === 'cancelled')

          return (
            <li key={stage.id} className="relative flex gap-3 pb-5 last:pb-0">
              {index < stages.length - 1 ? (
                <span
                  className={`absolute left-[9px] top-5 h-[calc(100%-8px)] w-0.5 ${
                    index < current ? 'bg-brand' : 'bg-line'
                  }`}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={`relative z-10 mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-4 ring-surface ${
                  isCurrent
                    ? 'bg-brand text-white'
                    : reached
                      ? 'bg-brand text-white'
                      : 'border border-line bg-surface text-ink-soft'
                }`}
              >
                {index + 1}
              </span>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isCurrent
                      ? 'text-brand'
                      : reached
                        ? 'text-ink'
                        : 'text-ink-soft'
                  }`}
                >
                  {isTerminalBranch ? terminalNote : stage.label}
                </p>
                {isCurrent ? (
                  <p className="mt-0.5 text-xs text-ink-soft">Current stage</p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
