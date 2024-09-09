import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import Header from '@/components/Header';
import { SocialAccount } from '../types';
import { Tab, TabList, TabPanel, TabPanels, TabGroup } from '@headlessui/react';
import SocialAccountsList from '@/components/SocialAccountsList';
import SocialAccountForm from '@/components/SocialAccountForm';
import ConnectedPagesList from '@/components/ConnectedPagesList';
import { useFacebookPages } from '@/hooks/useApi';
import { FaPlus, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import Modal from '@/components/Modal';

const SettingsPage: React.FC = () => {
  const { 
    getSocialAccounts, 
    editSocialAccount, 
    isLoading, 
    error, 
    addSocialAccountMutation, 
    socialAccounts, 
    getFacebookAuthUrl,
  } = useAdmin();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConnectPageModalOpen, setIsConnectPageModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const { data: pages, isLoading: pagesLoading } = useFacebookPages();

  useEffect(() => {
    getSocialAccounts.mutateAsync();
  }, []);

  const handleAddAccount = async (account: SocialAccount) => {
    await addSocialAccountMutation.mutateAsync(account);
    setIsAddModalOpen(false);
    getSocialAccounts.mutateAsync();
  };

  const handleUpdateAccount = async (account: SocialAccount) => {
    await editSocialAccount.mutateAsync(account);
    setIsEditModalOpen(false);
    getSocialAccounts.mutateAsync();
  };

  const handleConnectNewPage = async (accountId: number) => {
    try {
      const authUrl = await getFacebookAuthUrl(accountId.toString());
      window.open(authUrl, '_blank', 'width=600,height=600');
      setIsConnectPageModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'URL d'authentification:", err);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center">Erreur : {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Paramètres</h1>
        
        <TabGroup>
          <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8">
            {['Comptes Sociaux', 'Pages Connectées'].map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                  ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                  ${
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  }`
                }
              >
                {category}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            <TabPanel className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Comptes sociaux</h2>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out flex items-center"
                >
                  <FaPlus className="mr-2" /> Ajouter un compte
                </button>
              </div>
              <SocialAccountsList 
                accounts={socialAccounts} 
                onEdit={(account) => {
                  setSelectedAccount(account);
                  setIsEditModalOpen(true);
                }} 
              />
            </TabPanel>
            <TabPanel className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Pages Connectées</h2>
                <button 
                  onClick={() => setIsConnectPageModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out flex items-center"
                >
                  <FaPlus className="mr-2" /> Connecter une nouvelle page
                </button>
              </div>
              {pagesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : (
                <ConnectedPagesList pages={pages || []} />
              )}
            </TabPanel>
          </TabPanels>
        </TabGroup>

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Ajouter un compte social">
          <SocialAccountForm
            account={{}}
            onSubmit={handleAddAccount}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier le compte social">
          <SocialAccountForm
            account={selectedAccount || {}}
            onSubmit={handleUpdateAccount}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>

        <Modal isOpen={isConnectPageModalOpen} onClose={() => setIsConnectPageModalOpen(false)} title="Connecter une nouvelle page">
          <div className="space-y-4">
            {socialAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleConnectNewPage(account.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg transition-colors duration-200 ease-in-out"
              >
                <span className="flex items-center">
                  {account.platform === 'facebook' && <FaFacebookF className="mr-3 text-blue-600" />}
                  {account.platform === 'instagram' && <FaInstagram className="mr-3 text-pink-600" />}
                  {account.platform === 'twitter' && <FaTwitter className="mr-3 text-blue-400" />}
                  {account.platform}
                </span>
                <span className="text-blue-600">&rarr;</span>
              </button>
            ))}
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default SettingsPage;
