import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post(':id')
  create(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createPollDto: CreatePollDto,
  ) {
    return this.pollsService.create(id, createPollDto);
  }

  @Get()
  findAll() {
    return this.pollsService.findAll();
  }

  @Get('/:poll_id')
  findOne(@Param('poll_id', ParseUUIDPipe) poll_id: string) {
    return this.pollsService.findOne(poll_id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pollsService.remove(id);
  }
}
