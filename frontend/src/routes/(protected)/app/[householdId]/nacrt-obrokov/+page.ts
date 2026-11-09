import { PLANNED_MEALS_DEPENDENCY, plannedMealApi } from '#lib/features/planned-meal/index.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, depends }) => {
  depends(PLANNED_MEALS_DEPENDENCY);
  const { household } = await parent();
  return { meals: await plannedMealApi.list(household.id, fetch) };
};
