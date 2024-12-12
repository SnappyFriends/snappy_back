import { Injectable } from '@nestjs/common';
import { CreateReactionDto, UpdateReactionDto } from './dto/reaction.dto';

@Injectable()
export class ReactionsService {
  create(id: string, createReactionDto: CreateReactionDto) {
    console.log(createReactionDto.reaction_type);
    if (createReactionDto.reaction_type === 'comment') {
      return 'crea reaction a un comentario';
    } else return 'crea una reaccion a un post.';
  }

  findAll() {
    return `This action returns all reactions`;
  }

  findOne(id: string) {
    return `This action returns a #${id} reaction`;
  }

  update(id: string, updateReactionDto: UpdateReactionDto) {
    return `This action updates a #${id} reaction`;
  }

  remove(id: string) {
    return `This action removes a #${id} reaction`;
  }
}
