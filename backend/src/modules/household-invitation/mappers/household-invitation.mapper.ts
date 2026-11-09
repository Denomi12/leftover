import type { HouseholdInvitationEntity, UserEntity } from '../../../../libs/db/entities/index.js';
import type {
  HouseholdInvitationResponse,
  InvitationUserResponse,
  ReceivedInvitationResponse,
} from '../dtos/index.js';

export function toInvitationUserResponse({ id, name, email }: UserEntity): InvitationUserResponse {
  return { id, name, email };
}

export function toHouseholdInvitationResponse(
  invitation: HouseholdInvitationEntity,
): HouseholdInvitationResponse {
  return {
    id: invitation.id,
    role: invitation.role,
    status: invitation.status,
    invitedUser: toInvitationUserResponse(invitation.invitedUser),
    createdAt: invitation.createdAt,
  };
}

export function toReceivedInvitationResponse(
  invitation: HouseholdInvitationEntity,
): ReceivedInvitationResponse {
  return {
    id: invitation.id,
    role: invitation.role,
    household: { id: invitation.household.id, name: invitation.household.name },
    invitedBy: toInvitationUserResponse(invitation.invitedByUser),
    createdAt: invitation.createdAt,
  };
}
