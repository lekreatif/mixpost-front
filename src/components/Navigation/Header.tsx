import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { USER_ROLE } from '@/types'
import { CiSettings } from 'react-icons/ci'
import { FiLogOut } from 'react-icons/fi'

const Header: React.FC = () => {
  const { logout, user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isSuperAdmin = useMemo(
    () => user?.role === USER_ROLE.SUPER_ADMIN,
    [user]
  )

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-lg font-semibold">LeKreatif</span>
            </Link>
          </div>

          {/* Navigation pour les écrans moyens et grands */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isSuperAdmin && (
              <>
                <Link
                  to="/settings"
                  className="text-primary-900 hover:text-primary-700"
                >
                  <CiSettings className="h-6 w-6" />
                </Link>
              </>
            )}
            <button
              onClick={logout}
              className="bg-secondary-600 hover:bg-secondary-700 relative rounded-md px-4 py-2 text-sm font-medium text-white"
            >
              <FiLogOut className="h-6 w-6" />
              <span className="sr-only">Déconnexion</span>
            </button>
          </div>

          {/* Bouton de menu pour les petits écrans */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-primary-400 focus:ring-secondary-500 hover:bg-primary-100 hover:text-primary-500 inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <Link
                to="/"
                className="text-primary-900 hover:bg-primary-100 block rounded-md px-3 py-2 text-base font-medium"
              >
                Accueil
              </Link>
              <Link
                to="/social-pages"
                className="text-primary-900 hover:bg-primary-100 block rounded-md px-3 py-2 text-base font-medium"
              >
                Pages
              </Link>
              {isSuperAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="text-primary-900 hover:bg-primary-100 block rounded-md px-3 py-2 text-base font-medium"
                  >
                    Admin
                  </Link>
                  <Link
                    to="/settings"
                    className="text-primary-900 hover:bg-primary-100 block rounded-md px-3 py-2 text-base font-medium"
                  >
                    Paramètres
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className="bg-secondary-600 hover:bg-secondary-700 block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header