import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import DemoLogin from '../components/auth/DemoLogin'
import RoleSelector from '../components/auth/RoleSelector'
import FormField from '../components/ui/FormField'
import InlineAlert from '../components/ui/InlineAlert'
import Button from '../components/ui/Button'
import { RedirectIfAuthenticated } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { getDashboardPath } from '../data/demoUsers'

function resolvePostLoginPath(user, from) {
  if (!from || typeof from !== 'string') return getDashboardPath(user.role)
  if (from.startsWith('/owner') && user.role !== 'owner') return getDashboardPath(user.role)
  if (from.startsWith('/renter') && user.role !== 'renter') return getDashboardPath(user.role)
  if (from.startsWith('/book') && user.role !== 'renter') return getDashboardPath(user.role)
  return from
}

function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginAsDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [needsRole, setNeedsRole] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function finish(result) {
    if (!result.ok) {
      setError(result.error || 'Unable to continue.')
      setNeedsRole(Boolean(result.needsRole))
      setBusy(false)
      return
    }
    setBusy(false)
    navigate(resolvePostLoginPath(result.user, location.state?.from))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    window.setTimeout(() => {
      finish(login({ email, password, role: role || undefined }))
    }, 350)
  }

  function handleDemo(demoRole) {
    setError('')
    setBusy(true)
    window.setTimeout(() => {
      finish(loginAsDemo(demoRole))
    }, 250)
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue your RentLoop journey."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand hover:text-brand-dark">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <InlineAlert>{error}</InlineAlert>
        <FormField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@example.test"
        />
        <FormField
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Demo password"
        />

        {needsRole ? (
          <RoleSelector value={role} onChange={setRole} />
        ) : null}

        <Button type="submit" className="w-full" size="lg" disabled={busy}>
          {busy ? 'Signing in…' : 'Log In'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-ink-soft">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <DemoLogin onDemoLogin={handleDemo} busy={busy} />
    </AuthLayout>
  )
}

export default function LoginPage() {
  return (
    <RedirectIfAuthenticated>
      <LoginForm />
    </RedirectIfAuthenticated>
  )
}
