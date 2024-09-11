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
      <table className="divide-primary-200 min-w-full divide-y">
        <thead className="bg-primary-50">
          <tr>
            <th className="text-primary-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Email
            </th>
            <th className="text-primary-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Rôle
            </th>
            <th className="text-primary-500 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-primary-200 divide-y bg-white">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
              <td className="whitespace-nowrap px-6 py-4">{user.role}</td>
              <td className="whitespace-nowrap px-6 py-4">
                <button
                  onClick={() => onEdit(user)}
                  className="text-secondary-600 hover:text-secondary-900 mr-2"
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
