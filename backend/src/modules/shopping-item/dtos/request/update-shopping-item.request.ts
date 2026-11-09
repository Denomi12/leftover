import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateShoppingItemRequest } from './create-shopping-item.request.js';

export class UpdateShoppingItemRequest extends PartialType(CreateShoppingItemRequest) {
  @ApiPropertyOptional({ example: true, description: 'Ali je živilo kupljeno' })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
