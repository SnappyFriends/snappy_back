import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto, FilterDto } from './dto/create-logs.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LogsAdmin')
@Controller('logs')
export class AdminController {
  constructor(private readonly logsService: LogsService) { }

  @Post()
  async createLog(@Body() createLogDto: CreateLogDto) {
    return this.logsService.createLog(createLogDto);
  }

  @Get('/admin')
  async getLogs(@Query() filterLogsDto: FilterDto) {
    return this.logsService.getLogs(filterLogsDto);
  }

  @Get('/users/metrics')
  async getLogsUsers(@Query() filterLogsDto: FilterDto) {
    return this.logsService.getLogsUsers(filterLogsDto);
  }



}
