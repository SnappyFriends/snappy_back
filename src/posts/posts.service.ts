import { BadRequestException, Injectable } from '@nestjs/common';
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

      console.log(newPost);
      return await this.postsRepository.save(newPost);
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al crear el post. Inténtelo de nuevo.',
      );
    }
  }

  async findAll(): Promise<Post[]> {
    try {
      return await this.postsRepository.find({
        relations: ['reactions', 'user'],
      });
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al traer todos los posts. Inténtelo nuevamente.',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
