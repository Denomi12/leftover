import { api } from '#lib/shared/lib/api.js';
import type { AuthSession, AuthUser, LoginPayload, RegisterPayload } from '../types/auth';

export const authApi = {
  login: (body: LoginPayload) => api<AuthSession>('/auth/login', { method: 'POST', body }),
  register: (body: RegisterPayload) => api<AuthSession>('/auth/register', { method: 'POST', body }),
  me: (fetchFn?: typeof fetch) => api<AuthUser>('/auth/me', { fetch: fetchFn }),
};
