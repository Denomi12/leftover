import type { HouseholdMemberEntity } from '../../../../../libs/db/entities/index.js';
import type { AuthenticatedRequest } from '../../../auth/dtos/index.js';

export interface HouseholdMemberRequest extends AuthenticatedRequest {
  householdMember: HouseholdMemberEntity;
}
