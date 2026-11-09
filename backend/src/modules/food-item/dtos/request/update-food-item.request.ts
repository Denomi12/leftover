import { PartialType } from '@nestjs/swagger';
import { CreateFoodItemRequest } from './create-food-item.request.js';

export class UpdateFoodItemRequest extends PartialType(CreateFoodItemRequest) {}
