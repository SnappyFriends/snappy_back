import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.usersRepository.create(createUserDto);

      console.log(newUser);
      return await this.usersRepository.save(newUser);
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al crear el user. Inténtelo de nuevo. ',
      );
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, userData: UpdateUserDTO) {
    return `This action updates a #${id} user. ${userData}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
