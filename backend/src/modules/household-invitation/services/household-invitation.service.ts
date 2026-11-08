import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { HouseholdMemberEntity } from '../../../../libs/db/entities/index.js';
import { HouseholdService } from '../../household/services/household.service.js';
import type { HouseholdResponse } from '../../household/dtos/index.js';
import { UNIQUE_VIOLATION_CODE } from '../constants/household-invitation.constants.js';
import {
  CreateHouseholdInvitationRequest,
  HouseholdInvitationResponse,
  InvitationUserResponse,
  ReceivedInvitationResponse,
} from '../dtos/index.js';
import {
  toHouseholdInvitationResponse,
  toInvitationUserResponse,
  toReceivedInvitationResponse,
} from '../mappers/household-invitation.mapper.js';
import { HouseholdInvitationRepository } from '../repository/household-invitation.repository.js';

@Injectable()
export class HouseholdInvitationService {
  constructor(
    private readonly invitationRepository: HouseholdInvitationRepository,
    private readonly householdService: HouseholdService,
  ) {}

  async searchInvitableUsers(
    householdId: string,
    query: string,
  ): Promise<InvitationUserResponse[]> {
    const users = await this.invitationRepository.searchInvitableUsers(householdId, query);
    return users.map(toInvitationUserResponse);
  }

  async createInvitation(
    membership: HouseholdMemberEntity,
    { email, role }: CreateHouseholdInvitationRequest,
  ): Promise<HouseholdInvitationResponse> {
    const { householdId, userId: invitedByUserId } = membership;

    const invitedUser = await this.invitationRepository.findUserByEmail(email);
    if (!invitedUser) {
      throw new NotFoundException('User with this email does not exist');
    }

    if (await this.invitationRepository.isMember(householdId, invitedUser.id)) {
      throw new ConflictException('User is already a member of the household');
    }

    if (await this.invitationRepository.hasPendingInvitation(householdId, invitedUser.id)) {
      throw new ConflictException('User already has a pending invitation to this household');
    }

    try {
      const invitation = await this.invitationRepository.create({
        householdId,
        invitedUserId: invitedUser.id,
        invitedByUserId,
        role,
      });
      invitation.invitedUser = invitedUser;
      return toHouseholdInvitationResponse(invitation);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('User already has a pending invitation to this household');
      }
      throw error;
    }
  }

  async getPendingInvitationsOfHousehold(
    householdId: string,
  ): Promise<HouseholdInvitationResponse[]> {
    const invitations = await this.invitationRepository.findPendingOfHousehold(householdId);
    return invitations.map(toHouseholdInvitationResponse);
  }

  async getPendingInvitationsOfUser(userId: string): Promise<ReceivedInvitationResponse[]> {
    const invitations = await this.invitationRepository.findPendingOfUser(userId);
    return invitations.map(toReceivedInvitationResponse);
  }

  async acceptInvitation(invitationId: string, userId: string): Promise<HouseholdResponse> {
    const membership = await this.invitationRepository.accept(invitationId, userId);
    if (!membership) {
      throw new NotFoundException('Invitation not found');
    }
    return this.householdService.getHousehold(membership);
  }

  async declineInvitation(invitationId: string, userId: string): Promise<void> {
    const declined = await this.invitationRepository.decline(invitationId, userId);
    if (!declined) {
      throw new NotFoundException('Invitation not found');
    }
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code === UNIQUE_VIOLATION_CODE
  );
}
