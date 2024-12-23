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
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Friendships')
@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) { }

  @Post(':userId1/add-friend/:userId2')
  @ApiOperation({ summary: 'Create Friendships' })
  @ApiCreatedResponse({
    description: 'Created Friendships',
    schema: {
      example: {
        "status": "pending",
        "user1": {
          "id": "1f452184-8889-4caa-989a-494e5b7a1e2c"
        },
        "user2": {
          "id": "1f0aae07-270c-4ad7-9062-a15a866dccd1"
        },
        "id": "c0f9e8a0-a466-491e-a59c-b03427a7f00b",
        "request_date": "2024-12-23T16:52:19.626Z"
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request',
    schema: {
      example: {
        "message": "Error al agregar un amigo.",
        "error": "Internal Server Error",
        "statusCode": 500
      }
    }
  })
  async addFriend(
    @Param('userId1', ParseUUIDPipe) userId1: string,
    @Param('userId2', ParseUUIDPipe) userId2: string,
  ) {
    return this.friendshipsService.addFriend(userId1, userId2);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Search for Friendship by ID' })
  @ApiOkResponse({
    description: 'Friendship search by ID successfully',
    schema: {
      example: {
        "id": "c0f9e8a0-a466-491e-a59c-b03427a7f00b",
        "status": "pending",
        "request_date": "2024-12-23T16:52:19.626Z",
        "user1": {
          "id": "c0f9e8a0-a466-491e-a59c-b03427a7f00b"
        },
        "user2": {
          "id": "c0f9e8a0-a466-491e-a59c-b03427a7f00b"
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      example: {
        "message": "Validation failed (uuid is expected)",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  async findAllForUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.friendshipsService.findAllForUser(userId);
  }

  @Put(':friendshipId/accept')
  @ApiOperation({ summary: 'Modify Friendship' })
  @ApiOkResponse({
    description: 'modified Friendship.',
    schema: {
      example: {
        "id": "c0f9e8a0-a466-491e-a59c-b03427a7f00b",
        "status": "accepted",
        "request_date": "2024-12-23T16:52:19.626Z"
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        "message": "Error al aceptar la amistad.",
        "error": "Internal Server Error",
        "statusCode": 500
      },
    },
  })
  async acceptFriendship(
    @Param('friendshipId', ParseUUIDPipe) friendshipId: string,
  ) {
    return this.friendshipsService.acceptFriendship(friendshipId);
  }

  @Delete(':friendshipId')
  @ApiOperation({ summary: 'Delete a FriendShip' })
  @ApiOkResponse({ description: 'FriendShip deleted successfully.', schema: { example: 'Friendship con ID ${ID} eliminada correctamente' } })
  @ApiBadRequestResponse({
    description: 'Some input value is not found. (uuid is expected)',
    schema: {
      example: {
        "message": "Error al intentar eliminar la relación de amistad.",
        "error": "Internal Server Error",
        "statusCode": 500
      }
    }
  })
  async removeFriendship(
    @Param('friendshipId', ParseUUIDPipe) friendshipId: string,
  ) {
    return this.friendshipsService.removeFriendship(friendshipId);

  }
}
