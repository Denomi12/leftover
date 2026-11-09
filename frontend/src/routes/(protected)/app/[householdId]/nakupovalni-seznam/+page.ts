import { SHOPPING_ITEMS_DEPENDENCY, shoppingItemApi } from '#lib/features/shopping-item/index.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, depends }) => {
  depends(SHOPPING_ITEMS_DEPENDENCY);
  const { household } = await parent();
  return { items: await shoppingItemApi.list(household.id, fetch) };
};
