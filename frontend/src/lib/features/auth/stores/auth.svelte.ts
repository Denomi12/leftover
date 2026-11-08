import { authTokenStore } from '#lib/shared/lib/auth-token-store.js';
import { authApi } from '../api/auth.api';
import type { AuthSession, AuthUser } from '../types/auth';

class AuthStore {
  user = $state<AuthUser | null>(null);
  #initPromise: Promise<void> | null = null;

  get isAuthenticated(): boolean {
    return this.user !== null;
  }

  init(fetchFn?: typeof fetch): Promise<void> {
    this.#initPromise ??= this.#restore(fetchFn);
    return this.#initPromise;
  }

  setSession({ accessToken, user }: AuthSession): void {
    authTokenStore.set(accessToken);
    this.user = user;
    this.#initPromise = Promise.resolve();
  }

  logout(): void {
    authTokenStore.clear();
    this.user = null;
    this.#initPromise = Promise.resolve();
  }

  async #restore(fetchFn?: typeof fetch): Promise<void> {
    if (!authTokenStore.get()) return;

    try {
      this.user = await authApi.me(fetchFn);
    } catch {
      authTokenStore.clear();
      this.user = null;
    }
  }
}

export const auth = new AuthStore();
