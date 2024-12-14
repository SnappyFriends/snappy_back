import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() Message: Partial<Message>) {
    return this.messagesService.create(Message);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOneMessage(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() Message: Partial<Message>) {
    return this.messagesService.update(id, Message);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.messagesService.deleteMessage(id);
  }
}
