import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { In, Not, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';
import { FollowService } from 'src/follow/follow.service';
import { Follow } from 'src/follow/entities/follow.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,

    private readonly followService: FollowService,
  ) {}

  async getFilteredUsers(userId: string) {
    const friendsUsers = await this.followService.getFriends(userId);

    let friendsIds = friendsUsers.map((friend) => friend.id);

    friendsIds = [...friendsIds, userId];

    const filteredUsers = await this.userRepository.find({
      where: { id: Not(In(friendsIds)) },
    });

    console.log('friends IDS', friendsIds);
    console.log(filteredUsers);
    return filteredUsers;
  }

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

  async findAllMessageByChatId(chatId: string) {
    const chatFound = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participants', 'messages', 'messages.sender_id'],
    });

    const chatMaped = {
      ...chatFound,
      messages: chatFound.messages.map((message) => {
        return {
          content: message.content,
          send_date: message.send_date,
          sender_id: message.sender_id.id,
          username: message.sender_id.username,
          profile_image: message.sender_id.profile_image,
          user_type: message.sender_id.user_type,
        };
      }),
    };

    return chatMaped;
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

  async getChatsByUserId(userId: string): Promise<Chat[]> {
    const chats = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('chat.messages', 'message')
      .where(
        'chat.id IN (SELECT chat_id FROM user_chats WHERE user_id = :userId)',
        { userId },
      )
      .getMany();

    return chats;
  }
}
