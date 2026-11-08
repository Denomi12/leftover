import { redirect } from '@sveltejs/kit';
import { auth } from '#lib/features/auth/index.js';
import { householdPath, lastHousehold } from '#lib/features/household/index.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { households } = await parent();
  if (households.length === 0) return;

  const lastId = auth.user ? lastHousehold.get(auth.user.id) : null;
  const target = households.find((household) => household.id === lastId) ?? households[0];
  redirect(307, householdPath(target.id));
};
