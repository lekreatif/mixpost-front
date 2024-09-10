import React, { useState, useEffect, useMemo } from 'react'
import { Page, IUser } from '@/types'
import { Checkbox, Field, Label } from '@headlessui/react'
import { FaCheck } from 'react-icons/fa6'
import { useAdmin } from '@/hooks/useAdmin'
import { AxiosResponse } from 'axios'

interface PageDetailsModalProps {
  page: Page | null
}

const PageDetailsModal: React.FC<PageDetailsModalProps> = ({ page }) => {
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set())
  const { isLoading, assignUsersToPageMutation, useUsers } = useAdmin()
  const { data: usersResult } = useUsers()

  const users = useMemo(() => {
    if (usersResult) {
      const users = (usersResult as unknown as AxiosResponse).data as IUser[]
      return users
    }
    return [] as IUser[]
  }, [usersResult])

  const usersListComponent = useMemo(
    () =>
      users.map((user) => (
        <Field key={user.id} className="mb-2 flex items-center gap-2">
          <Checkbox
            checked={selectedUsers.has(user.id)}
            onChange={() => handleUserToggle(user.id)}
            className="group size-6 rounded-md border bg-white/10 p-1 ring-1 ring-inset ring-white/15 data-[checked]:bg-blue-600"
          >
            <FaCheck className="hidden size-4 fill-gray-50 group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-sm text-gray-700">
            {user.email}
            {page?.users?.some((u) => u.userId === user.id) && (
              <span className="ml-2 text-xs text-green-600">(Assigné)</span>
            )}
          </Label>
        </Field>
      )),
    [page, users, selectedUsers]
  )

  useEffect(() => {
    if (page && page.users) {
      setSelectedUsers(new Set(page.users.map((u) => u.userId)))
    }
  }, [page])

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  const handleSubmit = () => {
    if (page) {
      assignUsersToPageMutation.mutateAsync({
        pageId: page.pageId,
        userIds: Array.from(selectedUsers),
      })
    }
  }

  if (!page) return null

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-800">Page</h3>
        <div className="flex items-center justify-between gap-2">
          <div className="">
            <p className="text-sm font-medium text-gray-600">
              <span className="font-medium">Nom :</span> {page.name}
            </p>
            <p className="text-xs font-light text-gray-600">
              <span className="font-medium">ID :</span> {page.pageId}
            </p>
          </div>
          <img
            className="aspect-square h-14 rounded-full object-cover object-center"
            src={page.profilePictureUrl}
            alt=""
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          Utilisateurs
        </h3>
        <div className="max-h-60 overflow-y-auto">{usersListComponent}</div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'En cours...' : 'Assigner'}
        </button>
      </div>
    </div>
  )
}

export default PageDetailsModal
