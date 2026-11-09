import type { FoodItemQuery, FoodItemSort } from '../types/food-item.js';

export const DEFAULT_FOOD_ITEM_SORT: FoodItemSort = 'EXPIRATION_DATE';
export const FOOD_ITEM_SEARCH_DEBOUNCE_MS = 250;

const SEARCH_PARAM = 'q';
const SORT_PARAM = 'sort';
const SORT_PARAM_VALUES: Record<FoodItemSort, string> = {
  EXPIRATION_DATE: 'rok',
  NAME: 'ime',
};

export function parseFoodItemQuery(params: URLSearchParams): FoodItemQuery {
  const sortParam = params.get(SORT_PARAM);
  const sort =
    (Object.keys(SORT_PARAM_VALUES) as FoodItemSort[]).find(
      (key) => SORT_PARAM_VALUES[key] === sortParam,
    ) ?? DEFAULT_FOOD_ITEM_SORT;
  return { search: params.get(SEARCH_PARAM) ?? '', sort };
}

export const isDefaultFoodItemQuery = ({ search, sort }: FoodItemQuery) =>
  search.trim() === '' && sort === DEFAULT_FOOD_ITEM_SORT;

export function foodItemUrl(url: Pick<URL, 'href'>, { search, sort }: FoodItemQuery): URL {
  const next = new URL(url.href);
  if (search.trim()) next.searchParams.set(SEARCH_PARAM, search);
  else next.searchParams.delete(SEARCH_PARAM);
  if (sort !== DEFAULT_FOOD_ITEM_SORT) next.searchParams.set(SORT_PARAM, SORT_PARAM_VALUES[sort]);
  else next.searchParams.delete(SORT_PARAM);
  return next;
}

export function foodItemSearchParams({ search, sort }: Partial<FoodItemQuery>): URLSearchParams {
  const params = new URLSearchParams();
  const trimmed = search?.trim();
  if (trimmed) params.set('search', trimmed);
  if (sort && sort !== DEFAULT_FOOD_ITEM_SORT) params.set('sort', sort);
  return params;
}
