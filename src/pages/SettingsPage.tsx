import React, { useState, useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { useNotification } from '../contexts/NotificationContext';
import Header from '../components/Header';

const SettingsPage: React.FC = () => {
  const { getSocialAccounts, addSocialAccount, isLoading, error } = useAdmin();
  const { addNotification } = useNotification();
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({ platform: '', appClientId: '', appClientSecret: '' });

  useEffect(() => {
    fetchSocialAccounts();
  }, []);

  const fetchSocialAccounts = async () => {
    const accounts = await getSocialAccounts();
    setSocialAccounts(accounts);
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSocialAccount(newAccount);
      addNotification('success', 'Compte social ajouté avec succès');
      setNewAccount({ platform: '', appClientId: '', appClientSecret: '' });
      fetchSocialAccounts();
    } catch (err) {
      addNotification('error', 'Erreur lors de l\'ajout du compte social');
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <>
      <Header />
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Paramètres</h1>
        
        <div className="p-6 mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
          <h2 className="mb-4 text-xl font-semibold">Comptes sociaux</h2>
          {socialAccounts.map((account: any) => (
            <div key={account.id} className="p-4 mb-4 border rounded">
              <h3 className="font-semibold">{account.platform}</h3>
              <p>App Client ID: {account.appClientId}</p>
              <p>App Client Secret: ******</p>
            </div>
          ))}
          
          <form onSubmit={handleAddAccount} className="mt-6">
            <select
              value={newAccount.platform}
              onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="">Sélectionner une plateforme</option>
              <option value="facebook">Facebook</option>
            </select>
            <input
              type="text"
              value={newAccount.appClientId}
              onChange={(e) => setNewAccount({ ...newAccount, appClientId: e.target.value })}
              placeholder="App Client ID"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="password"
              value={newAccount.appClientSecret}
              onChange={(e) => setNewAccount({ ...newAccount, appClientSecret: e.target.value })}
              placeholder="App Client Secret"
              className="w-full p-2 mb-2 border rounded"
            />
            <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">
              Ajouter un compte
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default SettingsPage;
