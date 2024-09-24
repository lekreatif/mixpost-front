import axios, { AxiosResponse, AxiosError, CancelTokenSource } from "axios";
import { IUser, SocialAccount, Page } from "@/types";

const { VITE_NODE_ENV, VITE_API_URL } = import.meta.env;

const API_URL = VITE_NODE_ENV === "development" ? "/api" : VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];
let cancelTokenSource: CancelTokenSource | null = null;

const processQueue = (error: Error | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    if (error.response?.status === 401) {
      if (originalRequest.url === "/auth/refresh") {
        isRefreshing = false;
        const error = new Error("Vous devez vous connecter");
        processQueue(error);
        throw error;
      }

      if (!originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return api(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await refreshAccessToken();
          processQueue(null);
          return api(originalRequest);
        } finally {
          isRefreshing = false;
        }
      }
    }
    throw error;
  }
);

api.interceptors.request.use(
  config => {
    if (isRefreshing) {
      if (cancelTokenSource) {
        cancelTokenSource.cancel("Request canceled due to token refreshing.");
      }
      cancelTokenSource = axios.CancelToken.source();
      config.cancelToken = cancelTokenSource.token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const refreshAccessToken = async (): Promise<void> => {
  await api.post("/auth/refresh");
};

export const setIsRefreshing = (value: boolean) => {
  isRefreshing = value;
};

export const getIsRefreshing = () => isRefreshing;

export const setRefreshPromise = (promise: Promise<void> | null) => {
  refreshPromise = promise;
};

export const getRefreshPromise = () => refreshPromise;

export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
): Promise<void> => {
  await api.post("/auth/login", { email, password, rememberMe });
};
export const logout = async (): Promise<void> => await api.post("/auth/logout");

export const getMyPages = (): Promise<AxiosResponse<Page[]>> =>
  api.get("/pages/my-pages");
export const getUser: () => Promise<AxiosResponse<IUser>> = async () =>
  api.get("/users/me");
export const getFacebookAuthUrl = async (): Promise<string> => {
  const response = await api.get("/auth/facebook/url");
  return response.data.url;
};
export const getSocialAccounts = async (): Promise<
  AxiosResponse<SocialAccount[]>
> => api.get("/social-accounts");

export const getUsers = async () => api.get("/users");

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
export const createUser = async (data: IUser) =>
  api.post("/users", { ...data });
export const updateUser = async (data: IUser) =>
  api.put(`/users/${data.email}`, data);
export const deleteUser = async (userId: number) =>
  api.delete(`/users/${userId}`);

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
