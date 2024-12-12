import { Module } from '@nestjs/common';
import { PollResponseService } from './poll-response.service';
import { PollResponseController } from './poll-response.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Poll } from 'src/polls/entities/poll.entity';
import { PollResponse } from './entities/poll-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Poll, PollResponse])],
  controllers: [PollResponseController],
  providers: [PollResponseService],
})
export class PollResponseModule {}
