import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import Header from '@/components/Header';
import { SocialAccount, Page } from '../types';
import { FaPlus } from 'react-icons/fa';

const AdminPage: React.FC = () => {
  const { 
    getSocialAccounts, 
    isLoading, 
    error, 
    socialAccounts,
    getFacebookAuthUrl,
    getFacebookPages,
    addFacebookPage
  } = useAdmin();
  
  const [pages, setPages] = useState<Page[]>([]);
  const [isAddingPage, setIsAddingPage] = useState(false);

  useEffect(() => {
    getSocialAccounts.mutateAsync();
  }, []);

  const handleAddPage = () => {
    setIsAddingPage(true);
  };

  const handleSelectAccount = async (accountId: number) => {
    try {
      const authUrl = await getFacebookAuthUrl(accountId.toString());
      window.location.href = authUrl;
    } catch (err) {
      console.error("Erreur lors de la récupération de l'URL d'authentification:", err);
    }
  };

  // Cette fonction sera appelée après le retour de l'authentification OAuth
  const handleOAuthCallback = async (code: string, accountId: string) => {
    try {
      const newPages = await getFacebookPages(accountId);
      setPages(newPages);
      for (const page of newPages) {
        await addFacebookPage(page.id, page.name, page.access_token);
      }
      setIsAddingPage(false);
    } catch (err) {
      console.error("Erreur lors de la récupération ou de l'ajout des pages:", err);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center">Erreur : {error}</div>;

  return (
    <>
      <Header />
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Administration</h1>
        
        <div className="p-6 mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Pages Facebook</h2>
            <button 
              onClick={handleAddPage}
              className="px-4 py-2 text-sm text-white bg-green-500 rounded-full hover:bg-green-600 flex items-center"
            >
              <FaPlus className="mr-2" /> Ajouter une page
            </button>
          </div>

          {isAddingPage && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Sélectionnez un compte social :</h3>
              {socialAccounts.map((account: SocialAccount) => (
                <button
                  key={account.id}
                  onClick={() => handleSelectAccount(account.id)}
                  className="mr-2 mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {account.platform}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Pages Facebook :</h3>
            {pages.map((page) => (
              <div key={page.id} className="mb-2 p-2 border rounded">
                {page.name}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminPage;
