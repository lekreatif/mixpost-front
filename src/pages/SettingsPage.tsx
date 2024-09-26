import React, { useState, useMemo } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { SocialAccount, IUser } from "@/types";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabGroup,
  Button,
} from "@headlessui/react";
import SocialAccountsList from "@/components/Settings/SocialAccountsList";
import SocialAccountForm from "@/components/Settings/SocialAccountForm";
import ConnectedPagesList from "@/components/Settings/ConnectedPagesList";
import { FaPlus, FaFacebookF } from "react-icons/fa";
import { AxiosResponse } from "axios";
import PageDetailsModal from "@/components/Settings/PageDetailsModal";
import { Page } from "@/types";

import UsersList from "@/components/Settings/User/UsersList";
import UserForm from "@/components/Settings/User/UserForm";

import Modal from "@/components/Modals/Modal";
import { usePages } from "@/hooks/usePages";

enum E_MODAL_ACTIONS {
  "HANDLE_PAGE" = "HANDLE_PAGE",
  "HANDLE_SOCIAL_ACCOUNT" = "HANDLE_SOCIAL_ACCOUNT",
  "HANDLE_USER" = "HANDLE_USER",
  "HANDLE_PAGE_DETAILS" = "HANDLE_PAGE_DETAILS",
}

const SettingsPage: React.FC = () => {
  const {
    editSocialAccount,
    isLoading,
    error,
    addSocialAccountMutation,
    useSocialAccounts,
    getFacebookAuthUrl,
    useUsers,
    addUserMutation,
    editUserMutation,
    deleteUserMutation,
  } = useAdmin();

  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(
    null
  );
  const { pages, isLoading: pagesLoading } = usePages();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<E_MODAL_ACTIONS>(
    E_MODAL_ACTIONS.HANDLE_PAGE
  );
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { data: usersResult, isLoading: usersAreLoading } = useUsers();
  const { socialAccounts } = useSocialAccounts();

  const users = useMemo(() => {
    if (usersResult) {
      return (usersResult as unknown as AxiosResponse).data;
    }
    return [];
  }, [usersResult]);

  const handleAddAccount = async (account: SocialAccount) => {
    await addSocialAccountMutation.mutateAsync(account);
    setIsModalOpen(false);
  };

  const handleUpdateAccount = async (account: SocialAccount) => {
    await editSocialAccount.mutateAsync(account);
    setIsModalOpen(false);
  };

  const handleAddUser = async (user: User) => {
    await addUserMutation.mutateAsync(user);
    setIsModalOpen(false);
  };

  const handleUpdateUser = async (user: User) => {
    await editUserMutation.mutateAsync(user);
    setIsModalOpen(false);
  };

  const handleDeleteUser = async (userId: number) => {
    await deleteUserMutation.mutateAsync(userId);
  };

  const handleConnectNewPage = async (accountId: number) => {
    try {
      const authUrl = await getFacebookAuthUrl(accountId.toString());
      setIsModalOpen(false);
      window.location.href = authUrl;
    } catch (err) {
      console.error(
        "Erreur lors de la récupération de l'URL d'authentification:",
        err
      );
    }
  };

  const handlePageClick = (page: Page) => {
    setSelectedPage(page);
    setIsModalOpen(true);
    setModalAction(E_MODAL_ACTIONS.HANDLE_PAGE_DETAILS);
  };

  const getModalTitle = () => {
    switch (modalAction) {
      case E_MODAL_ACTIONS.HANDLE_USER:
        return "Ajouter/Modifier un utilisateur";
      case E_MODAL_ACTIONS.HANDLE_SOCIAL_ACCOUNT:
        return "Ajouter/Modifier un reseau social";
      case E_MODAL_ACTIONS.HANDLE_PAGE:
        return "Connecter une page";
      case E_MODAL_ACTIONS.HANDLE_PAGE_DETAILS:
        return "Détails de la page";
      default:
        return "";
    }
  };

  const modalContent = {
    HANDLE_USER: (
      <UserForm
        user={selectedUser || {}}
        onSubmit={selectedUser ? handleUpdateUser : handleAddUser}
        onCancel={() => setIsModalOpen(false)}
      />
    ),
    HANDLE_SOCIAL_ACCOUNT: (
      <SocialAccountForm
        account={selectedAccount || {}}
        onSubmit={selectedAccount ? handleUpdateAccount : handleAddAccount}
        onCancel={() => setIsModalOpen(false)}
      />
    ),
    HANDLE_PAGE: (
      <div className="space-y-4">
        {socialAccounts &&
          socialAccounts.map(account => (
            <Button
              key={account.id}
              onClick={() => handleConnectNewPage(account.id)}
              className="text-primary-700 focus:ring-secondary-500 hover:bg-primary-50 flex w-full items-center justify-between rounded-lg bg-white px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <span className="flex items-center">
                {account.platform === "facebook" && (
                  <FaFacebookF className="text-secondary-600 mr-3" />
                )}
                {account.platform}
              </span>
              <span className="text-secondary-600">&rarr;</span>
            </Button>
          ))}
      </div>
    ),

    HANDLE_PAGE_DETAILS: <PageDetailsModal page={selectedPage} />,
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
      <h1 className="text-primary-900 mb-8 text-3xl font-extrabold">
        Paramètres
      </h1>
      <TabGroup>
        <TabList className="bg-primary-900/10 mb-8 flex space-x-1 rounded-md p-1">
          {["Pages", "Réseaux", "Utilisateurs"].map(category => (
            <Tab
              key={category}
              className={({ selected }) =>
                `ring-offset-secondary-400 text-primary-700 w-full rounded-md py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2 ${
                  selected
                    ? "bg-white"
                    : "text-primary-500 hover:text-primary-800 hover:bg-white/[0.12]"
                }`
              }
            >
              {category}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel className="bg-primary-50 rounded-xl border p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-primary-900 text-2xl font-semibold">
                Pages Connectées
              </h2>
              <Button
                onClick={() => {
                  setIsModalOpen(true);
                  setModalAction(E_MODAL_ACTIONS.HANDLE_PAGE);
                }}
                className="bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <FaPlus className="mr-2" /> Ajouter
              </Button>
            </div>

            <ConnectedPagesList
              pages={pages || []}
              onPageClick={handlePageClick}
              isLoading={pagesLoading}
            />
          </TabPanel>
          <TabPanel className="bg-primary-50 rounded-xl border p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-primary-900 text-2xl font-semibold">
                Réseaux Sociaux
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setModalAction(E_MODAL_ACTIONS.HANDLE_SOCIAL_ACCOUNT);
                  setSelectedAccount(null);
                }}
                className="bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <FaPlus className="mr-2" /> Ajouter
              </button>
            </div>
            {socialAccounts && (
              <SocialAccountsList
                accounts={socialAccounts}
                onEdit={account => {
                  setSelectedAccount(account);
                  setIsModalOpen(true);
                  setModalAction(E_MODAL_ACTIONS.HANDLE_SOCIAL_ACCOUNT);
                }}
              />
            )}
          </TabPanel>

          <TabPanel className="bg-primary-50 rounded-xl border p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-primary-900 text-2xl font-semibold">
                Utilisateurs
              </h2>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setIsModalOpen(true);
                  setModalAction(E_MODAL_ACTIONS.HANDLE_USER);
                }}
                className="bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <FaPlus className="mr-2" /> Ajouter
              </button>
            </div>
            {!usersAreLoading && users && (
              <UsersList
                users={users}
                onEdit={user => {
                  setSelectedUser(user);
                  setIsModalOpen(true);
                  setModalAction(E_MODAL_ACTIONS.HANDLE_USER);
                }}
                onDelete={handleDeleteUser}
              />
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={getModalTitle()}
      >
        {modalAction ? modalContent[modalAction] : null}
      </Modal>
    </>
  );
};

export default SettingsPage;
