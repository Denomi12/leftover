import { HouseholdRole } from '../../../utils/types/household-role.type.js';

export const INVITATION_ID_PARAM = 'invitationId';
export const INVITABLE_ROLES = [HouseholdRole.Member, HouseholdRole.Guest] as const;
export const USER_SEARCH_QUERY_MIN_LENGTH = 2;
export const USER_SEARCH_QUERY_MAX_LENGTH = 100;
export const USER_SEARCH_RESULT_LIMIT = 10;
export const UNIQUE_VIOLATION_CODE = '23505';
