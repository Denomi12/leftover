import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  USER_SEARCH_QUERY_MAX_LENGTH,
  USER_SEARCH_QUERY_MIN_LENGTH,
} from '../../constants/household-invitation.constants.js';
import { trimString } from '../../../auth/dtos/request/auth.transforms.js';

export class SearchInvitableUsersRequest {
  @ApiProperty({
    example: 'janez',
    description: 'Part of the user name or email',
    minLength: USER_SEARCH_QUERY_MIN_LENGTH,
    maxLength: USER_SEARCH_QUERY_MAX_LENGTH,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(USER_SEARCH_QUERY_MIN_LENGTH)
  @MaxLength(USER_SEARCH_QUERY_MAX_LENGTH)
  query!: string;
}
