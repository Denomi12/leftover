import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HouseholdService } from '../services/household.service.js';
import {
  CreateHouseholdRequest,
  HouseholdResponse,
  UpdateHouseholdRequest,
} from '../dtos/index.js';

@ApiTags('households')
@Controller('households')
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Post()
  @ApiCreatedResponse({ type: HouseholdResponse })
  createHousehold(@Body() body: CreateHouseholdRequest): Promise<HouseholdResponse> {
    return this.householdService.createHousehold(body);
  }

  @Get()
  @ApiOkResponse({ type: HouseholdResponse, isArray: true })
  getHouseholds(): Promise<HouseholdResponse[]> {
    return this.householdService.getHouseholds();
  }

  @Get(':householdId')
  @ApiOkResponse({ type: HouseholdResponse })
  getHouseholdById(
    @Param('householdId', ParseUUIDPipe) householdId: string,
  ): Promise<HouseholdResponse> {
    return this.householdService.getHouseholdById(householdId);
  }

  @Patch(':householdId')
  @ApiOkResponse({ type: HouseholdResponse })
  updateHousehold(
    @Param('householdId', ParseUUIDPipe) householdId: string,
    @Body() body: UpdateHouseholdRequest,
  ): Promise<HouseholdResponse> {
    return this.householdService.updateHousehold(householdId, body);
  }

  @Delete(':householdId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  deleteHousehold(@Param('householdId', ParseUUIDPipe) householdId: string): Promise<void> {
    return this.householdService.deleteHousehold(householdId);
  }
}
