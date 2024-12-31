import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message } from 'src/messages/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Message])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
