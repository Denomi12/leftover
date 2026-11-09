import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { HouseholdMemberEntity } from '../../../../libs/db/entities/index.js';
import { CurrentHouseholdMember, HouseholdRoles } from '../../../utils/decorators/index.js';
import { HouseholdGuard, JwtAuthGuard } from '../../../utils/guards/index.js';
import { HOUSEHOLD_ID_PARAM } from '../../../utils/constants/index.js';
import { HouseholdRole } from '../../../utils/types/household-role.type.js';
import { CreatePlannedMealRequest, PlannedMealResponse } from '../dtos/index.js';
import { PlannedMealService } from '../services/planned-meal.service.js';

@ApiTags('planned meals')
@ApiBearerAuth()
@ApiParam({ name: HOUSEHOLD_ID_PARAM, format: 'uuid' })
@ApiNotFoundResponse({ description: 'Household does not exist or the user is not a member' })
@UseGuards(JwtAuthGuard, HouseholdGuard)
@Controller(`households/:${HOUSEHOLD_ID_PARAM}/planned-meals`)
export class PlannedMealController {
  constructor(private readonly plannedMealService: PlannedMealService) {}

  @Get()
  @ApiOkResponse({ type: PlannedMealResponse, isArray: true })
  getPlannedMeals(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
  ): Promise<PlannedMealResponse[]> {
    return this.plannedMealService.getPlannedMeals(membership.householdId);
  }

  @Post()
  @HouseholdRoles(HouseholdRole.Owner, HouseholdRole.Member)
  @ApiCreatedResponse({ type: PlannedMealResponse })
  @ApiBadRequestResponse({ description: 'Invalid planned meal data' })
  @ApiForbiddenResponse({ description: 'Guests cannot plan meals' })
  createPlannedMeal(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
    @Body() body: CreatePlannedMealRequest,
  ): Promise<PlannedMealResponse> {
    return this.plannedMealService.createPlannedMeal(membership.householdId, body);
  }
}
