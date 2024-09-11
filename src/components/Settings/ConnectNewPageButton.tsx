import React from 'react'
import { SocialAccount } from '@/types'

interface ConnectNewPageButtonProps {
  accounts: SocialAccount[]
  onSelectAccount: (account: SocialAccount) => void
}

const ConnectNewPageButton: React.FC<ConnectNewPageButtonProps> = ({
  accounts,
  onSelectAccount,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
      >
        Connecter une nouvelle page
      </button>
      {isOpen && (
        <div className="mt-2 rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">
            Sélectionnez un compte social :
          </h3>
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => onSelectAccount(account)}
              className="bg-primary-200 text-primary-800 hover:bg-primary-300 mb-2 mr-2 rounded px-4 py-2"
            >
              {account.platform}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ConnectNewPageButton
