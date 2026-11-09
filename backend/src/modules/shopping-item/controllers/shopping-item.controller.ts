import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { HouseholdMemberEntity } from '../../../../libs/db/entities/index.js';
import { CurrentHouseholdMember } from '../../../utils/decorators/index.js';
import { HouseholdGuard, JwtAuthGuard } from '../../../utils/guards/index.js';
import { HOUSEHOLD_ID_PARAM } from '../../../utils/constants/index.js';
import { SHOPPING_ITEM_ID_PARAM } from '../constants/shopping-item.constants.js';
import { ShoppingItemResponse, UpdateShoppingItemRequest } from '../dtos/index.js';
import { ShoppingItemService } from '../services/shopping-item.service.js';

@ApiTags('shopping items')
@ApiBearerAuth()
@ApiParam({ name: HOUSEHOLD_ID_PARAM, format: 'uuid' })
@ApiNotFoundResponse({ description: 'Household does not exist or the user is not a member' })
@UseGuards(JwtAuthGuard, HouseholdGuard)
@Controller(`households/:${HOUSEHOLD_ID_PARAM}/shopping-items`)
export class ShoppingItemController {
  constructor(private readonly shoppingItemService: ShoppingItemService) {}

  @Get()
  @ApiOkResponse({ type: ShoppingItemResponse, isArray: true })
  getShoppingItems(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
  ): Promise<ShoppingItemResponse[]> {
    return this.shoppingItemService.getShoppingItems(membership.householdId);
  }

  @Patch(`:${SHOPPING_ITEM_ID_PARAM}`)
  @ApiParam({ name: SHOPPING_ITEM_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: ShoppingItemResponse })
  @ApiBadRequestResponse({ description: 'Invalid shopping item data' })
  @ApiNotFoundResponse({ description: 'Shopping item does not exist in this household' })
  updateShoppingItem(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
    @Param(SHOPPING_ITEM_ID_PARAM, ParseUUIDPipe) shoppingItemId: string,
    @Body() body: UpdateShoppingItemRequest,
  ): Promise<ShoppingItemResponse> {
    return this.shoppingItemService.updateShoppingItem(
      membership.householdId,
      shoppingItemId,
      body,
    );
  }
}
