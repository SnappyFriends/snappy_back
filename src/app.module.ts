import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import typeorm from './config/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CommentsModule } from './comments/comments.module';
import { PollsModule } from './polls/polls.module';
import { ReportsModule } from './reports/reports.module';
import { PrivacyModule } from './privacy/privacy.module';
import { MessagesModule } from './messages/messages.module';
import { InterestsModule } from './interests/interests.module';
import { FriendshipsModule } from './friendships/friendships.module';


@Module({
<<<<<<< HEAD
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configTypeORM: ConfigService) =>
        configTypeORM.get('typeorm'),
    }),
    UsersModule,
    PostsModule,
    ReactionsModule,
    CommentsModule,
    PollsModule,
    ReportsModule,
    PrivacyModule,
    InterestsModule,
    MessagesModule,
  ],
=======
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configTypeORM: ConfigService) => configTypeORM.get('typeorm')
  }),
    UsersModule, PostsModule, ReactionsModule, CommentsModule, PollsModule, ReportsModule, PrivacyModule, InterestsModule, FriendshipsModule],
>>>>>>> d4a98499fabdffc4a7f5367044802f87f4cd76f9
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
