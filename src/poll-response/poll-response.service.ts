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

  async findOne(id: string): Promise<PollResponse> {
    try {
      const pollResponse = await this.pollResponseRepository.findOne({
        where: { response_id: id },
      });
      if (!pollResponse) {
        throw new BadRequestException('Poll Response not found.');
      }
      return pollResponse;
    } catch {
      throw new BadRequestException('Poll Response not found.');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const pollResponse = await this.pollResponseRepository.findOne({
        where: { response_id: id },
      });
      if (!pollResponse) {
        throw new BadRequestException('Poll Response not found.');
      }
      await this.pollResponseRepository.remove(pollResponse);
      return { message: `Poll Response with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('Poll Response not found');
    }
  }
}
