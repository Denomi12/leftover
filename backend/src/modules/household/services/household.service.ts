import { Injectable, NotFoundException } from '@nestjs/common';
import type { HouseholdMemberEntity } from '../../../../libs/db/entities/index.js';
import { HouseholdRole } from '../../../utils/types/household-role.type.js';
import { CreateHouseholdRequest, HouseholdResponse } from '../dtos/index.js';
import { toHouseholdResponse } from '../mappers/household.mapper.js';
import { HouseholdRepository } from '../repository/household.repository.js';

@Injectable()
export class HouseholdService {
  constructor(private readonly householdRepository: HouseholdRepository) {}

  async createHousehold(
    userId: string,
    { name }: CreateHouseholdRequest,
  ): Promise<HouseholdResponse> {
    const household = await this.householdRepository.createWithOwner(name, userId);
    return toHouseholdResponse(household, HouseholdRole.Owner, 1);
  }

  async getHouseholdsOfUser(userId: string): Promise<HouseholdResponse[]> {
    const memberships = await this.householdRepository.findMembershipsOfUser(userId);
    const memberCounts = await this.householdRepository.countMembers(
      memberships.map(({ householdId }) => householdId),
    );

    return memberships.map(({ household, householdId, role }) =>
      toHouseholdResponse(household, role, memberCounts.get(householdId) ?? 0),
    );
  }

  async getHousehold(membership: HouseholdMemberEntity): Promise<HouseholdResponse> {
    const household = await this.householdRepository.findById(membership.householdId);
    if (!household) {
      throw new NotFoundException('Household not found');
    }

    const memberCounts = await this.householdRepository.countMembers([household.id]);
    return toHouseholdResponse(household, membership.role, memberCounts.get(household.id) ?? 0);
  }
}
