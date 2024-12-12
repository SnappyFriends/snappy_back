import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async getUsers() {
    return await this.usersRepository.find({
      relations: ['stories', 'interests', 'privacy', 'friendships1', 'friendships2', 'responses', 'reportedReports', 'reportingReports', 'polls', 'posts', 'reactions', 'comments', 'groupMembers', 'userChatGroup']
    });
  }

  getUserById(id: number) {
    return `This action returns a #${id} user`;
  }

  updateUser(id: number, userData: UpdateUserDTO) {
    return `This action updates a #${id} user. ${userData}`;
  }

  deleteUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
