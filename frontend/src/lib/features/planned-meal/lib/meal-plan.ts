import { currentDate } from '#lib/features/food-item/index.js';
import type { PlannedMeal } from '../types/planned-meal.js';

export const PLANNED_MEALS_DEPENDENCY = 'app:planned-meals';

export interface MealDay {
  date: string;
  meals: PlannedMeal[];
}

export function groupMealsByDay(meals: PlannedMeal[]): MealDay[] {
  const days = new Map<string, PlannedMeal[]>();
  for (const meal of meals) {
    days.set(meal.date, [...(days.get(meal.date) ?? []), meal]);
  }
  return [...days].map(([date, dayMeals]) => ({ date, meals: dayMeals }));
}

const weekdayFormat = new Intl.DateTimeFormat('sl-SI', { weekday: 'long', timeZone: 'UTC' });

export function formatDay(date: string) {
  const today = currentDate();
  const [year, month, day] = date.split('-').map(Number);
  const weekday = weekdayFormat.format(new Date(Date.UTC(year, month - 1, day)));
  const relative =
    date === today.toString()
      ? 'danes'
      : date === today.add({ days: 1 }).toString()
        ? 'jutri'
        : null;

  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    dayMonth: year === today.year ? `${day}. ${month}.` : `${day}. ${month}. ${year}`,
    relative,
    past: date < today.toString(),
  };
}

function plural(count: number, [one, two, few, many]: [string, string, string, string]) {
  const lastTwo = count % 100;
  if (lastTwo === 1) return `${count} ${one}`;
  if (lastTwo === 2) return `${count} ${two}`;
  if (lastTwo === 3 || lastTwo === 4) return `${count} ${few}`;
  return `${count} ${many}`;
}

export const formatMealCount = (count: number) =>
  plural(count, ['obrok', 'obroka', 'obroki', 'obrokov']);

export const formatIngredientCount = (count: number) =>
  plural(count, ['sestavina', 'sestavini', 'sestavine', 'sestavin']);
