const TOKEN_KEY = 'leftover.accessToken';

export const authTokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  },
};
