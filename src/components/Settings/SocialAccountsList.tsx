import React from 'react'
import { SocialAccount, SocialPlatform } from '@/types'
import { FaFacebook, FaEdit } from 'react-icons/fa'

interface SocialAccountsListProps {
  accounts: SocialAccount[]
  onEdit: (account: SocialAccount) => void
}

const SocialAccountsList: React.FC<SocialAccountsListProps> = ({
  accounts,
  onEdit,
}) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case SocialPlatform.FACEBOOK:
        return <FaFacebook className="text-blue-600" />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="rounded-lg border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              {getPlatformIcon(account.platform)}
              <h3 className="ml-2 font-semibold capitalize">
                {account.platform}
              </h3>
            </div>
            <button
              onClick={() => onEdit(account)}
              className="text-blue-500 hover:text-blue-600"
            >
              <FaEdit />
            </button>
          </div>
          <p className="text-primary-600 text-sm">
            App Client ID: {account.appClientId}
          </p>
          <p className="text-primary-600 text-sm">App Client Secret: ******</p>
        </div>
      ))}
    </div>
  )
}

export default SocialAccountsList
