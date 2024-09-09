import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { USER_ROLE } from '@/types'

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
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-lg font-semibold">LeKreatif</span>
            </Link>
          </div>
          
          {/* Navigation pour les écrans moyens et grands */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-gray-900 hover:text-gray-700">Accueil</Link>
            <Link to="/social-pages" className="text-gray-900 hover:text-gray-700">Pages</Link>
            {isSuperAdmin && (
              <>
                <Link to="/admin" className="text-gray-900 hover:text-gray-700">Admin</Link>
                <Link to="/settings" className="text-gray-900 hover:text-gray-700">Paramètres</Link>
              </>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Déconnexion
            </button>
          </div>

          {/* Bouton de menu pour les petits écrans */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">Accueil</Link>
              <Link to="/social-pages" className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">Pages</Link>
              {isSuperAdmin && (
                <>
                  <Link to="/admin" className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">Admin</Link>
                  <Link to="/settings" className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">Paramètres</Link>
                </>
              )}
              <button
                onClick={logout}
                className="block w-full px-3 py-2 text-base font-medium text-left text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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
