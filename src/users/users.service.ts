/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUsersDTO, UpdateUserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Interest } from 'src/interests/entities/interests.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  async getUsers(filters: GetUsersDTO) {
    const { page = 1, limit = 10, interests, username } = filters;

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.interests', 'interest')
      .skip((page - 1) * limit)
      .take(limit);

    if (interests && Array.isArray(interests) && interests.length > 0) {
      queryBuilder.andWhere('interest.name IN (:...interests)', { interests });
    } else if (interests && !Array.isArray(interests)) {
      queryBuilder.andWhere('interest.name IN (:...interests)', {
        interests: [interests],
      });
    }

    if (username)
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });

    const usersFound = await queryBuilder.getMany();

    if (!usersFound || usersFound.length === 0) return [];

    const usersWithoutPassword = usersFound.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );

    return usersWithoutPassword;
  }

  async getUserById(id: string) {
    const userFound = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'stories',
        'interests',
        'privacy',
        'responses',
        'reportedReports',
        'reportingReports',
        'polls',
        'posts',
        'reactions',
        'comments',
        'groupMembers',
      ],
    });

    if (!userFound)
      throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);

    const { password, ...userWithoutPassword } = userFound;
    return userWithoutPassword;
  }

  async getUserByUsername(username: string) {
    const userFound = await this.usersRepository.findOne({
      where: { username },
      relations: [
        'stories',
        'interests',
        'privacy',
        'responses',
        'reportedReports',
        'reportingReports',
        'polls',
        'posts',
        'reactions',
        'comments',
        'groupMembers',
      ],
    });

    if (!userFound)
      throw new NotFoundException(
        `No se encontró un usuario con el username ${username}`,
      );

    const { password, ...userWithoutPassword } = userFound;
    return userWithoutPassword;
  }

  async updateUser(id: string, userData: UpdateUserDTO) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const result = await this.usersRepository.update(id, userData);
    if (result.affected === 0)
      throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);

    const updatedUser = await this.usersRepository.findOne({ where: { id } });

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);

    return 'Usuario eliminado correctamente.';
  }

  async assignInterestToUser(userId: string, interestId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    if (!user)
      throw new NotFoundException(
        `No se encontró el usuario con el ID ${userId}`,
      );

    const interest = await this.interestsRepository.findOne({
      where: { interest_id: interestId },
    });
    if (!interest)
      throw new NotFoundException(
        `No se encontró el interés con el ID ${interestId}`,
      );

    if (
      user.interests.some(
        (existingInterest) => existingInterest.interest_id === interestId,
      )
    )
      throw new NotFoundException(`El usuario ya tiene este interés`);

    user.interests.push(interest);
    await this.usersRepository.save(user);

    return {
      message: 'Interés asignado al usuario',
      usuario: user.username,
      interests: user.interests,
    };
  }

  async removeInterestToUser(userId: string, interestId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    if (!user)
      throw new NotFoundException(
        `No se encontró el usuario con el ID ${userId}`,
      );

    const interest = await this.interestsRepository.findOne({
      where: { interest_id: interestId },
    });
    if (!interest)
      throw new NotFoundException(
        `No se encontró el interés con el ID ${interestId}`,
      );

    const userInterest = user.interests.findIndex(
      (existingInterest) => existingInterest.interest_id === interestId,
    );
    if (userInterest === -1)
      throw new NotFoundException(`El usuario no tiene este interés asignado`);

    user.interests.splice(userInterest, 1);

    await this.usersRepository.save(user);

    return {
      message: 'Interés removido del usuario',
      usuario: user.username,
      interests: user.interests,
    };
  }
}
