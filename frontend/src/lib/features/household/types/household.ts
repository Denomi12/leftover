export type HouseholdRole = 'OWNER' | 'MEMBER' | 'GUEST';

export interface Household {
  id: string;
  name: string;
  role: HouseholdRole;
  memberCount: number;
  createdAt: string;
}

export interface HouseholdMember {
  id: string;
  role: HouseholdRole;
  user: { id: string; name: string; email: string };
}

export interface CreateHouseholdPayload {
  name: string;
}
