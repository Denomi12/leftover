import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsISO8601,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { trimString } from '../../../auth/dtos/request/auth.transforms.js';
import { ISO_DATE_PATTERN } from '../../../food-item/constants/food-item.constants.js';
import {
  PLANNED_MEAL_INGREDIENTS_MAX,
  PLANNED_MEAL_INGREDIENTS_MIN,
  PLANNED_MEAL_NAME_MAX_LENGTH,
  PLANNED_MEAL_NAME_MIN_LENGTH,
} from '../../constants/planned-meal.constants.js';
import { CreateMealIngredientRequest } from './create-meal-ingredient.request.js';

export class CreatePlannedMealRequest {
  @ApiProperty({
    example: 'Palačinke',
    minLength: PLANNED_MEAL_NAME_MIN_LENGTH,
    maxLength: PLANNED_MEAL_NAME_MAX_LENGTH,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(PLANNED_MEAL_NAME_MIN_LENGTH)
  @MaxLength(PLANNED_MEAL_NAME_MAX_LENGTH)
  name!: string;

  @ApiProperty({ type: String, format: 'date', example: '2026-11-20' })
  @Matches(ISO_DATE_PATTERN, { message: 'date must be in YYYY-MM-DD format' })
  @IsISO8601({ strict: true }, { message: 'date must be a valid date' })
  date!: string;

  @ApiProperty({
    type: CreateMealIngredientRequest,
    isArray: true,
    minItems: PLANNED_MEAL_INGREDIENTS_MIN,
    maxItems: PLANNED_MEAL_INGREDIENTS_MAX,
  })
  @IsArray()
  @ArrayMinSize(PLANNED_MEAL_INGREDIENTS_MIN, {
    message: 'meal must have at least one ingredient',
  })
  @ArrayMaxSize(PLANNED_MEAL_INGREDIENTS_MAX)
  @ValidateNested({ each: true })
  @Type(() => CreateMealIngredientRequest)
  ingredients!: CreateMealIngredientRequest[];
}
