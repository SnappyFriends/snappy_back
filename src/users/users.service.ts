/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async getUsers() {
    const usersFound = await this.usersRepository.find({
      relations: ['stories', 'interests', 'privacy', 'responses', 'reportedReports', 'reportingReports', 'polls', 'posts', 'reactions', 'comments', 'groupMembers', 'userChatGroup']
    });

    const usersWithoutPassword = usersFound.map(({ password, ...userWithoutPassword }) => userWithoutPassword);

    return usersWithoutPassword;
  }

  async getUserById(id: string) {
    const userFound = await this.usersRepository.findOne({
      where: { id },
      relations: ['stories', 'interests', 'privacy', 'responses', 'reportedReports', 'reportingReports', 'polls', 'posts', 'reactions', 'comments', 'groupMembers', 'userChatGroup']
    })

    if (!userFound) throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);

    const { password, ...userWithoutPassword } = userFound;
    return userWithoutPassword;
  }

  async updateUser(id: string, userData: UpdateUserDTO) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData, 10);
    }

    const result = await this.usersRepository.update(id, userData);
    if (result.affected === 0) throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);

    const updatedUser = await this.usersRepository.findOne({ where: { id } })

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    const result = await this.usersRepository.delete(id);
    if(result.affected === 0) throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);

    return "Usuario eliminado correctamente.";
  }
}
