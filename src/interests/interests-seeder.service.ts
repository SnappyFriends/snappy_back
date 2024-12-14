import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interests.entity';
import * as data from '../assets/interests-seed.json';

@Injectable()
export class InterestsSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,
  ) {}

  async onModuleInit() {
    await this.seedInterests();
  }

  async seedInterests() {
    const interestCount = await this.interestsRepository.count();
    if (interestCount > 0) {
      console.log('Ya existen intereses en la base de datos.');
      return;
    }

    const interests = data.map((element) => ({
      name: element.name,
    }));

    await this.interestsRepository
      .createQueryBuilder()
      .insert()
      .into(Interest)
      .values(interests)
      .execute();

    console.log('Intereses precargados exitosamente.');
  }
}
