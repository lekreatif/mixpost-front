import React from "react";
import { IUser, USER_ROLE } from "@/types";
import { useFormValidation } from "@/hooks/useFormValidation";
import { z } from "zod";
import { Field, Label, Input, Select, Button } from "@headlessui/react";

interface UserFormProps {
  user: Partial<IUser>;
  onSubmit: (user: IUser) => void;
  onCancel: () => void;
}

const userSchema = z.object({
  email: z.string().email("L'email est invalide"),
  role: z.string().min(1, "Le rôle est requis"),
});

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const { values, handleChange, errors, validate } = useFormValidation(
    userSchema,
    user ?? {
      email: "",
      role: USER_ROLE.USER,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validate()) {
      onSubmit(values as unknown as IUser);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <Field>
        <Label
          htmlFor="email"
          className="text-primary-700 block text-sm font-medium"
        >
          Email
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={values.email ?? ""}
          onChange={handleChange}
          className="border-primary-300 focus:border-secondary-500 focus:ring-secondary-500 mt-1 block h-10 w-full rounded-md border py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
        )}
      </Field>

      <Field>
        <Label
          htmlFor="role"
          className="text-primary-700 block text-sm font-medium"
        >
          Rôle
        </Label>
        <Select
          id="role"
          name="role"
          value={values.role ?? USER_ROLE.USER}
          onChange={handleChange}
          className="border-primary-300 focus:border-secondary-500 focus:ring-secondary-500 mt-1 block h-10 w-full rounded-md border py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
        >
          <option value="">Sélectionner un rôle</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Utilisateur</option>
        </Select>
        {errors.role && (
          <p className="mt-2 text-sm text-red-600">{errors.role}</p>
        )}
      </Field>

      <div className="mt-6 flex justify-end space-x-3">
        <Button
          type="button"
          onClick={onCancel}
          className="text-primary-700 border-primary-300 focus:ring-secondary-500 hover:bg-primary-50 rounded-md border bg-white px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className="bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          {user.id ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
