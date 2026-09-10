const AUTH_STORAGE_KEY = 'rentloop_demo_auth'

export const DEMO_ACCOUNTS = {
  renter: {
    id: 'demo-renter',
    name: 'Demo Renter',
    email: 'demo.renter@rentloop.test',
    role: 'renter',
    location: 'Chandigarh',
    memberSince: 2025,
    rating: 4.8,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    preferences: {
      notifications: true,
      nearbyAlerts: true,
    },
  },
  owner: {
    id: 'demo-owner',
    name: 'Demo Owner',
    email: 'demo.owner@rentloop.test',
    role: 'owner',
    location: 'Mohali',
    memberSince: 2024,
    rating: 4.9,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    preferences: {
      notifications: true,
      nearbyAlerts: false,
    },
  },
}

function toSafeUser(user) {
  if (!user || typeof user !== 'object') return null
  if (user.role !== 'renter' && user.role !== 'owner') return null
  if (!user.email || !user.name) return null

  return {
    id: user.id || `demo-${user.role}`,
    name: String(user.name),
    email: String(user.email).trim().toLowerCase(),
    role: user.role,
    location: user.location || 'Chandigarh',
    memberSince: user.memberSince || new Date().getFullYear(),
    rating: typeof user.rating === 'number' ? user.rating : 4.5,
    avatar: user.avatar || DEMO_ACCOUNTS[user.role].avatar,
    preferences: {
      notifications: Boolean(user.preferences?.notifications),
      nearbyAlerts: Boolean(user.preferences?.nearbyAlerts),
    },
  }
}

export function createDemoUser({ name, email, role }) {
  return toSafeUser({
    id: `demo-${role}-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    location: 'Chandigarh',
    memberSince: new Date().getFullYear(),
    rating: role === 'owner' ? 5 : 4.7,
    avatar:
      role === 'owner'
        ? DEMO_ACCOUNTS.owner.avatar
        : DEMO_ACCOUNTS.renter.avatar,
    preferences: {
      notifications: true,
      nearbyAlerts: true,
    },
  })
}

export function loadAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const safeUser = toSafeUser(parsed?.user)
    if (!safeUser) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }
    return { user: safeUser }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function saveAuthSession(session) {
  const safeUser = toSafeUser(session?.user)
  if (!safeUser) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }
  // Persist only demo profile fields — never passwords or secrets.
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: safeUser }))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getDashboardPath(role) {
  if (role === 'owner') return '/owner/dashboard'
  return '/renter/dashboard'
}
