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
      <div className="flex h-full flex-col px-1">
        <div className="mb-4 mt-2 flex items-center justify-between md:justify-center">
          <Link
            className="block w-full border-b py-2 text-center font-sans text-lg font-bold"
            to="/"
          >
            <span>LeKreatif</span>
          </Link>
          <Button
            onClick={onClose}
            className="rounded-md border bg-primary-50 p-1 md:hidden"
          >
            <IoIosClose className="" />
          </Button>
        </div>
        <div className="">
          <Link
            to="/creer"
            className="flex w-full items-center justify-center bg-secondary-600 py-2 text-sm font-light text-primary-50 hover:bg-secondary-700"
          >
            <IoShareSocialOutline className="mr-2 h-4 w-4" />
            <span>Créer</span>
          </Link>
        </div>
        <nav className={`flex-1 p-4`}>
          <ul className="space-y-2 text-sm font-light">
            <li>
              <NavLink
                to="/"
                className="flex items-center rounded p-2 text-primary-600 hover:bg-primary-100"
              >
                <RxDashboard className="mr-2 h-4 w-4" />
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
                  className="flex items-center rounded p-2 text-primary-600 hover:bg-primary-100"
                >
                  <IoSettingsOutline className="mr-2 h-4 w-4" />
                  Paramètres
                </NavLink>
              </li>
            )}
          </ul>
          <Button
            className="mt-3 flex cursor-pointer items-center justify-center text-xs font-medium"
            onClick={handleLogout}
          >
            <IoLogOutOutline className="mr-2 h-4 w-4" />
            <span className="">Déconnexion</span>
          </Button>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
