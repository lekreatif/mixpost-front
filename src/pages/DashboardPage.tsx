
import { usePages } from '../hooks/usePages';
import Header from '../components/Header';

const DashboardPage = () => {
  const { pages, isLoading, error } = usePages();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <>
      <Header />
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium leading-6 text-gray-900">Vos pages Facebook</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {pages.map((page) => (
              <li key={page.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">{page.name}</p>
                  <div className="flex flex-shrink-0 ml-2">
                    <p className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                      ID: {page.pageId}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default DashboardPage;
