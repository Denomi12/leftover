import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { HouseholdEntity, HouseholdMemberEntity } from '../../../../libs/db/entities/index.js';
import { HouseholdRole } from '../../../utils/types/household-role.type.js';

@Injectable()
export class HouseholdRepository {
  constructor(
    @InjectRepository(HouseholdEntity)
    private readonly householdRepository: Repository<HouseholdEntity>,
    @InjectRepository(HouseholdMemberEntity)
    private readonly memberRepository: Repository<HouseholdMemberEntity>,
  ) {}

  createWithOwner(name: string, ownerId: string): Promise<HouseholdEntity> {
    return this.householdRepository.manager.transaction(async (manager) => {
      const household = await manager.save(manager.create(HouseholdEntity, { name }));
      await manager.save(
        manager.create(HouseholdMemberEntity, {
          userId: ownerId,
          householdId: household.id,
          role: HouseholdRole.Owner,
        }),
      );
      return household;
    });
  }

  findMembershipsOfUser(userId: string): Promise<HouseholdMemberEntity[]> {
    return this.memberRepository.find({
      where: { userId },
      relations: { household: true },
      order: { household: { createdAt: 'ASC' } },
    });
  }

  findMembersOfHousehold(householdId: string): Promise<HouseholdMemberEntity[]> {
    return this.memberRepository.find({
      where: { householdId },
      relations: { user: true },
      order: { user: { name: 'ASC' } },
    });
  }

  findById(householdId: string): Promise<HouseholdEntity | null> {
    return this.householdRepository.findOneBy({ id: householdId });
  }

  async countMembers(householdIds: string[]): Promise<Map<string, number>> {
    if (householdIds.length === 0) {
      return new Map();
    }

    const rows = await this.memberRepository
      .createQueryBuilder('member')
      .select('member.householdId', 'householdId')
      .addSelect('COUNT(*)', 'count')
      .where({ householdId: In(householdIds) })
      .groupBy('member.householdId')
      .getRawMany<{ householdId: string; count: string }>();

    return new Map(rows.map(({ householdId, count }) => [householdId, Number(count)]));
  }
}
