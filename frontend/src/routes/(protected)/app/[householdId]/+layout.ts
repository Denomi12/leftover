import { error } from '@sveltejs/kit';
import { auth } from '#lib/features/auth/index.js';
import { lastHousehold } from '#lib/features/household/index.js';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, parent }) => {
  const { households } = await parent();
  const household = households.find(({ id }) => id === params.householdId);

  if (!household) {
    error(404, 'Gospodinjstvo ne obstaja ali vanj nimaš dostopa.');
  }

  if (auth.user) {
    lastHousehold.set(auth.user.id, household.id);
  }

  return { household };
};
