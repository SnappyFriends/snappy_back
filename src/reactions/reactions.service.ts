import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReactionDto, UpdateReactionDto } from './dto/reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionsRepository: Repository<Reaction>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async create(id: string, createReactionDto: CreateReactionDto) {
    const { reaction_type, reaction, user_id } = createReactionDto;

    if (reaction_type === 'comment') {
      const comment = await this.commentsRepository.findOne({
        where: { comment_id: id },
      });
      if (!comment) {
        throw new NotFoundException(
          `No se encontró el comentario con ID ${id}`,
        );
      }

      const newReaction = this.reactionsRepository.create({
        reaction_type: reaction,
        comment,
        user: { id: user_id },
      });

      return await this.reactionsRepository.save(newReaction);
    }

    if (reaction_type === 'post') {
      const post = await this.postsRepository.findOne({
        where: { post_id: id },
      });
      if (!post) {
        throw new NotFoundException(`No se encontró el post con ID ${id}`);
      }

      const newReaction = this.reactionsRepository.create({
        user: { id: user_id },
      });

      return await this.reactionsRepository.save(newReaction);
    }

    throw new BadRequestException(
      'El tipo de reacción proporcionado no es válido. Debe ser "comment" o "post".',
    );
  }

  async findAll(): Promise<Reaction[]> {
    const reactions = await this.reactionsRepository.find({
      relations: ['post', 'user'],
    });
    if (reactions.length === 0) {
      throw new NotFoundException('No hay reacciones disponibles.');
    }
    return reactions;
  }

  async findOne(id: string): Promise<Reaction> {
    const reaction = await this.reactionsRepository.findOne({
      where: { reaction_id: id },
      relations: ['post', 'user'],
    });
    if (!reaction) {
      throw new NotFoundException(`No se encontró la reacción con ID ${id}`);
    }
    return reaction;
  }

  async update(
    id: string,
    updateReactionDto: UpdateReactionDto,
  ): Promise<Reaction> {
    const reaction = await this.reactionsRepository.findOne({
      where: { reaction_id: id },
    });
    if (!reaction) {
      throw new NotFoundException(`No se encontró la reacción con ID ${id}`);
    }

    Object.assign(reaction, updateReactionDto);
    return await this.reactionsRepository.save(reaction);
  }

  async remove(id: string): Promise<{ message: string }> {
    const reaction = await this.reactionsRepository.findOne({
      where: { reaction_id: id },
    });
    if (!reaction) {
      throw new NotFoundException(`No se encontró la reacción con ID ${id}`);
    }

    await this.reactionsRepository.remove(reaction);
    return { message: `Reacción con ID ${id} eliminada correctamente` };
  }
}
