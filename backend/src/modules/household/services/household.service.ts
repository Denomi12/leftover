import { Injectable, NotFoundException } from '@nestjs/common';
import { HouseholdRepository } from '../repository/household.repository.js';
import {
  CreateHouseholdRequest,
  HouseholdResponse,
  UpdateHouseholdRequest,
} from '../dtos/index.js';

@Injectable()
export class HouseholdService {
  constructor(private readonly householdRepository: HouseholdRepository) {}

  createHousehold(body: CreateHouseholdRequest): Promise<HouseholdResponse> {
    return this.householdRepository.create(body);
  }

  getHouseholds(): Promise<HouseholdResponse[]> {
    return this.householdRepository.findAll();
  }

  getHouseholdById(householdId: string): Promise<HouseholdResponse> {
    return this.getExistingHousehold(householdId);
  }

  async updateHousehold(
    householdId: string,
    body: UpdateHouseholdRequest,
  ): Promise<HouseholdResponse> {
    const household = await this.getExistingHousehold(householdId);
    return this.householdRepository.update(household.id, body);
  }

  async deleteHousehold(householdId: string): Promise<void> {
    const household = await this.getExistingHousehold(householdId);
    await this.householdRepository.delete(household.id);
  }

  private async getExistingHousehold(householdId: string): Promise<HouseholdResponse> {
    const household = await this.householdRepository.findById(householdId);

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    return household;
  }
}
