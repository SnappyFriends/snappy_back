import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { PollResponseService } from './poll-response.service';
import { CreatePollResponseDto } from './dto/create-poll-response.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Poll Response')
@Controller('poll-response')
export class PollResponseController {
  constructor(private readonly pollResponseService: PollResponseService) { }

  @Post(':poll_id')
  @ApiOperation({ summary: 'Create Polls Response' })
  @ApiCreatedResponse({
    description: 'Created Polls Response',
    schema: {
      example: {
        "selected_option": "group",
        "poll": {
          "poll_id": "02a0f94f-821c-48fd-a237-83a9bfd9f0de",
          "content": "¿Cual es tu color favorito?",
          "creation_date": "2024-12-19T20:02:06.324Z",
          "type": "group",
          "closing_date": "2024-12-31T23:59:59.000Z",
          "options": [
            "opción1",
            "opción2",
            "opción3"
          ]
        },
        "user": {
          "id": "1f0aae07-270c-4ad7-9062-a15a866dccd1",
          "fullname": "Mason Clark",
          "username": "masonclark",
          "email": "mason@example.com",
          "password": "$2b$10$QiT63r6DaoBoQfZpPmWQou9BFk0TOTsVsasDUSKvG3MX.n93Ezn7a",
          "birthdate": "1992-03-09",
          "genre": "MASCULINO",
          "registration_date": "2024-12-19T20:00:42.183Z",
          "last_login_date": "2024-12-19T20:00:42.183Z",
          "user_type": "regular",
          "status": "active",
          "profile_image": "no_img.png",
          "location": "Denver"
        },
        "response_id": "c3be0337-af90-487f-9d5d-c9d1e3e6a34b",
        "response_date": "2024-12-19T20:06:36.673Z"
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Unexpected error creating polls response',
    schema: {
      example: {
        "message": "Ocurrió un error al crear la respuesta de la encuesta",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Polls not found',
    schema: {
      example: {
        "message": "Ocurrió un error al crear la respuesta de la encuesta",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  create(
    @Param('poll_id', ParseUUIDPipe) poll_id: string,
    @Body() createPollResponseDto: CreatePollResponseDto,
  ) {
    return this.pollResponseService.create(poll_id, createPollResponseDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search for Polls-response by ID' })
  @ApiNotFoundResponse({
    description: 'Poll Response not found.',
    schema: {
      example: {
        "message": "Poll Response not found.",
        "error": "Bad Request",
        "statusCode": 404
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
  @ApiOkResponse({
    description: 'Search for Polls-Response by ID',
    schema: {
      example: {
        "response_id": "c3be0337-af90-487f-9d5d-c9d1e3e6a34b",
        "selected_option": "group",
        "response_date": "2024-12-19T20:06:36.673Z"
      }
    }
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pollResponseService.findOne(id);
  }


  @ApiOperation({ summary: 'Delete a Poll-response' })
  @ApiOkResponse({
    description: 'Poll-response deleted successfully.', schema: { example: 'Poll Response with id ${id} deleted successfully' }
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
  @ApiNotFoundResponse({
    description: 'Poll Response not found.',
    schema: {
      example: {
        "message": "Poll Response not found.",
        "error": "Bad Request",
        "statusCode": 404
      }
    }
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pollResponseService.remove(id);
  }
}
