import { UserEntity } from './user.entity.js';
import { HouseholdEntity } from './household.entity.js';
import { HouseholdMemberEntity } from './household-member.entity.js';
import { FoodItemEntity } from './food-item.entity.js';
import { PlannedMealEntity } from './planned-meal.entity.js';
import { MealIngredientEntity } from './meal-ingredient.entity.js';
import { ShoppingItemEntity } from './shopping-item.entity.js';

export {
  UserEntity,
  HouseholdEntity,
  HouseholdMemberEntity,
  FoodItemEntity,
  PlannedMealEntity,
  MealIngredientEntity,
  ShoppingItemEntity,
};

export const ENTITIES = [
  UserEntity,
  HouseholdEntity,
  HouseholdMemberEntity,
  FoodItemEntity,
  PlannedMealEntity,
  MealIngredientEntity,
  ShoppingItemEntity,
];
