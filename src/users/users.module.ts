import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersSeederService } from './users-seeder.service';
import { Interest } from 'src/interests/entities/interests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Interest])],
  controllers: [UsersController],
  providers: [UsersService, UsersSeederService],
})
export class UsersModule {}
