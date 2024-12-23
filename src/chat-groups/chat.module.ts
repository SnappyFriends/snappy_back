import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
