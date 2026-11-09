import type { Component } from 'svelte';
import AmphoraIcon from '@lucide/svelte/icons/amphora';
import AppleIcon from '@lucide/svelte/icons/apple';
import CarrotIcon from '@lucide/svelte/icons/carrot';
import CookingPotIcon from '@lucide/svelte/icons/cooking-pot';
import CupSodaIcon from '@lucide/svelte/icons/cup-soda';
import DrumstickIcon from '@lucide/svelte/icons/drumstick';
import EggIcon from '@lucide/svelte/icons/egg';
import MilkIcon from '@lucide/svelte/icons/milk';
import SandwichIcon from '@lucide/svelte/icons/sandwich';
import type { FoodCategory } from '../types/food-item.js';

export interface FoodCategoryOption {
  value: FoodCategory;
  label: string;
  icon: Component;
}

export const FOOD_CATEGORIES: Record<FoodCategory, FoodCategoryOption> = {
  FRUIT: { value: 'FRUIT', label: 'Sadje', icon: AppleIcon },
  DAIRY: { value: 'DAIRY', label: 'Mlečni izdelki', icon: MilkIcon },
  MEAT_AND_FISH: { value: 'MEAT_AND_FISH', label: 'Meso in ribe', icon: DrumstickIcon },
  PREPARED_MEALS: { value: 'PREPARED_MEALS', label: 'Pripravljeni obroki', icon: CookingPotIcon },
  SPREADS: { value: 'SPREADS', label: 'Namazi', icon: SandwichIcon },
  VEGETABLES: { value: 'VEGETABLES', label: 'Zelenjava', icon: CarrotIcon },
  EGGS: { value: 'EGGS', label: 'Jajca', icon: EggIcon },
  SAUCES: { value: 'SAUCES', label: 'Omake', icon: AmphoraIcon },
  DRINKS: { value: 'DRINKS', label: 'Pijače', icon: CupSodaIcon },
};

export const FOOD_CATEGORY_OPTIONS = Object.values(FOOD_CATEGORIES);

export const FRIDGE_SHELVES: FoodCategory[][] = [
  ['FRUIT', 'DAIRY'],
  ['VEGETABLES', 'SPREADS'],
  ['PREPARED_MEALS'],
];

export const FRIDGE_DRAWER: FoodCategory = 'MEAT_AND_FISH';

export const FRIDGE_DOOR: FoodCategory[] = ['EGGS', 'SAUCES', 'DRINKS'];
