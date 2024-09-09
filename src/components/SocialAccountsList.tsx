import React from 'react';
import { SocialAccount, SocialPlatform } from '@/types';
import { FaFacebook, FaEdit } from 'react-icons/fa';

interface SocialAccountsListProps {
  accounts: SocialAccount[];
  onEdit: (account: SocialAccount) => void;
}

const SocialAccountsList: React.FC<SocialAccountsListProps> = ({ accounts, onEdit }) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case SocialPlatform.FACEBOOK:
        return <FaFacebook className="text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map((account) => (
        <div key={account.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {getPlatformIcon(account.platform)}
              <h3 className="ml-2 font-semibold capitalize">{account.platform}</h3>
            </div>
            <button 
              onClick={() => onEdit(account)}
              className="text-blue-500 hover:text-blue-600"
            >
              <FaEdit />
            </button>
          </div>
          <p className="text-sm text-gray-600">App Client ID: {account.appClientId}</p>
          <p className="text-sm text-gray-600">App Client Secret: ******</p>
        </div>
      ))}
    </div>
  );
};

export default SocialAccountsList;
