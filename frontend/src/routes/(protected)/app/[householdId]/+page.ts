import { FOOD_ITEMS_DEPENDENCY, foodItemApi } from '#lib/features/food-item/index.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, depends }) => {
  depends(FOOD_ITEMS_DEPENDENCY);
  const { household } = await parent();
  return { foodItems: await foodItemApi.list(household.id, fetch) };
};
