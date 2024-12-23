import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User) private userRepository: Repository<User>,
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
    return userIds.sort().join('-');
  }
}
