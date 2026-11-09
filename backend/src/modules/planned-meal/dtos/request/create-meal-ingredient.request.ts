import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsPositive, IsString, Max, MaxLength, MinLength } from 'class-validator';
import { FoodUnit } from '../../../../utils/types/food-unit.type.js';
import { trimString } from '../../../auth/dtos/request/auth.transforms.js';
import {
  FOOD_ITEM_NAME_MAX_LENGTH,
  FOOD_ITEM_NAME_MIN_LENGTH,
  FOOD_ITEM_QUANTITY_MAX,
  FOOD_ITEM_QUANTITY_MAX_DECIMAL_PLACES,
} from '../../../food-item/constants/food-item.constants.js';

export class CreateMealIngredientRequest {
  @ApiProperty({
    example: 'Moka',
    minLength: FOOD_ITEM_NAME_MIN_LENGTH,
    maxLength: FOOD_ITEM_NAME_MAX_LENGTH,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(FOOD_ITEM_NAME_MIN_LENGTH)
  @MaxLength(FOOD_ITEM_NAME_MAX_LENGTH)
  name!: string;

  @ApiProperty({
    example: 200,
    minimum: 0,
    exclusiveMinimum: true,
    maximum: FOOD_ITEM_QUANTITY_MAX,
  })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: FOOD_ITEM_QUANTITY_MAX_DECIMAL_PLACES,
    },
    {
      message: `quantity must be a number with at most ${FOOD_ITEM_QUANTITY_MAX_DECIMAL_PLACES} decimal places`,
    },
  )
  @IsPositive({ message: 'quantity must be greater than 0' })
  @Max(FOOD_ITEM_QUANTITY_MAX)
  quantity!: number;

  @ApiProperty({ enum: FoodUnit, example: FoodUnit.Gram })
  @IsEnum(FoodUnit)
  unit!: FoodUnit;
}
