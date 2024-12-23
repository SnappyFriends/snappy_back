import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createChat(@Body() createChatDto: CreateChatDto) {
    const { userIds } = createChatDto;

    if (!userIds || userIds.length < 2) {
      throw new Error('Debe haber al menos dos usuarios para crear un chat.');
    }

    const newChat = await this.chatService.createChat(userIds);

    return {
      id: newChat.id,
      key: newChat.key,
      participants: newChat.participants,
    };
  }
}
