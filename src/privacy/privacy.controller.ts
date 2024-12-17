import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { CreatePrivacyDto } from './dto/create-privacy.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';

@Controller('privacy')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Post(':userId')
  create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() createPrivacyDto: CreatePrivacyDto,
  ) {
    return this.privacyService.create(userId, createPrivacyDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.privacyService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePrivacyDto: UpdatePrivacyDto,
  ) {
    return this.privacyService.update(id, updatePrivacyDto);
  }
}
