import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Polls')
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) { }

  @Post(':id')
  @ApiOperation({ summary: 'Create Polls' })
  @ApiCreatedResponse({
    description: 'Created Polls',
    schema: {
      example: {
        "content": "¿Cual es tu color favorito?",
        "type": "group",
        "closing_date": "2024-12-31T23:59:59.000Z",
        "options": [
          "opción1",
          "opción2",
          "opción3"
        ],
        "user": {
          "id": "168bde23-b10d-4af9-807e-7d6405d378a7",
          "fullname": "Michael Johnson",
          "username": "michaeljohnson",
          "email": "michael@example.com",
          "password": "$2b$10$QiT63r6DaoBoQfZpPmWQou9BFk0TOTsVsasDUSKvG3MX.n93Ezn7a",
          "birthdate": "1992-11-02",
          "genre": "MASCULINO",
          "registration_date": "2024-12-17T06:26:12.820Z",
          "last_login_date": "2024-12-17T06:26:12.820Z",
          "user_type": "regular",
          "status": "active",
          "profile_image": "https://example.com/profile3.jpg",
          "location": "Chicago"
        },
        "poll_id": "8bec24da-0409-4c5c-b3ca-8dcdcc4af62a",
        "creation_date": "2024-12-19T15:29:29.804Z"
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'unexpected error creating polls',
    schema: {
      example: {
        "message": [
          "type must be one of the following values: "
        ],
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  create(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createPollDto: CreatePollDto,
  ) {
    return this.pollsService.create(id, createPollDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Polls' })
  @ApiOkResponse({
    description: 'Polls List.',
    schema: {
      example: {
        "poll_id": "8bec24da-0409-4c5c-b3ca-8dcdcc4af62a",
        "content": "¿Cual es tu color favorito?",
        "creation_date": "2024-12-19T15:29:29.804Z",
        "type": "group",
        "closing_date": "2024-12-31T23:59:59.000Z",
        "options": [
          "opción1",
          "opción2",
          "opción3"
        ],
        "responses": []
      }
    }
  })
  findAll() {
    return this.pollsService.findAll();
  }

  @Get('/:poll_id')
  @ApiOperation({ summary: 'Search for Polls by ID' })
  @ApiOkResponse({
    description: 'Polls search by ID successfully.',
    schema: {
      example: {
        "poll_id": "8bec24da-0409-4c5c-b3ca-8dcdcc4af62a",
        "content": "¿Cual es tu color favorito?",
        "creation_date": "2024-12-19T15:29:29.804Z",
        "type": "group",
        "closing_date": "2024-12-31T23:59:59.000Z",
        "options": [
          "opción1",
          "opción2",
          "opción3"
        ],
        "responses": []
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Invalid Poll ID.',
    schema: {
      example: {
        "message": "Validation failed (uuid is expected)",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  findOne(@Param('poll_id', ParseUUIDPipe) poll_id: string) {
    return this.pollsService.findOne(poll_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Poll' })
  @ApiOkResponse({
    description: 'Poll deleted successfully.', schema: { example: 'Poll with id ${id} deleted successfully' }
  })
  @ApiBadRequestResponse({
    description: 'Some input value is not found. (uuid is expected)',
    schema: {
      example: {
        "message": "Validation failed (uuid is expected)",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pollsService.remove(id);
  }
}
