import axios, { AxiosError, AxiosResponse } from "axios";
import { IUser, SocialAccount, Page } from "@/types";
import { authService } from "./authService";
import NavigationService from "./NavigationService";

const API_URL = "/api";

let isRefreshing = false;
let refreshSubscribers: Array<(error: any) => void> = [];

const onRefreshed = () => {
  refreshSubscribers.forEach(callback => callback(null));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (error: any) => void): void => {
  refreshSubscribers.push(callback);
};

const isLoginPage = (): boolean => {
  return window.location.pathname === "/login";
};

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  async (error: any) => {
    const { config, response } = error;

    if (response && response.status === 401 && !config._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(api(config));
            }
          });
        });
      }

      config._retry = true;
      isRefreshing = true;

      try {
        await authService.refreshToken();
        onRefreshed();
        return api(config);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers.forEach(callback => callback(refreshError));
        refreshSubscribers = [];

        if (
          (refreshError as AxiosError).response &&
          (refreshError as AxiosError).response?.status === 403
        ) {
          if (!isLoginPage()) {
            NavigationService.navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const refreshAccessToken = async (): Promise<void> => {
  await api.post("/auth/refresh");
};

export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
): Promise<AxiosResponse<{ isAuthenticated: boolean }>> => {
  return api.post("/auth/login", { email, password, rememberMe });
};
export const logout = async (): Promise<void> => await api.post("/auth/logout");

export const choosePassword = ({
  userId,
  password,
}: {
  userId: number;
  password: string;
}) => api.put(`/user/${userId}/choose-password`, { password });

export const getAuthState = (): Promise<
  AxiosResponse<{ isAuthenticated: boolean }>
> => api.get("/auth/auth-state");
export const getMyPages = (): Promise<AxiosResponse<Page[]>> =>
  api.get("/pages/my-pages");
export const getUser: () => Promise<AxiosResponse<IUser>> = async () =>
  api.get("/user/me");
export const getFacebookAuthUrl = async (): Promise<string> => {
  const response = await api.get("/auth/facebook/url");
  return response.data.url;
};
export const getSocialAccounts = async (): Promise<
  AxiosResponse<SocialAccount[]>
> => api.get("/social-accounts");

export const getUsers = async () => api.get("/user");

export const addFacebookPage = async (pageId: string) => {
  await api.post("/facebook/pages", { pageId });
};
export const createSocialAccount = async (data: SocialAccount) =>
  api.post("/social-accounts", { ...data });

export const updateSocialAccount = async (
  accountData: SocialAccount
): Promise<SocialAccount> => {
  const response = await api.put(
    `/social-accounts/${accountData.id}`,
    accountData
  );
  return response.data as SocialAccount;
};
export const createUser = async (data: IUser) => api.post("/user", { ...data });
export const updateUser = async (data: IUser) =>
  api.put(`/user/${data.email}`, data);
export const deleteUser = async (userId: number) =>
  api.delete(`/user/${userId}`);

export const assignUsersToPage = async (pageId: string, userIds: number[]) =>
  api.post(`/pages/assign-users`, { pageId, userIds });

export const resetInactivityTimer = () => {
  window.dispatchEvent(new Event("user_activity"));
};

api.interceptors.response.use(
  response => {
    resetInactivityTimer();
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
export default api;
