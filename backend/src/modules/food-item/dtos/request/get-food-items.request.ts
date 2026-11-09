import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { FoodItemSort } from '../../../../utils/types/food-item-sort.type.js';
import { trimString } from '../../../auth/dtos/request/auth.transforms.js';
import { FOOD_ITEM_NAME_MAX_LENGTH } from '../../constants/food-item.constants.js';

export class GetFoodItemsRequest {
  @ApiPropertyOptional({
    example: 'jog',
    description: 'Part of the food item name',
    maxLength: FOOD_ITEM_NAME_MAX_LENGTH,
  })
  @IsOptional()
  @Transform(trimString)
  @IsString()
  @MaxLength(FOOD_ITEM_NAME_MAX_LENGTH)
  search?: string;

  @ApiPropertyOptional({ enum: FoodItemSort, default: FoodItemSort.ExpirationDate })
  @IsOptional()
  @IsEnum(FoodItemSort)
  sort?: FoodItemSort;
}
