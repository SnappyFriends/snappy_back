import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message } from 'src/messages/entities/message.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { FollowService } from 'src/follow/follow.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Message, Follow])],
  providers: [ChatService, FollowService],
  controllers: [ChatController],
})
export class ChatModule {}
