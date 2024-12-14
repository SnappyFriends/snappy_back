import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() message: Partial<Message>) {
    return this.messagesService.createMessage(message);
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
