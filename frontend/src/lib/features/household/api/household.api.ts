import { api } from '#lib/shared/lib/api.js';
import type { CreateHouseholdPayload, Household } from '../types/household.js';

export const householdApi = {
  list: (fetchFn?: typeof fetch) => api<Household[]>('/households', { fetch: fetchFn }),
  create: (body: CreateHouseholdPayload) => api<Household>('/households', { method: 'POST', body }),
};
