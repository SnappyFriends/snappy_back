import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post-dto';
import { CreatePostDto } from './dto/create-post-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async create(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const { userId, ...postData } = createPostDto;

      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('El usuario no existe');
      }

      const newPost = this.postsRepository.create({
        ...postData,
        user,
      });

      return await this.postsRepository.save(newPost);
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al crear el post. Inténtelo de nuevo.',
      );
    }
  }

  async findAll() {
    try {
      const posts = await this.postsRepository.find({
        relations: ['reactions', 'user'],
      });

      const responseObject = posts.map((post) => ({
        ...post,
        user: {
          id: post.user.id,
        },
      }));
      return responseObject;
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al traer todos los posts. Inténtelo nuevamente.',
      );
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.postsRepository.findOne({
        where: { post_id: id },
        relations: ['user'],
      });
      if (!post) {
        throw new BadRequestException('Post not found.');
      }
      const responseObject = {
        ...post,
        user: {
          id: post.user.id,
        },
      };

      return responseObject;
    } catch {
      throw new BadRequestException('Post not found.');
    }
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post | string> {
    try {
      const post = await this.postsRepository.findOne({
        where: { post_id: id },
      });

      if (!post) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }

      Object.assign(post, updatePostDto);

      return await this.postsRepository.save(post);
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException(
          'Ocurrió un error al actualizar el post. Por favor, verifique los datos.',
        );
      }

      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const post = await this.postsRepository.findOne({
        where: { post_id: id },
      });
      if (!post) {
        throw new BadRequestException('Post not found.');
      }
      await this.postsRepository.remove(post);
      return { message: `Post with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('Post not found');
    }
  }
}
