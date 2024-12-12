import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll) private pollsRepository: Repository<Poll>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(id: string, createPollDto: CreatePollDto): Promise<Poll> {
    try {
      const { options, ...postData } = createPollDto;

      if (options.length > 5) {
        throw new BadRequestException('No puedes tener más de 5 opciones.');
      }

      const user = await this.usersRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new BadRequestException('El usuario no existe');
      }

      const newPoll = this.pollsRepository.create({
        ...postData,
        options,
        user,
      });

      return await this.pollsRepository.save(newPoll);
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al crear la encuesta. Inténtelo de nuevo.',
      );
    }
  }

  async findAll(): Promise<Poll[]> {
    try {
      return await this.pollsRepository.find({ relations: ['responses'] });
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al traer todos las encuestas. Inténtelo nuevamente.',
      );
    }
  }

  async findOne(id: string): Promise<Poll> {
    try {
      const poll = await this.pollsRepository.findOne({
        where: { poll_id: id },
      });
      if (!poll) {
        throw new BadRequestException('Poll not found.');
      }
      return poll;
    } catch {
      throw new BadRequestException('Poll not found.');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const poll = await this.pollsRepository.findOne({
        where: { poll_id: id },
      });
      if (!poll) {
        throw new BadRequestException('Poll not found.');
      }
      await this.pollsRepository.remove(poll);
      return { message: `Poll with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('Poll not found');
    }
  }
}
