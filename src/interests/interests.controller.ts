import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { Interest } from './entities/interests.entity';
import { CreateInterestDTO, UpdateInterestDTO } from './dto/interests.dto';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Interests')
@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all Interests' })
  @ApiOkResponse({
    description: 'Interests list.',
    schema: {
      example: {
        "interest_id": "ae970d38-79e5-4cc7-a2e5-93fbd16d93ec",
        "name": "Música"
      }
    }
  })
  getAllInterests(): Promise<Interest[]> {
    return this.interestsService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search for Reactions by ID' })
  @ApiOkResponse({
    description: 'Search for Reactions by ID.',
    schema: {
      example: {
        "interest_id": "ae970d38-79e5-4cc7-a2e5-93fbd16d93ec",
        "name": "Música"
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
    description: 'Reaction Not Found',
    schema: {
      example: {
        "message": "No se encontró el interés con el ID ae970d38-79e5-4cc7-a2e5-93fbd16d93ee",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  getInterestById(@Param('id', ParseUUIDPipe) id: string): Promise<Interest> {
    return this.interestsService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Interest' })
  @ApiOkResponse({
    description: 'Created Interest',
    schema: {
      example: {
        "name": "Romance",
        "interest_id": "8d1c8d60-2290-42a0-a42f-57033168eb7e"
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request',
    schema: {
      example: {
        "message": "Unexpected token \n in JSON at position 20",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  createInterest(@Body() createInterestDTO: CreateInterestDTO): Promise<Interest> {
    return this.interestsService.create(createInterestDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modify Interest' })
  @ApiOkResponse({
    description: 'modified Interest.',
    schema: {
      example: {
        "name": "Romance",
        "interest_id": "8d1c8d60-2290-42a0-a42f-57033168eb7e"
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        "message": "Validation failed (uuid is expected)",
        "error": "Bad Request",
        "statusCode": 400
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Error: Interest Not Found.',
    schema: {
      example: {
        "message": "No se encontró el interés con el ID 8d1c8d60-2290-42a0-a42f-57033168eb75",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  updateInterest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInterestDTO: UpdateInterestDTO,
  ): Promise<Interest> {
    return this.interestsService.update(id, updateInterestDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Interest' })
  @ApiOkResponse({ description: 'Reaction deleted successfully.', schema: { example: 'Reacción con ID ${id} eliminada correctamente' } })
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
        "message": "No se encontró el interés con el ID 8d1c8d60-2290-42a0-a42f-57033168eb7e",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  deleteInterest(@Param('id', ParseUUIDPipe) id: string) {
    return this.interestsService.remove(id);
  }
}
