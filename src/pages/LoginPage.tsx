import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import { Field, Input, Label } from '@headlessui/react'
import Logo from '@/components/layout/Logo'
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
    <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="h-10 text-center">
          <h1 className="flex items-center justify-center text-4xl font-medium">
            <span className="inline-block h-8">
              <Logo />
            </span>
            <span>LeKreatif</span>
          </h1>
        </div>
        <div>
          <h3 className="mt-6 text-left text-3xl font-normal text-primary-900">
            Connexion
          </h3>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && <div className="text-red-500">{error}</div>}
          <div className="-space-y-px rounded-md shadow-sm">
            <Field>
              <label htmlFor="email-address" className="sr-only">
                Adresse e-mail
              </label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-primary-300 px-3 py-2.5 text-primary-900 placeholder-primary-500 focus:z-10 focus:border-secondary-500 focus:outline-none focus:ring-secondary-500 sm:text-sm"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="password" className="sr-only">
                Mot de passe
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-primary-300 px-3 py-2.5 text-primary-900 placeholder-primary-500 focus:z-10 focus:border-secondary-500 focus:outline-none focus:ring-secondary-500 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-secondary-600 px-4 py-2 text-sm font-medium text-white hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
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
