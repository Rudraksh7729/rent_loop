import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProfileHeader from '../components/profile/ProfileHeader'
import FormField from '../components/ui/FormField'
import InlineAlert from '../components/ui/InlineAlert'
import Button from '../components/ui/Button'
import { RequireAuth } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { getDashboardPath } from '../data/demoUsers'

function ProfileContent() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState(() => ({
    name: user.name,
    email: user.email,
    location: user.location || '',
    notifications: Boolean(user.preferences?.notifications),
    nearbyAlerts: Boolean(user.preferences?.nearbyAlerts),
  }))

  useEffect(() => {
    if (editing) return
    setForm({
      name: user.name,
      email: user.email,
      location: user.location || '',
      notifications: Boolean(user.preferences?.notifications),
      nearbyAlerts: Boolean(user.preferences?.nearbyAlerts),
    })
  }, [user, editing])

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setMessage('Name and email are required.')
      return
    }
    const result = updateProfile({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      location: form.location.trim() || 'Chandigarh',
      preferences: {
        notifications: form.notifications,
        nearbyAlerts: form.nearbyAlerts,
      },
    })
    if (result.ok) {
      setEditing(false)
      setMessage('Demo profile updated locally.')
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-svh bg-sand">
      <Navbar variant="solid" />
      <main className="container-rl space-y-6 pb-16 pt-24 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to={getDashboardPath(user.role)} className="back-link">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to dashboard
            </Link>
            <p className="text-xs text-ink-soft">
              Demo profile — saved in this browser only.
            </p>
          </div>

          <ProfileHeader user={user} />

          {message ? (
            <InlineAlert tone={message.includes('required') ? 'error' : 'success'}>
              {message}
            </InlineAlert>
          ) : null}

          <form
            onSubmit={handleSave}
            className="grid gap-5 lg:grid-cols-2"
          >
            <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold text-ink">
                  Personal Information
                </h2>
                {!editing ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditing(true)
                      setMessage('')
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : null}
              </div>

              <div className="mt-5 space-y-4">
                <FormField
                  id="profile-name"
                  label="Full name"
                  value={form.name}
                  onChange={(event) => update('name', event.target.value)}
                  disabled={!editing}
                />
                <FormField
                  id="profile-email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  disabled={!editing}
                />
                <FormField
                  id="profile-location"
                  label="Location"
                  value={form.location}
                  onChange={(event) => update('location', event.target.value)}
                  disabled={!editing}
                />
                <div className="grid grid-cols-2 gap-3 text-sm text-ink-soft">
                  <p>
                    Member since{' '}
                    <span className="font-semibold text-ink">{user.memberSince}</span>
                  </p>
                  <p>
                    Rating{' '}
                    <span className="font-semibold text-ink">{user.rating}</span>
                  </p>
                </div>
              </div>
            </section>

            <div className="space-y-5">
              <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <h2 className="font-display text-xl font-bold text-ink">Account Role</h2>
                <p className="mt-3 text-sm text-ink-soft">
                  You are signed in as a demo{' '}
                  <span className="font-semibold capitalize text-ink">{user.role}</span>.
                  Role switching is not available in this phase.
                </p>
              </section>

              <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <h2 className="font-display text-xl font-bold text-ink">Preferences</h2>
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={form.notifications}
                      disabled={!editing}
                      onChange={(event) => update('notifications', event.target.checked)}
                      className="h-4 w-4 accent-brand"
                    />
                    Email-style demo notifications
                  </label>
                  <label className="flex items-center gap-3 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={form.nearbyAlerts}
                      disabled={!editing}
                      onChange={(event) => update('nearbyAlerts', event.target.checked)}
                      className="h-4 w-4 accent-brand"
                    />
                    Nearby item alerts
                  </label>
                </div>
              </section>

              {editing ? (
                <div className="flex flex-wrap gap-3">
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditing(false)
                      setForm({
                        name: user.name,
                        email: user.email,
                        location: user.location || '',
                        notifications: Boolean(user.preferences?.notifications),
                        nearbyAlerts: Boolean(user.preferences?.nearbyAlerts),
                      })
                      setMessage('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="secondary" onClick={handleLogout}>
                  Log out
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  )
}
