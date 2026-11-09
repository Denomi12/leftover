import { PartialType } from '@nestjs/swagger';
import { CreatePlannedMealRequest } from './create-planned-meal.request.js';

export class UpdatePlannedMealRequest extends PartialType(CreatePlannedMealRequest) {}
