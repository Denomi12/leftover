import { SetMetadata } from '@nestjs/common';
import { HOUSEHOLD_ROLES_KEY } from '../constants/index.js';
import { HouseholdRole } from '../types/household-role.type.js';

export const HouseholdRoles = (...roles: HouseholdRole[]) =>
  SetMetadata(HOUSEHOLD_ROLES_KEY, roles);
