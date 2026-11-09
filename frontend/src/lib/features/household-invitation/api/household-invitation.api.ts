import type { Household } from '#lib/features/household/index.js';
import { api } from '#lib/shared/lib/api.js';
import type {
  CreateInvitationPayload,
  HouseholdInvitation,
  InvitationUser,
  ReceivedInvitation,
} from '../types/household-invitation.js';

const householdInvitationsPath = (householdId: string) => `/households/${householdId}/invitations`;

export const householdInvitationApi = {
  searchUsers: (householdId: string, query: string, signal?: AbortSignal) =>
    api<InvitationUser[]>(
      `${householdInvitationsPath(householdId)}/users?${new URLSearchParams({ query })}`,
      { signal },
    ),
  listPending: (householdId: string, fetchFn?: typeof fetch) =>
    api<HouseholdInvitation[]>(householdInvitationsPath(householdId), { fetch: fetchFn }),
  create: (householdId: string, body: CreateInvitationPayload) =>
    api<HouseholdInvitation>(householdInvitationsPath(householdId), { method: 'POST', body }),
  cancel: (householdId: string, invitationId: string) =>
    api<null>(`${householdInvitationsPath(householdId)}/${invitationId}`, { method: 'DELETE' }),
  listReceived: () => api<ReceivedInvitation[]>('/invitations'),
  accept: (invitationId: string) =>
    api<Household>(`/invitations/${invitationId}/accept`, { method: 'POST' }),
  decline: (invitationId: string) =>
    api<null>(`/invitations/${invitationId}/decline`, { method: 'POST' }),
};
