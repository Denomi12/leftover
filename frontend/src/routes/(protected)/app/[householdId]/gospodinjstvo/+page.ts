import {
  HOUSEHOLD_INVITATIONS_DEPENDENCY,
  type HouseholdInvitation,
  householdInvitationApi,
} from '#lib/features/household-invitation/index.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, depends }) => {
  depends(HOUSEHOLD_INVITATIONS_DEPENDENCY);
  const { household } = await parent();

  const invitations: HouseholdInvitation[] =
    household.role === 'OWNER' ? await householdInvitationApi.listPending(household.id, fetch) : [];

  return { invitations };
};
