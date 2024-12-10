import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CommentsModule } from './comments/comments.module';
import { PollsModule } from './polls/polls.module';

@Module({
  imports: [UsersModule, PostsModule, ReactionsModule, CommentsModule, PollsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
