import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { PrivacyModule } from './privacy/privacy.module';
import { MessagesModule } from './messages/messages.module';
import { InterestsModule } from './interests/interests.module';
import { FriendshipsModule } from './friendships/friendships.module';

@Module({
  imports: [ReportsModule, PrivacyModule, MessagesModule, InterestsModule, FriendshipsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }