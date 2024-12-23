import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/reports.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Post()
  @ApiOperation({ summary: 'Create Reports' })
  @ApiCreatedResponse({
    description: 'Created Reports',
    schema: {
      example: {
        "description": "El usuario está publicando contenido inapropiado en el foro.",
        "reported_user": {
          "id": "1f0aae07-270c-4ad7-9062-a15a866dccd1"
        },
        "reporting_user": {
          "id": "1f452184-8889-4caa-989a-494e5b7a1e2c"
        },
        "report_id": "ae68963f-af50-41a6-bc42-9795280cba84",
        "report_date": "2024-12-23T14:41:36.034Z"
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Reporting user not found.',
    schema: {
      example: {
        "message": "Reporting user not found.",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request',
    schema: {
      example: {
        "message": "Unexpected token \n in JSON at position 189",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Reports.' })
  @ApiOkResponse({
    description: 'Reactions list',
    schema: {
      example: {
        "report_id": "ae68963f-af50-41a6-bc42-9795280cba84",
        "description": "El usuario está publicando contenido inapropiado en el foro.",
        "report_date": "2024-12-23T14:41:36.034Z",
        "reported_user": {
          "id": "1f0aae07-270c-4ad7-9062-a15a866dccd1",
          "fullname": "Mason Clark",
          "username": "masonclark"
        },
        "reporting_user": {
          "id": "1f452184-8889-4caa-989a-494e5b7a1e2c",
          "fullname": "Liam Moore",
          "username": "liammoore"
        }
      }
    }
  })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search for Reports by ID' })
  @ApiOkResponse({
    description: 'Reactions search by ID successfully',
    schema: {
      example: {
        "report_id": "ae68963f-af50-41a6-bc42-9795280cba84",
        "description": "El usuario está publicando contenido inapropiado en el foro.",
        "report_date": "2024-12-23T14:41:36.034Z",
        "reported_user": {
          "id": "1f0aae07-270c-4ad7-9062-a15a866dccd1",
          "fullname": "Mason Clark",
          "username": "masonclark"
        },
        "reporting_user": {
          "id": "1f452184-8889-4caa-989a-494e5b7a1e2c",
          "fullname": "Liam Moore",
          "username": "liammoore"
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
  @ApiNotFoundResponse({
    description: 'Report Not Found',
    schema: {
      example: {
        "message": "Report not found.",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Report' })
  @ApiOkResponse({ description: 'Reaction deleted successfully.', schema: { example: 'RReport deleted successfully.' } })
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
    description: 'Reaction not found',
    schema: {
      example: {
        "message": "Report not found.",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportsService.remove(id);
  }
}
