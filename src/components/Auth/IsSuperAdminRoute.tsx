import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { USER_ROLE } from '@/types'
import { useUser } from '@/hooks/useMe'
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated'

interface SuperAdminRouteProps {
  children: React.ReactNode
}

const IsSuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { data: authData, isLoading: isAuthLoading } = useIsAuthenticated()
  const { data: userData, isLoading: isUserLoading } = useUser()

  const isAuthenticated = authData ? authData.data.data?.isAuthenticated : false
  const user = userData ? userData.data.data : null
  const location = useLocation()

  if (isUserLoading || isAuthLoading) {
    return <div>Chargement...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user && user?.role !== USER_ROLE.SUPER_ADMIN) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default IsSuperAdminRoute
