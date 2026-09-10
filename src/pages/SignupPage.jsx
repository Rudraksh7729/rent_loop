import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import RoleSelector from '../components/auth/RoleSelector'
import FormField from '../components/ui/FormField'
import InlineAlert from '../components/ui/InlineAlert'
import Button from '../components/ui/Button'
import { RedirectIfAuthenticated } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'

function SignupForm() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Full name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email.'
    }
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 6) next.password = 'Use at least 6 characters.'
    if (!form.confirmPassword) next.confirmPassword = 'Confirm your password.'
    else if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'Passwords do not match.'
    }
    if (!form.role) next.role = 'Select a role to continue.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setBusy(true)
    window.setTimeout(() => {
      const result = signup(form)
      setBusy(false)
      if (!result.ok) {
        setError(result.error)
        return
      }
      navigate(result.redirectTo)
    }, 400)
  }

  return (
    <AuthLayout
      title="Create your RentLoop account"
      subtitle="Rent what you need. Share what you don't."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <InlineAlert>{error}</InlineAlert>
        <FormField
          id="signup-name"
          label="Full Name"
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          autoComplete="name"
          error={fieldErrors.name}
        />
        <FormField
          id="signup-email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          autoComplete="email"
          error={fieldErrors.email}
        />
        <FormField
          id="signup-password"
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
          autoComplete="new-password"
          error={fieldErrors.password}
        />
        <FormField
          id="signup-confirm"
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(event) => update('confirmPassword', event.target.value)}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />
        <RoleSelector
          value={form.role}
          onChange={(role) => update('role', role)}
          error={fieldErrors.role}
        />
        <Button type="submit" className="w-full" size="lg" disabled={busy}>
          {busy ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default function SignupPage() {
  return (
    <RedirectIfAuthenticated>
      <SignupForm />
    </RedirectIfAuthenticated>
  )
}
