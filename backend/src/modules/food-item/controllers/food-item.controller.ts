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
import { CreateFoodItemRequest, FoodItemResponse } from '../dtos/index.js';
import { FoodItemService } from '../services/food-item.service.js';

@ApiTags('food items')
@ApiBearerAuth()
@ApiParam({ name: HOUSEHOLD_ID_PARAM, format: 'uuid' })
@ApiNotFoundResponse({ description: 'Household does not exist or the user is not a member' })
@UseGuards(JwtAuthGuard, HouseholdGuard)
@Controller(`households/:${HOUSEHOLD_ID_PARAM}/food-items`)
export class FoodItemController {
  constructor(private readonly foodItemService: FoodItemService) {}

  @Get()
  @ApiOkResponse({ type: FoodItemResponse, isArray: true })
  getFoodItems(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
  ): Promise<FoodItemResponse[]> {
    return this.foodItemService.getFoodItems(membership.householdId);
  }

  @Post()
  @HouseholdRoles(HouseholdRole.Owner, HouseholdRole.Member)
  @ApiCreatedResponse({ type: FoodItemResponse })
  @ApiBadRequestResponse({ description: 'Invalid food item data' })
  @ApiForbiddenResponse({ description: 'Guests cannot add food items' })
  createFoodItem(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
    @Body() body: CreateFoodItemRequest,
  ): Promise<FoodItemResponse> {
    return this.foodItemService.createFoodItem(membership.householdId, body);
  }
}
