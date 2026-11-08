import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  HouseholdInvitationEntity,
  HouseholdMemberEntity,
  UserEntity,
} from '../../../../libs/db/entities/index.js';
import { HouseholdInvitationStatus } from '../../../utils/types/household-invitation-status.type.js';
import { USER_SEARCH_RESULT_LIMIT } from '../constants/household-invitation.constants.js';

const LIKE_SPECIAL_CHARACTERS = /[\\%_]/g;

@Injectable()
export class HouseholdInvitationRepository {
  constructor(
    @InjectRepository(HouseholdInvitationEntity)
    private readonly invitationRepository: Repository<HouseholdInvitationEntity>,
    @InjectRepository(HouseholdMemberEntity)
    private readonly memberRepository: Repository<HouseholdMemberEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  searchInvitableUsers(householdId: string, query: string): Promise<UserEntity[]> {
    const pattern = `%${query.replace(LIKE_SPECIAL_CHARACTERS, '\\$&')}%`;

    return this.userRepository
      .createQueryBuilder('candidate')
      .select(['candidate.id', 'candidate.name', 'candidate.email'])
      .where('(candidate.email ILIKE :pattern OR candidate.name ILIKE :pattern)', { pattern })
      .andWhere(
        'NOT EXISTS (SELECT 1 FROM household_members m WHERE m.user_id = candidate.id AND m.household_id = :householdId)',
        { householdId },
      )
      .andWhere(
        'NOT EXISTS (SELECT 1 FROM household_invitations i WHERE i.invited_user_id = candidate.id AND i.household_id = :householdId AND i.status = :pending)',
        { pending: HouseholdInvitationStatus.Pending },
      )
      .orderBy('candidate.name', 'ASC')
      .limit(USER_SEARCH_RESULT_LIMIT)
      .getMany();
  }

  findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  isMember(householdId: string, userId: string): Promise<boolean> {
    return this.memberRepository.existsBy({ householdId, userId });
  }

  hasPendingInvitation(householdId: string, invitedUserId: string): Promise<boolean> {
    return this.invitationRepository.existsBy({
      householdId,
      invitedUserId,
      status: HouseholdInvitationStatus.Pending,
    });
  }

  create(
    data: Pick<
      HouseholdInvitationEntity,
      'householdId' | 'invitedUserId' | 'invitedByUserId' | 'role'
    >,
  ): Promise<HouseholdInvitationEntity> {
    return this.invitationRepository.save(this.invitationRepository.create(data));
  }

  findPendingOfHousehold(householdId: string): Promise<HouseholdInvitationEntity[]> {
    return this.invitationRepository.find({
      where: { householdId, status: HouseholdInvitationStatus.Pending },
      relations: { invitedUser: true },
      order: { createdAt: 'DESC' },
    });
  }

  findPendingOfUser(invitedUserId: string): Promise<HouseholdInvitationEntity[]> {
    return this.invitationRepository.find({
      where: { invitedUserId, status: HouseholdInvitationStatus.Pending },
      relations: { household: true, invitedByUser: true },
      order: { createdAt: 'DESC' },
    });
  }

  accept(invitationId: string, userId: string): Promise<HouseholdMemberEntity | null> {
    return this.invitationRepository.manager.transaction(async (manager) => {
      const result = await manager.update(
        HouseholdInvitationEntity,
        { id: invitationId, invitedUserId: userId, status: HouseholdInvitationStatus.Pending },
        { status: HouseholdInvitationStatus.Accepted, respondedAt: new Date() },
      );
      if (!result.affected) {
        return null;
      }

      const invitation = await manager.findOneByOrFail(HouseholdInvitationEntity, {
        id: invitationId,
      });

      await manager
        .createQueryBuilder()
        .insert()
        .into(HouseholdMemberEntity)
        .values({
          userId,
          householdId: invitation.householdId,
          role: invitation.role,
        })
        .orIgnore()
        .execute();

      return manager.findOneByOrFail(HouseholdMemberEntity, {
        userId,
        householdId: invitation.householdId,
      });
    });
  }

  async decline(invitationId: string, userId: string): Promise<boolean> {
    const result = await this.invitationRepository.update(
      { id: invitationId, invitedUserId: userId, status: HouseholdInvitationStatus.Pending },
      { status: HouseholdInvitationStatus.Declined, respondedAt: new Date() },
    );
    return Boolean(result.affected);
  }
}
