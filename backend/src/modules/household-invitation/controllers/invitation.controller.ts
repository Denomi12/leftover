import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../../utils/decorators/index.js';
import { JwtAuthGuard } from '../../../utils/guards/index.js';
import type { JwtPayload } from '../../auth/interfaces/index.js';
import { HouseholdResponse } from '../../household/dtos/index.js';
import { INVITATION_ID_PARAM } from '../constants/household-invitation.constants.js';
import { ReceivedInvitationResponse } from '../dtos/index.js';
import { HouseholdInvitationService } from '../services/household-invitation.service.js';

@ApiTags('invitations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invitations')
export class InvitationController {
  constructor(private readonly invitationService: HouseholdInvitationService) {}

  @Get()
  @ApiOkResponse({ type: ReceivedInvitationResponse, isArray: true })
  getMyInvitations(@User() user: JwtPayload): Promise<ReceivedInvitationResponse[]> {
    return this.invitationService.getPendingInvitationsOfUser(user.sub);
  }

  @Post(`:${INVITATION_ID_PARAM}/accept`)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: INVITATION_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: HouseholdResponse })
  @ApiNotFoundResponse({ description: 'Pending invitation does not exist' })
  acceptInvitation(
    @User() user: JwtPayload,
    @Param(INVITATION_ID_PARAM, ParseUUIDPipe) invitationId: string,
  ): Promise<HouseholdResponse> {
    return this.invitationService.acceptInvitation(invitationId, user.sub);
  }

  @Post(`:${INVITATION_ID_PARAM}/decline`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: INVITATION_ID_PARAM, format: 'uuid' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Pending invitation does not exist' })
  declineInvitation(
    @User() user: JwtPayload,
    @Param(INVITATION_ID_PARAM, ParseUUIDPipe) invitationId: string,
  ): Promise<void> {
    return this.invitationService.declineInvitation(invitationId, user.sub);
  }
}
