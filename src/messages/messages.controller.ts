import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageDTO } from './dto/messageReceiverDto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messagesService.createMessage(createMessageDto);
  }

  @Get('/')
  findAllMessage() {
    return this.messagesService.findAllMessage();
  }

  @Get(':id')
  findOneMessage(@Param('id') id: string) {
    return this.messagesService.findOneMessage(id);
  }

  @Put(':id')
  updateMessage(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto): Promise<Message> {
    return this.messagesService.updateMessage(id, updateMessageDto);
  }

  @Delete(':id')
  deleteMessage(@Param('id') id: string): Promise<{ message: string }> {
    return this.messagesService.deleteMessage(id);
  }
}
