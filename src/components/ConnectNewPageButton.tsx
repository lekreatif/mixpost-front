import React from 'react';
import { SocialAccount } from '@/types';

interface ConnectNewPageButtonProps {
  accounts: SocialAccount[];
  onSelectAccount: (account: SocialAccount) => void;
}

const ConnectNewPageButton: React.FC<ConnectNewPageButtonProps> = ({ accounts, onSelectAccount }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm text-white bg-blue-500 rounded-full hover:bg-blue-600"
      >
        Connecter une nouvelle page
      </button>
      {isOpen && (
        <div className="mt-2 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Sélectionnez un compte social :</h3>
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => onSelectAccount(account)}
              className="mr-2 mb-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              {account.platform}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConnectNewPageButton;
