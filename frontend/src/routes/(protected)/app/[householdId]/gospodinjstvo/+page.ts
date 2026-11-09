import { householdApi } from '#lib/features/household/index.js';
import {
  HOUSEHOLD_INVITATIONS_DEPENDENCY,
  type HouseholdInvitation,
  householdInvitationApi,
} from '#lib/features/household-invitation/index.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, depends }) => {
  depends(HOUSEHOLD_INVITATIONS_DEPENDENCY);
  const { household } = await parent();

  const [members, invitations] = await Promise.all([
    householdApi.members(household.id, fetch),
    household.role === 'OWNER'
      ? householdInvitationApi.listPending(household.id, fetch)
      : Promise.resolve<HouseholdInvitation[]>([]),
  ]);

  return { members, invitations };
};
