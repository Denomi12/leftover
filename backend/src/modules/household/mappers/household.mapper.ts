import type { HouseholdEntity } from '../../../../libs/db/entities/index.js';
import type { HouseholdRole } from '../../../utils/types/household-role.type.js';
import type { HouseholdResponse } from '../dtos/index.js';

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
