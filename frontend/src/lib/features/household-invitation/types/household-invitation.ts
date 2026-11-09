import type { HouseholdRole } from '#lib/features/household/index.js';

export type InvitableRole = Exclude<HouseholdRole, 'OWNER'>;

export interface InvitationUser {
  id: string;
  name: string;
  email: string;
}

export interface HouseholdInvitation {
  id: string;
  role: HouseholdRole;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  invitedUser: InvitationUser;
  createdAt: string;
}

export interface ReceivedInvitation {
  id: string;
  role: HouseholdRole;
  household: { id: string; name: string };
  invitedBy: InvitationUser;
  createdAt: string;
}

export interface CreateInvitationPayload {
  email: string;
  role: InvitableRole;
}
