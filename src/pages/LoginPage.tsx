import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Field, Input, Label } from '@headlessui/react'
import Logo from '@/components/layout/Logo'
import { FullPageLoader } from '@/components/layout/FullPageLoader'
import { login } from '@/services/api'
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    data: authData,
    refetch: refetchIsAuthenticated,
    isLoading: isAuthLoading,
  } = useIsAuthenticated(!location.state?.from)

  const isAuthenticated = authData?.data?.data?.isAuthenticated

  useEffect(() => {
    const redirect = () => {
      if (isAuthenticated) {
        const { from } = (location.state as {
          from: { pathname: string }
        }) || {
          from: { pathname: '/' },
        }
        navigate(from, { replace: true })
      }
    }
    redirect()
  }, [isAuthenticated, navigate, location.state])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const {
        data: {
          data: { isAuthenticated },
        },
      } = await login(email, password, rememberMe)

      if (isAuthenticated) {
        await refetchIsAuthenticated()
      }
    } catch (err) {
      console.error((err as Error).message)
      setError("Une erreur s'est produite lors de la connexion.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthLoading) {
    return <FullPageLoader />
  }

  return (
    <div className="w-dvh flex h-dvh justify-center bg-[url(https://images.unsplash.com/photo-1726910133626-9b573eca70ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8YWxsfDJ8fHx8fHx8fDE3MjgwNTAxMjV8&ixlib=rb-4.0.3&q=80&w=2000)] bg-cover bg-center">
      <div className="grid w-full max-w-sm place-content-center">
        <div className="w-[20rem] space-y-2 rounded-md border bg-primary-100 p-4 shadow-sm lg:w-[24rem] lg:p-8">
          <div className="h-10 text-center">
            <h1 className="flex items-center justify-center space-x-2 font-medium">
              <span className="inline-block h-6">
                <Logo />
              </span>
              <span className="text-2xl select-none">LeKreatif</span>
            </h1>
          </div>
          <div>
            <h3 className="mt-4 text-base font-normal text-left text-primary-900">
              Connexion
            </h3>
          </div>
          <form className="space-y-6" onSubmit={onSubmit}>
            {error && <div className="text-red-500">{error}</div>}
            <div className="-space-y-px rounded-md">
              <Field>
                <Label htmlFor="email-address" className="sr-only">
                  Adresse e-mail
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block h-12 w-full appearance-none rounded-none rounded-t-md border border-primary-300 px-3 py-2.5 text-primary-900 placeholder-primary-500 focus:z-10 focus:border-secondary-500 focus:outline-none focus:ring-secondary-500 sm:text-sm"
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
                  className="relative block h-12 w-full appearance-none rounded-none rounded-b-md border border-primary-300 px-3 py-2.5 text-primary-900 placeholder-primary-500 focus:z-10 focus:border-secondary-500 focus:outline-none focus:ring-secondary-500 sm:text-sm"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
            </div>
            <Field className="flex items-center mt-6">
              <Input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 rounded border-primary-300 text-secondary-600 focus:ring-secondary-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Label
                htmlFor="remember-me"
                className="block ml-2 text-sm text-primary-900"
              >
                Se souvenir de moi
              </Label>
            </Field>

            <div>
              <Button
                type="submit"
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 disabled:bg-secondary-200 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
