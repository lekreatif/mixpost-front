// authService.ts
import axios from "axios";

class AuthService {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  public async refreshToken(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise(resolve => {
        this.refreshSubscribers.push(resolve);
      });
    }

    this.isRefreshing = true;

    try {
      const response = await axios.post(
        "/api/auth/refresh",
        {},
        { withCredentials: true }
      );
      const { accessToken } = response.data;

      this.isRefreshing = false;
      this.refreshSubscribers.forEach(callback => callback(accessToken));
      this.refreshSubscribers = [];

      return accessToken;
    } catch (error) {
      this.isRefreshing = false;
      this.refreshSubscribers = [];
      throw error;
    }
  }
}

export const authService = new AuthService();
