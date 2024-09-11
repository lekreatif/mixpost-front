import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      const { from } = location.state || { from: { pathname: '/' } }
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="bg-primary-50 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-primary-900 mt-6 text-center text-3xl font-extrabold">
            Connexion à votre compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && <div className="text-red-500">{error}</div>}
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="text-primary-900 placeholder-primary-500 border-primary-300 focus:border-secondary-500 focus:ring-secondary-500 relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-2 focus:z-10 focus:outline-none sm:text-sm"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="text-primary-900 placeholder-primary-500 border-primary-300 focus:border-secondary-500 focus:ring-secondary-500 relative block w-full appearance-none rounded-none rounded-b-md border px-3 py-2 focus:z-10 focus:outline-none sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
