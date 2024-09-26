import { logout } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      queryClient.clear();
      return (window.location.href = "/login");
    },
    onError: () => {
      throw new Error("Ce n'est pas vous, c'est nous");
    },
  });

  return mutation;
};
