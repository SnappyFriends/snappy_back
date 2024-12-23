import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Post()
  @ApiOperation({ summary: 'Create Notification' })
  @ApiCreatedResponse({
    description: 'Created Notification.',
    schema: {
      example: {
        "notification_id": "f4b94b88-3f6d-4e5d-94c4-e6a32cce8623",
        "content": "you have received a message",
        "type": "message",
        "status": "unread",
        "user": {
          "id": "1f452184-8889-4caa-989a-494e5b7a1e2c"
        },
        "creation_date": "2024-12-23T18:31:46.582Z"
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User Not Found.',
    schema: {
      example: {
        "message": "El usuario con el id 1f452184-8889-4caa-989a-494e5b7a1e3c no fue encontrado.",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request.',
    schema: {
      example: {
        "message": [
          "type must be one of the following values: friend_request, message, post_reaction, comment, group_invitation, system, purchase"
        ],
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.findOne(id);
  }

  @Put(':id/mark-as-read')
  async markAsRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.remove(id);
  }
}
