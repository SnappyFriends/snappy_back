/* eslint-disable @typescript-eslint/no-unused-vars */
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
    const foundUsers = await this.usersRepository.find({
      relations: ['stories', 'interests', 'privacy', 'responses', 'reportedReports', 'reportingReports', 'polls', 'posts', 'reactions', 'comments', 'groupMembers', 'userChatGroup']
    });

    const usersWithoutPassword = foundUsers.map(({ password, ...userWithoutPassword }) => userWithoutPassword);

    return usersWithoutPassword;
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
