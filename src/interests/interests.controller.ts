import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { Interest } from './entities/interests.entity';
import { CreateInterestDTO, UpdateInterestDTO } from './dto/interests.dto';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Get()
  getAllInterests(): Promise<Interest[]> {
    return this.interestsService.getAll();
  }

  @Get(':id')
  getInterestById(@Param('id', ParseUUIDPipe) id: string): Promise<Interest> {
    return this.interestsService.getById(id);
  }

  @Post()
  createInterest(@Body() createInterestDTO: CreateInterestDTO): Promise<Interest> {
    return this.interestsService.create(createInterestDTO);
  }

  @Put(':id')
  updateInterest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInterestDTO: UpdateInterestDTO,
  ): Promise<Interest> {
    return this.interestsService.update(id, updateInterestDTO);
  }

  @Delete(':id')
  deleteInterest(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.interestsService.remove(id);
  }
}
