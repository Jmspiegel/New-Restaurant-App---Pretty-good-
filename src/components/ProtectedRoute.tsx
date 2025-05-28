import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: string[]
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If roles are specified, check if user has required role
  if (roles && user.role && !roles.includes(user.role)) {
    return <Navigate to="/menu" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
