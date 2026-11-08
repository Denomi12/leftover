import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { HouseholdMemberRequest } from '../../modules/household/dtos/index.js';

export const CurrentHouseholdMember = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<HouseholdMemberRequest>();
  return request.householdMember;
});
