import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PollResponseService } from './poll-response.service';
import { CreatePollResponseDto } from './dto/create-poll-response.dto';

@Controller('poll-response')
export class PollResponseController {
  constructor(private readonly pollResponseService: PollResponseService) {}

  @Post(':poll_id')
  create(
    @Param('poll_id', ParseUUIDPipe) poll_id: string,
    @Body() createPollResponseDto: CreatePollResponseDto,
  ) {
    return this.pollResponseService.create(poll_id, createPollResponseDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pollResponseService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pollResponseService.remove(id);
  }
}
