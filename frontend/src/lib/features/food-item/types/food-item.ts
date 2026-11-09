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

export type ExpirationStatus = 'EXPIRED' | 'EXPIRING_SOON' | 'FRESH';

export type ExpirationWarning = Exclude<ExpirationStatus, 'FRESH'>;

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: FoodUnit;
  category: FoodCategory;
  expirationDate: string | null;
  expirationStatus: ExpirationStatus | null;
}

export interface CreateFoodItemPayload {
  name: string;
  quantity: number;
  unit: FoodUnit;
  category: FoodCategory;
  expirationDate: string | null;
}

export type UpdateFoodItemPayload = Partial<CreateFoodItemPayload>;
