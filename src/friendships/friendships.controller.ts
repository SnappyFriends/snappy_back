import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { FriendshipsService } from './friendships.service';

@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post(':userId1/add-friend/:userId2')
  async addFriend(
    @Param('userId1', ParseUUIDPipe) userId1: string,
    @Param('userId2', ParseUUIDPipe) userId2: string,
  ) {
    return this.friendshipsService.addFriend(userId1, userId2);
  }

  @Get(':userId')
  async findAllForUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.friendshipsService.findAllForUser(userId);
  }

  @Put(':friendshipId/accept')
  async acceptFriendship(
    @Param('friendshipId', ParseUUIDPipe) friendshipId: string,
  ) {
    return this.friendshipsService.acceptFriendship(friendshipId);
  }

  @Delete(':friendshipId')
  async removeFriendship(
    @Param('friendshipId', ParseUUIDPipe) friendshipId: string,
  ) {
    return this.friendshipsService.removeFriendship(friendshipId);
  }
}
