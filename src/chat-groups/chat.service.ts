import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async createChat(userIds: string[]): Promise<Chat> {
    const users = await this.userRepository.find({
      where: {
        id: In(userIds),
      },
    });

    if (users.length !== userIds.length) {
      throw new NotFoundException('Algunos usuarios no fueron encontrados.');
    }

    const chatKey = this.generateChatKey(userIds);

    const existingChat = await this.chatRepository.findOne({
      where: { key: chatKey },
    });

    if (existingChat) {
      throw new InternalServerErrorException('El chat ya existe.');
    }

    const newChat = this.chatRepository.create({
      key: chatKey,
      participants: users,
    });

    const savedChat = await this.chatRepository.save(newChat);

    if (!savedChat) {
      throw new InternalServerErrorException('Error al guardar el chat');
    }

    return savedChat;
  }

  private generateChatKey(userIds: string[]): string {
    return userIds.sort().join('/');
  }

  async findAllMessageByChatId(userId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { participants: { id: userId } },
    });
  }

  async findAllChatsByUserId(sender_id: string, receiver_id: string) {
    if (!sender_id || !receiver_id) {
      throw new NotFoundException('Uno de los usuarios ingresados no existe.');
    }

    const chatKey = [sender_id, receiver_id].sort().join('/');
    const chat = await this.chatRepository.findOne({
      where: { key: chatKey },
    });

    if (!chat) {
      throw new NotFoundException(
        'No se encontraron chats entre estos dos usuarios.',
      );
    }

    return chat;
  }
}
