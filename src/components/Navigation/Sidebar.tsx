import React, { MouseEvent, useMemo } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  IoSettingsOutline,
  IoShareSocialOutline,
  IoLogOutOutline,
} from 'react-icons/io5'
import { IoIosClose } from 'react-icons/io'
import { useAuth } from '@/hooks/useAuth'

import { RxDashboard } from 'react-icons/rx'
import { Button } from '@headlessui/react'
import { USER_ROLE } from '@/types'

interface SidebarProps {
  className?: string
  handleClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ className, handleClose }) => {
  const { logout, user } = useAuth()

  const handleLogout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    logout()
  }

  const isSuperAdmin = useMemo(
    () => user?.role === USER_ROLE.SUPER_ADMIN,
    [user]
  )

  const onClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    handleClose()
  }
  return (
    <div className={`${className}`}>
      <div className="flex flex-col h-full px-1">
        <div className="flex items-center justify-between mt-2 mb-4 md:justify-center">
          <Link
            className="block w-full py-2 font-sans text-lg font-bold text-center border-b"
            to="/"
          >
            <span>LeKreatif</span>
          </Link>
          <Button
            onClick={onClose}
            className="p-1 border rounded-md bg-primary-50 md:hidden"
          >
            <IoIosClose className="" />
          </Button>
        </div>
        <div className="">
          <Button className="flex items-center justify-center w-full py-2 text-sm font-light bg-secondary-600 hover:bg-secondary-700 text-primary-50">
            <IoShareSocialOutline className="w-4 h-4 mr-2" />
            <span>Créer</span>
          </Button>
        </div>
        <nav className={`flex-1 p-4`}>
          <ul className="space-y-2 text-sm font-light">
            <li>
              <NavLink
                to="/"
                className="flex items-center p-2 rounded text-primary-600 hover:bg-primary-100"
              >
                <RxDashboard className="w-4 h-4 mr-2" />
                Accueil
              </NavLink>
            </li>
          </ul>
        </nav>
        <nav className={`border-t p-4`}>
          <ul className="space-y-2 text-sm font-light">
            {isSuperAdmin && (
              <li>
                <NavLink
                  to="/settings"
                  className="flex items-center p-2 rounded text-primary-600 hover:bg-primary-100"
                >
                  <IoSettingsOutline className="w-4 h-4 mr-2" />
                  Paramètres
                </NavLink>
              </li>
            )}
          </ul>
          <Button
            className="flex items-center justify-center mt-3 text-xs font-medium cursor-pointer"
            onClick={handleLogout}
          >
            <IoLogOutOutline className="w-4 h-4 mr-2" />
            <span className="">Déconnexion</span>
          </Button>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
