import { Module } from '@nestjs/common';
import typeorm from './config/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CommentsModule } from './comments/comments.module';
import { PollsModule } from './polls/polls.module';
import { ReportsModule } from './reports/reports.module';
import { PrivacyModule } from './privacy/privacy.module';
import { MessagesModule } from './messages/messages.module';
import { InterestsModule } from './interests/interests.module';
import { FriendshipsModule } from './friendships/friendships.module';
import { PollResponseModule } from './poll-response/poll-response.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { StoriesModule } from './stories/stories.module';
import { PurchasesModule } from './purchases/purchases.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatGroupsModule } from './chat-groups/chat-groups.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configTypeORM: ConfigService) =>
        configTypeORM.get('typeorm'),
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    ReactionsModule,
    CommentsModule,
    PollsModule,
    ReportsModule,
    PrivacyModule,
    InterestsModule,
    FriendshipsModule,
    MessagesModule,
    PollResponseModule,
    StoriesModule,
    PurchasesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "12h" }
    }),
    NotificationsModule,
    ChatGroupsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
