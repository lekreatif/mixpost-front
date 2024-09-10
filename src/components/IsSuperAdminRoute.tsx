import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { USER_ROLE } from '../types'
import { useAuth } from '@/hooks/useAuth'

interface SuperAdminRouteProps {
  children: React.ReactNode
}

const IsSuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user && user.role !== USER_ROLE.SUPER_ADMIN) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default IsSuperAdminRoute
