import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
<<<<<<< HEAD
import { ReportsModule } from './reports/reports.module';
import { PrivacyModule } from './privacy/privacy.module';
import { MessagesModule } from './messages/messages.module';
import { InterestsModule } from './interests/interests.module';
import { FriendshipsModule } from './friendships/friendships.module';


@Module({
  imports: [ReportsModule, PrivacyModule, MessagesModule, InterestsModule, FriendshipsModule],
=======
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CommentsModule } from './comments/comments.module';
import { PollsModule } from './polls/polls.module';
import { FriendshipsModule } from './friendships/friendships.module';

@Module({
  imports: [UsersModule, PostsModule, ReactionsModule, CommentsModule, PollsModule],
>>>>>>> a546591e970a41e039341977fcbe024d9653d625
=======
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CommentsModule } from './comments/comments.module';
import { PollsModule } from './polls/polls.module';

@Module({
  imports: [UsersModule, PostsModule, ReactionsModule, CommentsModule, PollsModule],
>>>>>>> a546591e970a41e039341977fcbe024d9653d625
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
