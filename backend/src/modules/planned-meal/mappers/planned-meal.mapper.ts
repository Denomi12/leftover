import type {
  MealIngredientEntity,
  PlannedMealEntity,
} from '../../../../libs/db/entities/index.js';
import { IngredientStockStatus } from '../../../utils/types/ingredient-stock-status.type.js';
import type { MealIngredientResponse, PlannedMealResponse } from '../dtos/index.js';
import { getMissingQuantity, type Stock } from '../utils/stock.js';

function toMealIngredientResponse(
  ingredient: MealIngredientEntity,
  stock: Stock,
): MealIngredientResponse {
  const missingQuantity = getMissingQuantity(stock, ingredient);
  return {
    id: ingredient.id,
    name: ingredient.name,
    quantity: Number(ingredient.quantity),
    unit: ingredient.unit,
    stockStatus:
      missingQuantity > 0 ? IngredientStockStatus.Missing : IngredientStockStatus.InStock,
    missingQuantity,
  };
}

export function toPlannedMealResponse(
  { id, name, date, completed, ingredients = [] }: PlannedMealEntity,
  stock: Stock,
): PlannedMealResponse {
  return {
    id,
    name,
    date,
    completed,
    ingredients: ingredients.map((ingredient) => toMealIngredientResponse(ingredient, stock)),
  };
}
