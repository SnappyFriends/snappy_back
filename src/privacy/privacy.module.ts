import { Module } from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { PrivacyController } from './privacy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Privacy } from './entities/privacy.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Privacy, User])],
  controllers: [PrivacyController],
  providers: [PrivacyService],
})
export class PrivacyModule {}
