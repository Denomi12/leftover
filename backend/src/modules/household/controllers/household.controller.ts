import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { HouseholdMemberEntity } from '../../../../libs/db/entities/index.js';
import { CurrentHouseholdMember, User } from '../../../utils/decorators/index.js';
import { HouseholdGuard, JwtAuthGuard } from '../../../utils/guards/index.js';
import { HOUSEHOLD_ID_PARAM } from '../../../utils/constants/index.js';
import type { JwtPayload } from '../../auth/interfaces/index.js';
import { CreateHouseholdRequest, HouseholdResponse } from '../dtos/index.js';
import { HouseholdService } from '../services/household.service.js';

@ApiTags('households')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, HouseholdGuard)
@Controller('households')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Post()
  @ApiCreatedResponse({ type: HouseholdResponse })
  createHousehold(
    @User() user: JwtPayload,
    @Body() body: CreateHouseholdRequest,
  ): Promise<HouseholdResponse> {
    return this.householdService.createHousehold(user.sub, body);
  }

  @Get()
  @ApiOkResponse({ type: HouseholdResponse, isArray: true })
  getHouseholds(@User() user: JwtPayload): Promise<HouseholdResponse[]> {
    return this.householdService.getHouseholdsOfUser(user.sub);
  }

  @Get(`:${HOUSEHOLD_ID_PARAM}`)
  @ApiParam({ name: HOUSEHOLD_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: HouseholdResponse })
  @ApiNotFoundResponse({ description: 'Household does not exist or the user is not a member' })
  getHousehold(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
  ): Promise<HouseholdResponse> {
    return this.householdService.getHousehold(membership);
  }
}
