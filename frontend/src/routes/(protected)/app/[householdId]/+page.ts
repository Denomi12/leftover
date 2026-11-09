import {
  FOOD_ITEMS_DEPENDENCY,
  foodItemApi,
  isDefaultFoodItemQuery,
  parseFoodItemQuery,
} from '#lib/features/food-item/index.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, depends, url }) => {
  depends(FOOD_ITEMS_DEPENDENCY);
  const { household } = await parent();
  const foodQuery = parseFoodItemQuery(url.searchParams);
  const [foodItems, listedFoodItems] = await Promise.all([
    foodItemApi.list(household.id, {}, fetch),
    isDefaultFoodItemQuery(foodQuery) ? null : foodItemApi.list(household.id, foodQuery, fetch),
  ]);
  return { foodItems, listedFoodItems: listedFoodItems ?? foodItems, foodQuery };
};
