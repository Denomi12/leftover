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
import { SHOPPING_ITEM_ID_PARAM } from '../constants/shopping-item.constants.js';
import {
  CreateShoppingItemRequest,
  ShoppingItemResponse,
  UpdateShoppingItemRequest,
} from '../dtos/index.js';
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

  @Post()
  @HouseholdRoles(HouseholdRole.Owner, HouseholdRole.Member)
  @ApiCreatedResponse({ type: ShoppingItemResponse })
  @ApiBadRequestResponse({ description: 'Invalid shopping item data' })
  @ApiForbiddenResponse({ description: 'Guests cannot add shopping items' })
  createShoppingItem(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
    @Body() body: CreateShoppingItemRequest,
  ): Promise<ShoppingItemResponse> {
    return this.shoppingItemService.createShoppingItem(membership.householdId, body);
  }

  @Patch(`:${SHOPPING_ITEM_ID_PARAM}`)
  @ApiParam({ name: SHOPPING_ITEM_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: ShoppingItemResponse })
  @ApiBadRequestResponse({ description: 'Invalid shopping item data' })
  @ApiForbiddenResponse({
    description:
      'Guests can only change completed; items from the meal plan can only change completed',
  })
  @ApiNotFoundResponse({ description: 'Shopping item does not exist in this household' })
  updateShoppingItem(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
    @Param(SHOPPING_ITEM_ID_PARAM, ParseUUIDPipe) shoppingItemId: string,
    @Body() body: UpdateShoppingItemRequest,
  ): Promise<ShoppingItemResponse> {
    return this.shoppingItemService.updateShoppingItem(membership, shoppingItemId, body);
  }

  @Delete(`:${SHOPPING_ITEM_ID_PARAM}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @HouseholdRoles(HouseholdRole.Owner, HouseholdRole.Member)
  @ApiParam({ name: SHOPPING_ITEM_ID_PARAM, format: 'uuid' })
  @ApiNoContentResponse()
  @ApiForbiddenResponse({
    description: 'Guests cannot delete shopping items; items from the meal plan cannot be deleted',
  })
  @ApiNotFoundResponse({ description: 'Shopping item does not exist in this household' })
  deleteShoppingItem(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
    @Param(SHOPPING_ITEM_ID_PARAM, ParseUUIDPipe) shoppingItemId: string,
  ): Promise<void> {
    return this.shoppingItemService.deleteShoppingItem(membership.householdId, shoppingItemId);
  }
}
