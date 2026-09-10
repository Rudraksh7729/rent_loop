import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardPath } from '../../data/demoUsers'

export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  return children
}

export function RequireRole({ role, children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  if (user.role !== role) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return children
}

export function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user?.role) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return children
}
