import { api } from '#lib/shared/lib/api.js';
import type { CreatePlannedMealPayload, PlannedMeal } from '../types/planned-meal.js';

const plannedMealsPath = (householdId: string) => `/households/${householdId}/planned-meals`;

export const plannedMealApi = {
  list: (householdId: string, fetchFn?: typeof fetch) =>
    api<PlannedMeal[]>(plannedMealsPath(householdId), { fetch: fetchFn }),
  create: (householdId: string, body: CreatePlannedMealPayload) =>
    api<PlannedMeal>(plannedMealsPath(householdId), { method: 'POST', body }),
  complete: (householdId: string, mealId: string) =>
    api<PlannedMeal>(`${plannedMealsPath(householdId)}/${mealId}/complete`, { method: 'POST' }),
};
