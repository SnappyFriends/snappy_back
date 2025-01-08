import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AdminController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/logs.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log, User])],
  controllers: [AdminController],
  providers: [LogsService],
})
export class LogsModule { }
