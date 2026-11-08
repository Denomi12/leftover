import {
  BadRequestException,
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { HouseholdMemberEntity } from '../../../libs/db/entities/index.js';
import type { HouseholdMemberRequest } from '../../modules/household/dtos/index.js';
import { HOUSEHOLD_ID_PARAM, HOUSEHOLD_ROLES_KEY } from '../constants/index.js';
import { HouseholdRole } from '../types/household-role.type.js';

@Injectable()
export class HouseholdGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(HouseholdMemberEntity)
    private readonly memberRepository: Repository<HouseholdMemberEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<HouseholdMemberRequest>();
    const householdId = request.params[HOUSEHOLD_ID_PARAM];

    if (householdId === undefined) {
      return true;
    }

    if (typeof householdId !== 'string' || !isUUID(householdId)) {
      throw new BadRequestException('Validation failed (uuid is expected)');
    }

    const membership = await this.memberRepository.findOneBy({
      userId: request.user.sub,
      householdId,
    });

    if (!membership) {
      throw new NotFoundException('Household not found');
    }

    const allowedRoles = this.reflector.getAllAndOverride<HouseholdRole[] | undefined>(
      HOUSEHOLD_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (allowedRoles?.length && !allowedRoles.includes(membership.role)) {
      throw new ForbiddenException('Insufficient household permissions');
    }

    request.householdMember = membership;
    return true;
  }
}
