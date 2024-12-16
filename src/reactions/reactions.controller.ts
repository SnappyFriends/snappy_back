import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto, UpdateReactionDto } from './dto/reaction.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post(':post_id')
  create(
    @Param('post_id', ParseUUIDPipe) id: string,
    @Body() createReactionDto: CreateReactionDto,
  ) {
    return this.reactionsService.create(id, createReactionDto);
  }

  @Get()
  findAll() {
    return this.reactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reactionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReactionDto: UpdateReactionDto,
  ) {
    return this.reactionsService.update(id, updateReactionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reactionsService.remove(id);
  }
}
