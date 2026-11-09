import type { HouseholdEntity, HouseholdMemberEntity } from '../../../../libs/db/entities/index.js';
import type { HouseholdRole } from '../../../utils/types/household-role.type.js';
import type { HouseholdMemberResponse, HouseholdResponse } from '../dtos/index.js';

export function toHouseholdResponse(
  household: HouseholdEntity,
  role: HouseholdRole,
  memberCount: number,
): HouseholdResponse {
  return {
    id: household.id,
    name: household.name,
    role,
    memberCount,
    createdAt: household.createdAt,
  };
}

export function toHouseholdMemberResponse({
  id,
  role,
  user,
}: HouseholdMemberEntity): HouseholdMemberResponse {
  return { id, role, user: { id: user.id, name: user.name, email: user.email } };
}
