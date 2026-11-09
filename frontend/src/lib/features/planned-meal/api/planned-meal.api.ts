import { api } from '#lib/shared/lib/api.js';
import type { CreatePlannedMealPayload, PlannedMeal } from '../types/planned-meal.js';

const plannedMealPath = (householdId: string, mealId: string) =>
  `/households/${householdId}/planned-meals/${mealId}`;

const plannedMealsPath = (householdId: string) => `/households/${householdId}/planned-meals`;

export const plannedMealApi = {
  list: (householdId: string, fetchFn?: typeof fetch) =>
    api<PlannedMeal[]>(plannedMealsPath(householdId), { fetch: fetchFn }),
  create: (householdId: string, body: CreatePlannedMealPayload) =>
    api<PlannedMeal>(plannedMealsPath(householdId), { method: 'POST', body }),
  update: (householdId: string, mealId: string, body: Partial<CreatePlannedMealPayload>) =>
    api<PlannedMeal>(plannedMealPath(householdId, mealId), { method: 'PATCH', body }),
  remove: (householdId: string, mealId: string) =>
    api<void>(plannedMealPath(householdId, mealId), { method: 'DELETE' }),
  complete: (householdId: string, mealId: string) =>
    api<PlannedMeal>(`${plannedMealPath(householdId, mealId)}/complete`, { method: 'POST' }),
};
