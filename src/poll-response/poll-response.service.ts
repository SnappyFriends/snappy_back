import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePollResponseDto } from './dto/create-poll-response.dto';
import { PollResponse } from './entities/poll-response.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Poll } from 'src/polls/entities/poll.entity';

@Injectable()
export class PollResponseService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(PollResponse)
    private pollResponseRepository: Repository<PollResponse>,
  ) {}

  async create(
    poll_id: string,
    createPollResponseDto: CreatePollResponseDto,
  ): Promise<PollResponse> {
    try {
      const { selected_option, user_id } = createPollResponseDto;

      const poll = await this.pollsRepository.findOne({ where: { poll_id } });
      if (!poll) {
        throw new BadRequestException('Encuesta no encontrada');
      }

      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }

      const newResponse = this.pollResponseRepository.create({
        selected_option,
        poll,
        user,
      });

      return await this.pollResponseRepository.save(newResponse);
    } catch {
      throw new BadRequestException(
        'Ocurrió un error al crear la respuesta de la encuesta',
      );
    }
  }

  findAll() {
    return `This action returns all pollResponse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pollResponse`;
  }

  remove(id: number) {
    return `This action removes a #${id} pollResponse`;
  }
}
