import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [UsersModule, PostsModule, ReactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
