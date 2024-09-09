import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { USER_ROLE } from '@/types'

const Header = () => {
  const { logout } = useAuth()
  const {user} = useAuth()

  const isSuperAdmin = useMemo(
    () =>  user?.role === USER_ROLE.SUPER_ADMIN
    ,
    [user]
  )

  return (
    <header className="bg-white shadow">
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center flex-shrink-0">
              <span className="text-lg font-semibold">LeKreatif</span>
            </Link>
            <div className="flex ml-6 space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Accueil
              </Link>
              <Link
                to="/social-pages"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Pages
              </Link>

              {isSuperAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Admin
                  </Link>
                  <Link
                    to="/settings"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    Paramètres
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center ml-6">
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
