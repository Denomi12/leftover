import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
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
import { FOOD_ITEM_ID_PARAM } from '../constants/food-item.constants.js';
import {
  CreateFoodItemRequest,
  FoodItemResponse,
  GetFoodItemsRequest,
  UpdateFoodItemRequest,
} from '../dtos/index.js';
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
    @Query() query: GetFoodItemsRequest,
  ): Promise<FoodItemResponse[]> {
    return this.foodItemService.getFoodItems(membership.householdId, query);
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

  @Patch(`:${FOOD_ITEM_ID_PARAM}`)
  @HouseholdRoles(HouseholdRole.Owner, HouseholdRole.Member)
  @ApiParam({ name: FOOD_ITEM_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: FoodItemResponse })
  @ApiBadRequestResponse({ description: 'Invalid food item data' })
  @ApiForbiddenResponse({ description: 'Guests cannot edit food items' })
  @ApiNotFoundResponse({ description: 'Food item does not exist in this household' })
  updateFoodItem(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
    @Param(FOOD_ITEM_ID_PARAM, ParseUUIDPipe) foodItemId: string,
    @Body() body: UpdateFoodItemRequest,
  ): Promise<FoodItemResponse> {
    return this.foodItemService.updateFoodItem(membership.householdId, foodItemId, body);
  }

  @Delete(`:${FOOD_ITEM_ID_PARAM}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @HouseholdRoles(HouseholdRole.Owner, HouseholdRole.Member)
  @ApiParam({ name: FOOD_ITEM_ID_PARAM, format: 'uuid' })
  @ApiNoContentResponse()
  @ApiForbiddenResponse({ description: 'Guests cannot delete food items' })
  @ApiNotFoundResponse({ description: 'Food item does not exist in this household' })
  deleteFoodItem(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
    @Param(FOOD_ITEM_ID_PARAM, ParseUUIDPipe) foodItemId: string,
  ): Promise<void> {
    return this.foodItemService.deleteFoodItem(membership.householdId, foodItemId);
  }
}
