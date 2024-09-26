import React, { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useFormValidation } from "@/hooks/useFormValidation";
import { Label, Field, Input, Button } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import { FullPageLoader } from "@/components/layout/FullPageLoader";
import { PasswordVisibilityToggle } from "@/components/form/TogglePasswordVisibility";
import { choosePassword } from "@/services/api";
import { useUser } from "@/hooks/useMe";
import { useNavigate, useLocation } from "react-router-dom";

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      })
      .regex(/[A-Z]/, {
        message: "Le mot de passe doit contenir au moins une lettre majuscule.",
      })
      .regex(/[a-z]/, {
        message: "Le mot de passe doit contenir au moins une lettre minuscule.",
      })
      .regex(/[0-9]/, {
        message: "Le mot de passe doit contenir au moins un chiffre.",
      })
      .regex(/[\W_]/, {
        message: "Le mot de passe doit contenir au moins un caractère spécial.",
      }),
    confirmNewPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmNewPassword"],
  });

const ChoosePassword: React.FC = () => {
  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordInputRef = useRef<HTMLInputElement>(null);
  const { values, handleChange, errors, validate, isValid, validateField } =
    useFormValidation(passwordSchema, {
      newPassword: "",
      confirmNewPassword: "",
    });
  const navigate = useNavigate();
  const location = useLocation();
  const [isRefetching, setIsRefetching] = useState(false);

  const { data, refetch: refetchUser, isLoading: isUserLoading } = useUser();
  const user = data ? data.data : null;

  useEffect(() => {
    if (user && !user.passwordIsTemporary) {
      const { from } = (location.state as {
        from: { pathname: string };
      }) || {
        from: { pathname: "/" },
      };
      navigate(from, { replace: true });
    }
  }, [user]);

  const {
    mutate,
    status,
    error: apiError,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof passwordSchema>) => {
      if (user)
        return choosePassword({ userId: user.id, password: data.newPassword });
      return null;
    },
    onSuccess: async () => {
      setIsRefetching(true);
      await refetchUser();
      setIsRefetching(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validate()) {
      try {
        mutate(values);
      } catch (error) {
        console.error("Error submitting password:", error);
      }
    }
  };

  const isLoading = useMemo(() => status === "pending", [status]);

  if (isUserLoading || isRefetching) return <FullPageLoader />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4 py-12 sm:px-6 lg:px-8">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="w-full max-w-sm space-y-4">
          <div>
            <h3 className="mt-6 text-left text-3xl font-normal text-primary-900">
              Mot de passe
            </h3>
            <p className="font-light text-xs">
              Vous devez choisir un mot de passe avant de continuer
            </p>
            {apiError && (
              <p className="mt-1 text-xs text-error-600">
                Une erreur s'est produite
              </p>
            )}
          </div>
          <div className="space-y-4 rounded-md shadow-sm w-full">
            <Field as="div" className="relative">
              <Label htmlFor="newPassword" className="block mb-1 text-sm">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={() =>
                    validateField("newPassword", values.newPassword)
                  }
                  className="relative block appearance-none rounded-md border border-primary-300 px-3 py-2.5 text-primary-900 placeholder-primary-500 focus:z-10 focus:border-secondary-500 focus:outline-none focus:ring-secondary-500 text-sm h-12 w-full"
                  placeholder="Nouveau mot de passe"
                  ref={newPasswordInputRef}
                  disabled={isLoading || isUserLoading}
                />
                <PasswordVisibilityToggle inputRef={newPasswordInputRef} />
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-xs text-error-600">
                  {errors.newPassword}
                </p>
              )}
            </Field>
            <Field>
              <Label htmlFor="confirmNewPassword" className="block mb-1">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  value={values.confirmNewPassword}
                  onChange={handleChange}
                  onBlur={() =>
                    validateField(
                      "confirmNewPassword",
                      values.confirmNewPassword
                    )
                  }
                  className="relative block w-full appearance-none rounded-md border border-primary-300 px-3 py-2.5 text-primary-900 placeholder-primary-500 focus:z-10 focus:border-secondary-500 focus:outline-none focus:ring-secondary-500 text-sm h-12"
                  placeholder="Confirmer le mot de passe"
                  ref={confirmNewPasswordInputRef}
                  disabled={isLoading || isUserLoading}
                />
                <PasswordVisibilityToggle
                  inputRef={confirmNewPasswordInputRef}
                />
              </div>
              {errors.confirmNewPassword && (
                <p className="mt-1 text-xs text-error-600">
                  {errors.confirmNewPassword}
                </p>
              )}
            </Field>
          </div>
          <div>
            <Button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-secondary-600 px-4 py-2 text-sm font-medium text-white hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
              disabled={isLoading || !isValid}
            >
              {isLoading ? "En cours..." : "Envoyer"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChoosePassword;
