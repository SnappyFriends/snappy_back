import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule { }
