import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ChatGroupsService } from './chat-groups.service';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { UpdateChatGroupDto } from './dto/update-chat-group.dto';

@Controller('chat-groups')
export class ChatGroupsController {
  constructor(private readonly chatGroupsService: ChatGroupsService) {}

  @Post()
  create(@Body() createChatGroupDto: CreateChatGroupDto) {
    return this.chatGroupsService.create(createChatGroupDto);
  }

  @Get()
  findAll() {
    return this.chatGroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatGroupsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChatGroupDto: UpdateChatGroupDto,
  ) {
    return this.chatGroupsService.update(id, updateChatGroupDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatGroupsService.remove(id);
  }
}
