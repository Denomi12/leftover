import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
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
import {
  CreateHouseholdInvitationRequest,
  HouseholdInvitationResponse,
  InvitationUserResponse,
  SearchInvitableUsersRequest,
} from '../dtos/index.js';
import { HouseholdInvitationService } from '../services/household-invitation.service.js';

@ApiTags('household invitations')
@ApiBearerAuth()
@ApiParam({ name: HOUSEHOLD_ID_PARAM, format: 'uuid' })
@ApiNotFoundResponse({ description: 'Household does not exist or the user is not a member' })
@ApiForbiddenResponse({ description: 'Only the household owner can manage invitations' })
@UseGuards(JwtAuthGuard, HouseholdGuard)
@HouseholdRoles(HouseholdRole.Owner)
@Controller(`households/:${HOUSEHOLD_ID_PARAM}/invitations`)
export class HouseholdInvitationController {
  constructor(private readonly invitationService: HouseholdInvitationService) {}

  @Get('users')
  @ApiOkResponse({ type: InvitationUserResponse, isArray: true })
  searchInvitableUsers(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
    @Query() { query }: SearchInvitableUsersRequest,
  ): Promise<InvitationUserResponse[]> {
    return this.invitationService.searchInvitableUsers(membership.householdId, query);
  }

  @Get()
  @ApiOkResponse({ type: HouseholdInvitationResponse, isArray: true })
  getPendingInvitations(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
  ): Promise<HouseholdInvitationResponse[]> {
    return this.invitationService.getPendingInvitationsOfHousehold(membership.householdId);
  }

  @Post()
  @ApiCreatedResponse({ type: HouseholdInvitationResponse })
  @ApiNotFoundResponse({ description: 'User with this email does not exist' })
  @ApiConflictResponse({
    description: 'User is already a member or already has a pending invitation',
  })
  createInvitation(
    @CurrentHouseholdMember() membership: HouseholdMemberEntity,
    @Body() body: CreateHouseholdInvitationRequest,
  ): Promise<HouseholdInvitationResponse> {
    return this.invitationService.createInvitation(membership, body);
  }
}
