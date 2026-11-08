import { HOUSEHOLDS_DEPENDENCY, householdApi } from '#lib/features/household/index.js';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, depends }) => {
  depends(HOUSEHOLDS_DEPENDENCY);
  return { households: await householdApi.list(fetch) };
};
