import React from 'react'
import { SocialAccount, SocialPlatform } from '@/types'
import { useFormValidation } from '@/hooks/useFormValidation'
import { z } from 'zod'

interface SocialAccountFormProps {
  account: Partial<SocialAccount>
  onSubmit: (account: SocialAccount) => void
  onCancel: () => void
}

const socialAccountSchema = z.object({
  platform: z.nativeEnum(SocialPlatform),
  appClientId: z.string().min(1, "L'ID client est requis"),
  appClientSecret: z.string().min(1, 'Le secret client est requis'),
})

const SocialAccountForm: React.FC<SocialAccountFormProps> = ({
  account,
  onSubmit,
  onCancel,
}) => {
  const { values, handleChange, errors, validate } = useFormValidation(
    socialAccountSchema,
    account
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (await validate()) {
      onSubmit(values as SocialAccount)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="platform"
          className="block text-sm font-medium text-gray-700"
        >
          Plateforme
        </label>
        <select
          id="platform"
          name="platform"
          value={values.platform}
          onChange={handleChange}
          className="mt-1 block h-10 w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Sélectionner une plateforme</option>
          {Object.values(SocialPlatform).map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
        {errors.platform && (
          <p className="mt-2 text-sm text-red-600">{errors.platform}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="appClientId"
          className="block text-sm font-medium text-gray-700"
        >
          App Client ID
        </label>
        <input
          type="text"
          id="appClientId"
          name="appClientId"
          value={values.appClientId}
          onChange={handleChange}
          className="mt-1 block h-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.appClientId && (
          <p className="mt-2 text-sm text-red-600">{errors.appClientId}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="appClientSecret"
          className="block text-sm font-medium text-gray-700"
        >
          App Client Secret
        </label>
        <input
          type="password"
          id="appClientSecret"
          name="appClientSecret"
          value={values.appClientSecret}
          onChange={handleChange}
          className="mt-1 block h-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.appClientSecret && (
          <p className="mt-2 text-sm text-red-600">{errors.appClientSecret}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {account.id ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}

export default SocialAccountForm
