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

  @Get(':id')
  findOneMessage(@Param('id') id: string) {
    return this.messagesService.findOneMessage(id);
  }

  @Put(':id')
  updateMessage(@Param('id') id: string, @Body() Message: Partial<Message>) {
    return this.messagesService.updateMessage(id, Message);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.messagesService.deleteMessage(id);
  }
}
