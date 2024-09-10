import React from 'react'
import { IUser } from '@/types'
import { FaEdit, FaTrash } from 'react-icons/fa'

interface UsersListProps {
  users: IUser[]
  onEdit: (user: IUser) => void
  onDelete: (userId: number) => void
}

const UsersList: React.FC<UsersListProps> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Rôle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
              <td className="whitespace-nowrap px-6 py-4">{user.role}</td>
              <td className="whitespace-nowrap px-6 py-4">
                <button
                  onClick={() => onEdit(user)}
                  className="mr-2 text-indigo-600 hover:text-indigo-900"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersList
