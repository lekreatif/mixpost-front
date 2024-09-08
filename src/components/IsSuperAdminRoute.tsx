import React, { useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { USER_ROLE } from '../types'
import { useMe } from '@/hooks/useApi'

interface AdminRouteProps {
  children: React.ReactNode
}

const IsSuperAdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const user = useMe().data

  const isSuperAdmin = useMemo(
    () => user && user.role === USER_ROLE.SUPER_ADMIN,
    [user]
  )

  if (!isSuperAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default IsSuperAdminRoute
