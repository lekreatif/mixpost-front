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
                  className="text-gray-900 hover:text-gray-700"
                >
                  <CiSettings className="h-6 w-6" />
                </Link>
              </>
            )}
            <button
              onClick={logout}
              className="relative rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <FiLogOut className="h-6 w-6" />
              <span className="sr-only">Déconnexion</span>
            </button>
          </div>

          {/* Bouton de menu pour les petits écrans */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
              >
                Accueil
              </Link>
              <Link
                to="/social-pages"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
              >
                Pages
              </Link>
              {isSuperAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Admin
                  </Link>
                  <Link
                    to="/settings"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Paramètres
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-left text-base font-medium text-white hover:bg-indigo-700"
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
