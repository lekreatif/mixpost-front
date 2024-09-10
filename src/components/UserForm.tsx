import React from 'react'
import { IUser } from '@/types'
import { useFormValidation } from '@/hooks/useFormValidation'
import { z } from 'zod'

interface UserFormProps {
  user: Partial<IUser>
  onSubmit: (user: IUser) => void
  onCancel: () => void
}

const userSchema = z.object({
  email: z.string().email("L'email est invalide"),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.string().min(1, 'Le rôle est requis'),
})

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const { values, handleChange, errors, validate } = useFormValidation(
    userSchema,
    user
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (await validate()) {
      onSubmit(values as unknown as IUser)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="mt-1 block h-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className="mt-1 block h-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Rôle
        </label>
        <select
          id="role"
          name="role"
          value={values.role}
          onChange={handleChange}
          className="mt-1 block h-10 w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Sélectionner un rôle</option>
          <option value="admin">Admin</option>
          <option value="user">Utilisateur</option>
        </select>
        {errors.role && (
          <p className="mt-2 text-sm text-red-600">{errors.role}</p>
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
          {user.id ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}

export default UserForm
