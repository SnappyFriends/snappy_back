import { Injectable } from '@nestjs/common';
import { CreatePollResponseDto } from './dto/create-poll-response.dto';
import { UpdatePollResponseDto } from './dto/update-poll-response.dto';

@Injectable()
export class PollResponseService {
  create(createPollResponseDto: CreatePollResponseDto) {
    return 'This action adds a new pollResponse';
  }

  findAll() {
    return `This action returns all pollResponse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pollResponse`;
  }

  update(id: number, updatePollResponseDto: UpdatePollResponseDto) {
    return `This action updates a #${id} pollResponse`;
  }

  remove(id: number) {
    return `This action removes a #${id} pollResponse`;
  }
}
