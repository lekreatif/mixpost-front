import React, { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { SocialAccount, Page } from "../types";
import { FaPlus } from "react-icons/fa";

const AdminPage: React.FC = () => {
  const { isLoading, error, useSocialAccounts, getFacebookAuthUrl } =
    useAdmin();

  const { socialAccounts } = useSocialAccounts();

  const [pages] = useState<Page[]>([]);
  const [isAddingPage, setIsAddingPage] = useState(false);

  const handleAddPage = () => {
    setIsAddingPage(true);
  };

  const handleSelectAccount = async (accountId: number) => {
    try {
      const authUrl = await getFacebookAuthUrl(accountId.toString());
      window.location.href = authUrl;
    } catch (err) {
      console.error(
        "Erreur lors de la récupération de l'URL d'authentification:",
        err
      );
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Chargement...
      </div>
    );
  if (error)
    return <div className="text-center text-red-500">Erreur : {error}</div>;

  return (
    <>
      <h1 className="text-primary-900 mb-6 text-3xl font-bold">
        Administration
      </h1>
      <div className="mb-6 overflow-hidden bg-white p-6 shadow sm:rounded-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-primary-900 text-xl font-semibold">
            Pages Facebook
          </h2>
          <button
            onClick={handleAddPage}
            className="flex items-center rounded-full bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
          >
            <FaPlus className="mr-2" /> Ajouter une page
          </button>
        </div>

        {isAddingPage && (
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-semibold">
              Sélectionnez un compte social :
            </h3>
            {socialAccounts &&
              socialAccounts.map((account: SocialAccount) => (
                <button
                  key={account.id}
                  onClick={() => handleSelectAccount(account.id)}
                  className="mb-2 mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  {account.platform}
                </button>
              ))}
          </div>
        )}

        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Pages Facebook :</h3>
          {pages.map(page => (
            <div key={page.pageId} className="mb-2 rounded border p-2">
              {page.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
