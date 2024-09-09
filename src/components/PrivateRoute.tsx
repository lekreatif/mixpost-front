import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const location = useLocation()

  React.useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth()
    }
  }, [isAuthenticated, isLoading, checkAuth])

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default PrivateRoute
