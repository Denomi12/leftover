import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HouseholdEntity } from '../../../../libs/db/entities/index.js';
import {
  CreateHouseholdRequest,
  HouseholdResponse,
  UpdateHouseholdRequest,
} from '../dtos/index.js';

@Injectable()
export class HouseholdRepository {
  constructor(
    @InjectRepository(HouseholdEntity)
    private readonly householdRepository: Repository<HouseholdEntity>,
  ) {}

  create(body: CreateHouseholdRequest): Promise<HouseholdResponse> {
    const household = this.householdRepository.create(body);
    return this.householdRepository.save(household);
  }

  findAll(): Promise<HouseholdResponse[]> {
    return this.householdRepository.find({ order: { createdAt: 'ASC' } });
  }

  findById(id: string): Promise<HouseholdResponse | null> {
    return this.householdRepository.findOneBy({ id });
  }

  async update(id: string, body: UpdateHouseholdRequest): Promise<HouseholdResponse> {
    await this.householdRepository.update(id, body);
    return this.householdRepository.findOneByOrFail({ id });
  }

  async delete(id: string): Promise<void> {
    await this.householdRepository.delete(id);
  }
}
