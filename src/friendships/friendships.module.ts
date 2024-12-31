import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipsService } from './friendships.service';
import { Friendship } from './entities/friendship.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship]), UsersModule],
  providers: [FriendshipsService],
  exports: [FriendshipsService],
})
export class FriendshipsModule {}
