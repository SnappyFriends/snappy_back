import { Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entities/interests.entity';
import { InterestsSeederService } from './interests-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Interest])],
  controllers: [InterestsController],
  providers: [InterestsService, InterestsSeederService],
})
export class InterestsModule {}
