import { DEMO_ACCOUNTS } from '../../data/demoUsers'
import Button from '../ui/Button'

export default function DemoLogin({ onDemoLogin, busy }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand/30 bg-brand-light/60 p-4">
      <p className="text-sm font-semibold text-brand-dark">Quick demo access</p>
      <p className="mt-1 text-xs text-ink-soft">
        Use these fictional demo accounts for presentations. No real login occurs.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() => onDemoLogin('renter')}
          className="w-full"
        >
          Continue as Renter
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() => onDemoLogin('owner')}
          className="w-full"
        >
          Continue as Owner
        </Button>
      </div>
      <div className="mt-3 space-y-1 text-xs text-ink-soft">
        <p>
          Demo Renter · <span className="font-medium">{DEMO_ACCOUNTS.renter.email}</span>
        </p>
        <p>
          Demo Owner · <span className="font-medium">{DEMO_ACCOUNTS.owner.email}</span>
        </p>
      </div>
    </div>
  )
}
