import { Module } from '@nestjs/common';
import { PollResponseService } from './poll-response.service';
import { PollResponseController } from './poll-response.controller';

@Module({
  controllers: [PollResponseController],
  providers: [PollResponseService],
})
export class PollResponseModule {}
