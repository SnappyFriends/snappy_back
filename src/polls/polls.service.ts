import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll() {
    try {
      const polls = await this.pollsRepository.find({
        relations: ['responses', 'responses.user'],
      });

      const responseObject = polls.map((poll) => ({
        ...poll,
        responses: poll.responses.map((response) => ({
          ...response,
          user: {
            id: response.user.id,
          },
        })),
      }));
      return responseObject;
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al traer todos las encuestas. Inténtelo nuevamente.',
      );
    }
  }

  async findOne(poll_id: string) {
    try {
      const allResponses = await this.pollsRepository.find({
        where: { poll_id: poll_id },
        relations: ['responses', 'responses.user'],
      });

      if (!allResponses || allResponses.length === 0) {
        throw new NotFoundException(
          `Todavía no hay respuestas para la encuesta con id ${poll_id}`,
        );
      }
      const responseObject = allResponses.map((poll) => ({
        ...poll,
        responses: poll.responses.map((response) => ({
          ...response,
          user: {
            id: response.user.id,
          },
        })),
      }));

      return responseObject;
    } catch {
      throw new InternalServerErrorException(
        'No fue posible traer las respuestas para la encuesta.',
      );
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
