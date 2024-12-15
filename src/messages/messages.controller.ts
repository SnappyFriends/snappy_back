import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(createMessageDto);
  }

  @Get()
  findAllMessage() {
    return this.messagesService.findAllMessage();
  }

  @Get(':message_id')
  findOneMessage(@Param('message_id') id: string) {
    return this.messagesService.findOneMessage(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.messagesService.deleteMessage(id);
  }
}
