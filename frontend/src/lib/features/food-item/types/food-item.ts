export type FoodUnit = 'kos' | 'g' | 'kg' | 'ml' | 'l' | 'porcija';

export type FoodCategory =
  | 'FRUIT'
  | 'DAIRY'
  | 'MEAT_AND_FISH'
  | 'PREPARED_MEALS'
  | 'SPREADS'
  | 'VEGETABLES'
  | 'EGGS'
  | 'SAUCES'
  | 'DRINKS';

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: FoodUnit;
  category: FoodCategory;
  expirationDate: string | null;
}

export interface CreateFoodItemPayload {
  name: string;
  quantity: number;
  unit: FoodUnit;
  category: FoodCategory;
  expirationDate: string | null;
}

export type UpdateFoodItemPayload = Partial<CreateFoodItemPayload>;
