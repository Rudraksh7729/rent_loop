import { Navigate } from 'react-router-dom'
import { RequireAuth } from '../components/auth/ProtectedRoute'
import { useAuth } from '../hooks/useAuth'
import { getDashboardPath } from '../data/demoUsers'

function DashboardRedirectInner() {
  const { user } = useAuth()

  if (!user?.role) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getDashboardPath(user.role)} replace />
}

export default function DashboardRedirect() {
  return (
    <RequireAuth>
      <DashboardRedirectInner />
    </RequireAuth>
  )
}
