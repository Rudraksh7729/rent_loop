import { createContext, useMemo, useState } from 'react'
import {
  DEMO_ACCOUNTS,
  clearAuthSession,
  createDemoUser,
  getDashboardPath,
  loadAuthSession,
  saveAuthSession,
} from '../data/demoUsers'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadAuthSession())

  const value = useMemo(() => {
    const user = session?.user || null
    const isAuthenticated = Boolean(user)

    function persist(nextSession) {
      setSession(nextSession)
      if (nextSession?.user) saveAuthSession(nextSession)
      else clearAuthSession()
    }

    function login({ email, password, role } = {}) {
      const normalizedEmail = String(email || '')
        .trim()
        .toLowerCase()
      if (!normalizedEmail || !password) {
        return { ok: false, error: 'Email and password are required.' }
      }

      let nextUser = null

      if (normalizedEmail === DEMO_ACCOUNTS.renter.email) {
        nextUser = { ...DEMO_ACCOUNTS.renter }
      } else if (normalizedEmail === DEMO_ACCOUNTS.owner.email) {
        nextUser = { ...DEMO_ACCOUNTS.owner }
      } else if (role !== 'renter' && role !== 'owner') {
        return {
          ok: false,
          error: 'Choose a demo role to continue, or use a demo account.',
          needsRole: true,
        }
      } else {
        nextUser = createDemoUser({
          name: normalizedEmail.split('@')[0].replace(/[._]/g, ' '),
          email: normalizedEmail,
          role,
        })
      }

      // Password is only used for form UX validation — never persisted.
      persist({ user: nextUser })
      return {
        ok: true,
        user: nextUser,
        redirectTo: getDashboardPath(nextUser.role),
      }
    }

    function signup({
      name,
      email,
      password,
      confirmPassword,
      role,
    } = {}) {
      if (!name?.trim() || !email?.trim() || !password || !confirmPassword) {
        return { ok: false, error: 'Please fill in all fields.' }
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return { ok: false, error: 'Enter a valid email address.' }
      }
      if (password.length < 6) {
        return { ok: false, error: 'Password must be at least 6 characters.' }
      }
      if (password !== confirmPassword) {
        return { ok: false, error: 'Passwords do not match.' }
      }
      if (role !== 'renter' && role !== 'owner') {
        return { ok: false, error: 'Select how you will use RentLoop.' }
      }

      // Password is validated only — never stored in demo session/localStorage.
      const nextUser = createDemoUser({ name, email, role })
      persist({ user: nextUser })
      return {
        ok: true,
        user: nextUser,
        redirectTo: getDashboardPath(role),
      }
    }

    function loginAsDemo(role) {
      if (role !== 'renter' && role !== 'owner') {
        return { ok: false, error: 'Invalid demo role.' }
      }
      const nextUser = { ...DEMO_ACCOUNTS[role] }
      persist({ user: nextUser })
      return {
        ok: true,
        user: nextUser,
        redirectTo: getDashboardPath(role),
      }
    }

    function updateProfile(updates = {}) {
      if (!user) return { ok: false, error: 'Not signed in.' }

      const { password: _ignoredPassword, ...safeUpdates } = updates
      const nextUser = {
        ...user,
        ...safeUpdates,
        role: user.role,
        preferences: {
          ...user.preferences,
          ...(safeUpdates.preferences || {}),
        },
      }

      persist({ user: nextUser })
      return { ok: true, user: nextUser }
    }

    function logout() {
      persist(null)
    }

    return {
      isAuthenticated,
      user,
      role: user?.role || null,
      login,
      signup,
      loginAsDemo,
      updateProfile,
      logout,
      getDashboardPath,
    }
  }, [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
