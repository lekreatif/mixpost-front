import React, { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/contexts/NotificationContext";
import { usePostCreation } from "@/hooks/usePostCreation";

interface DialogConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ActionButtons: React.FC = () => {
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    onConfirm: () => {},
  });

  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const {
    isScheduled,
    clearStoredData,
    createPostMutation,
    validatePost,
    isPublishing,
    setIsPublishing,
    // transcodingProgress,
  } = usePostCreation();

  const openDialog = (config: Omit<DialogConfig, "isOpen">) => {
    setDialogConfig({ ...config, isOpen: true });
  };

  const closeDialog = () => {
    setDialogConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    openDialog({
      title: "Confirmer l'annulation",
      message:
        "Êtes-vous sûr de vouloir annuler ? Toutes les modifications non enregistrées seront perdues.",
      confirmLabel: "Confirmer",
      cancelLabel: "Annuler",
      onConfirm: handleConfirmCancel,
      onCancel: closeDialog,
    });
  };

  const handleConfirmCancel = async () => {
    try {
      await clearStoredData();
      addNotification("success", "Votre brouillon a été supprimé avec succès.");
      navigate("/");
    } catch (error: unknown) {
      addNotification(
        "error",
        "Une erreur est survenue lors de la suppression du brouillon."
      );
      console.log((error as Error).message);
    } finally {
      closeDialog();
    }
  };

  const handleSaveDraft = () => {
    // Logique pour sauvegarder le brouillon
  };

  const handlePublish = () => {
    const errors = validatePost();
    if (errors.length > 0) {
      errors.forEach(error => addNotification("error", error));
      return;
    }
    setIsPublishing(true);
    createPostMutation
      .mutateAsync()
      .then(() => {
        openDialog({
          title: "Publication réussie",
          message: "Votre post a été publié avec succès.",
          confirmLabel: "OK",
          onConfirm: handleSuccessConfirm,
        });
      })
      .catch(err => {
        console.log(err.message);
        openDialog({
          title: "Erreur de publication",
          message:
            err.message || "Une erreur est survenue lors de la publication.",
          confirmLabel: "Fermer",
          onConfirm: closeDialog,
        });
      })
      .finally(() => setIsPublishing(false));
  };

  const handleSuccessConfirm = async () => {
    await clearStoredData();
    closeDialog();
    navigate("/");
  };

  return (
    <>
      <div className="trasition-all mt-4 flex justify-end space-x-4">
        <Button
          onClick={handleCancel}
          disabled={isPublishing}
          className="me-auto ms-0 rounded-md border bg-error-200 px-4 py-2 text-xs font-light text-gray-700 transition-all duration-300 ease-in-out hover:border-error-500 hover:bg-error-50 hover:text-error-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSaveDraft}
          disabled={isPublishing}
          className="rounded-md border border-primary-950 px-4 py-2 text-xs font-light text-primary-950 transition-all duration-300 ease-in-out hover:bg-primary-950 hover:text-primary-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enregistrer comme brouillon
        </Button>
        <Button
          disabled={isPublishing}
          onClick={handlePublish}
          className="rounded-md border bg-secondary-600 px-4 py-2 text-primary-50 transition-all duration-300 ease-in-out hover:border-secondary-500 hover:bg-transparent hover:text-secondary-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPublishing
            ? "En cours..."
            : isScheduled
              ? "Programmer"
              : "Publier"}
        </Button>
      </div>

      <Dialog
        open={dialogConfig.isOpen}
        onClose={closeDialog}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              {dialogConfig.title}
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{dialogConfig.message}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              {dialogConfig.cancelLabel && (
                <Button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  onClick={dialogConfig.onCancel || closeDialog}
                >
                  {dialogConfig.cancelLabel}
                </Button>
              )}
              <Button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={dialogConfig.onConfirm}
              >
                {dialogConfig.confirmLabel}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ActionButtons;
