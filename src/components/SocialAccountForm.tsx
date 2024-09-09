import React from 'react';
import { SocialAccount, SocialPlatform } from '@/types';
import { useFormValidation } from '@/hooks/useFormValidation';
import { z } from 'zod';

interface SocialAccountFormProps {
  account: Partial<SocialAccount>;
  onSubmit: (account: SocialAccount) => void;
  onCancel: () => void;
}

const socialAccountSchema = z.object({
  platform: z.nativeEnum(SocialPlatform),
  appClientId: z.string().min(1, "L'ID client est requis"),
  appClientSecret: z.string().min(1, "Le secret client est requis"),
});

const SocialAccountForm: React.FC<SocialAccountFormProps> = ({ account, onSubmit, onCancel }) => {

  const { values, handleChange, errors, validate } = useFormValidation(socialAccountSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validate()) {
      onSubmit(values as SocialAccount);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Plateforme</label>
        <select
          id="platform"
          name="platform"
          value={values.platform}
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md h-10 border"
        >
          <option value="">Sélectionner une plateforme</option>
          {Object.values(SocialPlatform).map((platform) => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
        {errors.platform && <p className="mt-2 text-sm text-red-600">{errors.platform}</p>}
      </div>

      <div>
        <label htmlFor="appClientId" className="block text-sm font-medium text-gray-700">App Client ID</label>
        <input
          type="text"
          id="appClientId"
          name="appClientId"
          value={values.appClientId}
          onChange={handleChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 border"
        />
        {errors.appClientId && <p className="mt-2 text-sm text-red-600">{errors.appClientId}</p>}
      </div>

      <div>
        <label htmlFor="appClientSecret" className="block text-sm font-medium text-gray-700">App Client Secret</label>
        <input
          type="password"
          id="appClientSecret"
          name="appClientSecret"
          value={values.appClientSecret}
          onChange={handleChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 border"
        />
        {errors.appClientSecret && <p className="mt-2 text-sm text-red-600">{errors.appClientSecret}</p>}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {account.id ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default SocialAccountForm;
