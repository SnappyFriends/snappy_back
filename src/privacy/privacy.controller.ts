import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { CreatePrivacyDto } from './dto/create-privacy.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Privacy')
@Controller('privacy')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) { }


  @Post(':userId')
  @ApiOperation({ summary: 'Create Privacy' })
  @ApiCreatedResponse({
    description: 'Created Privacy.',
    schema: {
      example: {
        "comment_permissions": "everyone",
        "anonymous_message_permissions": "everyone",
        "enable_seen_receipt": true,
        "recommend_users": true,
        "user": {
          "id": "1f0aae07-270c-4ad7-9062-a15a866dccd1"
        },
        "id": "dcda1b5e-595c-4f8a-b47b-29ae2a9c1eac"
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Privacy Not Found.',
    schema: {
      example: {
        "message": "El usuario con id 1f0aae07-270c-4ad7-9062-a15a866dccd0 no existe.",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request.',
    schema: {
      example: {
        "message": "Validation failed (uuid is expected)",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() createPrivacyDto: CreatePrivacyDto,
  ) {
    return this.privacyService.create(userId, createPrivacyDto);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Search for Privacy by ID' })
  @ApiOkResponse({
    description: 'privacy search by ID successfully.',
    schema: {
      example: {
        "id": "dcda1b5e-595c-4f8a-b47b-29ae2a9c1eac",
        "commentPermissions": "everyone",
        "anonymousMessagePermissions": "everyone",
        "enableSeenReceipt": true,
        "recommendUsers": true,
        "userId": "1f0aae07-270c-4ad7-9062-a15a866dccd1"
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Validation failed.',
    schema: {
      example: {
        "message": "Validation failed (uuid is expected)",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Privacy Not Found.',
    schema: {
      example: {
        "message": "No se encontraron ajustes de privacidad con el id dcda1b5e-595c-4f8a-b47b-29ae2a9c1eab",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.privacyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modify Privacy' })
  @ApiOkResponse({
    description: 'modified Privacy.',
    schema: {
      example: {
        "id": "dcda1b5e-595c-4f8a-b47b-29ae2a9c1eac",
        "comment_permissions": "everyone",
        "anonymous_message_permissions": "friends",
        "enable_seen_receipt": false,
        "recommend_users": false
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request',
    schema: {
      example: {
        "message": [
          "comment_permissions must be one of the following values: everyone, friends, no_one"
        ],
        "error": "Bad Request",
        "statusCode": 400
      },
    },
  })

  @ApiNotFoundResponse({
    description: 'Validation failed (uuid is expected)',
    schema: {
      example: {
        "message": "Validation failed (uuid is expected)",
        "error": "Bad Request",
        "statusCode": 404
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePrivacyDto: UpdatePrivacyDto,
  ) {
    return this.privacyService.update(id, updatePrivacyDto);
  }
}
