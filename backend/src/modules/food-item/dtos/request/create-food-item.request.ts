import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FoodCategory } from '../../../../utils/types/food-category.type.js';
import { FoodUnit } from '../../../../utils/types/food-unit.type.js';
import { trimString } from '../../../auth/dtos/request/auth.transforms.js';
import {
  FOOD_ITEM_NAME_MAX_LENGTH,
  FOOD_ITEM_NAME_MIN_LENGTH,
  FOOD_ITEM_QUANTITY_MAX,
  FOOD_ITEM_QUANTITY_MAX_DECIMAL_PLACES,
  ISO_DATE_PATTERN,
} from '../../constants/food-item.constants.js';

export class CreateFoodItemRequest {
  @ApiProperty({
    example: 'Jogurt',
    minLength: FOOD_ITEM_NAME_MIN_LENGTH,
    maxLength: FOOD_ITEM_NAME_MAX_LENGTH,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(FOOD_ITEM_NAME_MIN_LENGTH)
  @MaxLength(FOOD_ITEM_NAME_MAX_LENGTH)
  name!: string;

  @ApiProperty({
    example: 1.5,
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

  @ApiProperty({ enum: FoodUnit, example: FoodUnit.Piece })
  @IsEnum(FoodUnit)
  unit!: FoodUnit;

  @ApiProperty({ enum: FoodCategory, example: FoodCategory.Dairy })
  @IsEnum(FoodCategory)
  category!: FoodCategory;

  @ApiPropertyOptional({
    type: String,
    format: 'date',
    nullable: true,
    example: '2026-11-20',
  })
  @IsOptional()
  @Matches(ISO_DATE_PATTERN, { message: 'expirationDate must be in YYYY-MM-DD format' })
  @IsISO8601({ strict: true }, { message: 'expirationDate must be a valid date' })
  expirationDate?: string | null;
}
