import React from 'react';
import { z } from 'zod';
import { useAdmin } from '../hooks/useAdmin';
import { usePages } from '../hooks/usePages';
import { useFormValidation } from '../hooks/useFormValidation';
import { useNotification } from '../contexts/NotificationContext';
import Header from '../components/Header';

const pageSchema = z.object({
  pageId: z.string().min(1, 'L\'ID de la page est requis'),
  name: z.string().min(1, 'Le nom de la page est requis'),
  accessToken: z.string().min(1, 'Le token d\'accès est requis'),
});

const assignmentSchema = z.object({
  pageId: z.string().min(1, 'Veuillez sélectionner une page'),
  userId: z.string().min(1, 'Veuillez sélectionner un utilisateur'),
});

const AdminPage = () => {
  const { users, fetchUsers, addFacebookPage, assignPageToUser, isLoading, error } = useAdmin();
  const { pages, isLoading: isPagesLoading, error: pagesError } = usePages();
  const { addNotification } = useNotification();

  const {
    values: newPage,
    handleChange: handleNewPageChange,
    errors: newPageErrors,
    validate: validateNewPage,
    setValues: setNewPageValues,
  } = useFormValidation(pageSchema);

  const {
    values: assignment,
    handleChange: handleAssignmentChange,
    errors: assignmentErrors,
    validate: validateAssignment,
    setValues: setAssignmentValues,
  } = useFormValidation(assignmentSchema);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validateNewPage()) {
      try {
        await addFacebookPage(newPage.pageId, newPage.name, newPage.accessToken);
        addNotification('success', 'Page Facebook ajoutée avec succès');
        setNewPageValues({ pageId: '', name: '', accessToken: '' });
      } catch (err) {
        addNotification('error', 'Erreur lors de l\'ajout de la page Facebook');
      }
    }
  };

  const handleAssignPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validateAssignment()) {
      try {
        await assignPageToUser(Number(assignment.pageId), Number(assignment.userId));
        addNotification('success', 'Page assignée avec succès');
        setAssignmentValues({ pageId: '', userId: '' });
      } catch (err) {
        addNotification('error', 'Erreur lors de l\'assignation de la page');
      }
    }
  };

  if (isLoading || isPagesLoading) return <div>Chargement...</div>;
  if (error || pagesError) {
    addNotification('error', error || pagesError || 'Une erreur est survenue');
    return null;
  }

  return (
    <>
      <Header />
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Administration</h1>
        
        <div className="p-6 mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
          <h2 className="mb-4 text-xl font-semibold">Ajouter une nouvelle page Facebook</h2>
          <form onSubmit={handleAddPage} className="space-y-4">
            <div>
              <input
                type="text"
                name="pageId"
                placeholder="ID de la page"
                value={newPage.pageId || ''}
                onChange={handleNewPageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {newPageErrors.pageId && <p className="mt-1 text-sm text-red-500">{newPageErrors.pageId}</p>}
            </div>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Nom de la page"
                value={newPage.name || ''}
                onChange={handleNewPageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {newPageErrors.name && <p className="mt-1 text-sm text-red-500">{newPageErrors.name}</p>}
            </div>
            <div>
              <input
                type="text"
                name="accessToken"
                placeholder="Token d'accès"
                value={newPage.accessToken || ''}
                onChange={handleNewPageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {newPageErrors.accessToken && <p className="mt-1 text-sm text-red-500">{newPageErrors.accessToken}</p>}
            </div>
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md">
              Ajouter la page
            </button>
          </form>
        </div>

        <div className="p-6 overflow-hidden bg-white shadow sm:rounded-lg">
          <h2 className="mb-4 text-xl font-semibold">Assigner une page à un utilisateur</h2>
          <form onSubmit={handleAssignPage} className="space-y-4">
            <div>
              <select
                name="pageId"
                value={assignment.pageId || ''}
                onChange={handleAssignmentChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez une page</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
              {assignmentErrors.pageId && <p className="mt-1 text-sm text-red-500">{assignmentErrors.pageId}</p>}
            </div>
            <div>
              <select
                name="userId"
                value={assignment.userId || ''}
                onChange={handleAssignmentChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez un utilisateur</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
              {assignmentErrors.userId && <p className="mt-1 text-sm text-red-500">{assignmentErrors.userId}</p>}
            </div>
            <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded-md">
              Assigner la page
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default AdminPage;
