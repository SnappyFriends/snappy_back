import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PollResponseService } from './poll-response.service';
import { CreatePollResponseDto } from './dto/create-poll-response.dto';
import { UpdatePollResponseDto } from './dto/update-poll-response.dto';

@Controller('poll-response')
export class PollResponseController {
  constructor(private readonly pollResponseService: PollResponseService) {}

  @Post()
  create(@Body() createPollResponseDto: CreatePollResponseDto) {
    return this.pollResponseService.create(createPollResponseDto);
  }

  @Get()
  findAll() {
    return this.pollResponseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollResponseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollResponseDto: UpdatePollResponseDto) {
    return this.pollResponseService.update(+id, updatePollResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollResponseService.remove(+id);
  }
}
