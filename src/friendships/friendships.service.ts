import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship, FriendshipStatus } from './entities/friendship.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FriendshipsService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipsRepository: Repository<Friendship>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async addFriend(
    requestingUserId: string,
    targetUserId: string,
  ): Promise<Friendship | { message: string; friendship: Friendship }> {
    try {
      const targetUser = await this.usersRepository.findOne({
        where: { id: targetUserId },
      });

      if (!targetUser) {
        throw new NotFoundException(
          `El usuario con ID ${targetUserId} no fue encontrado.`,
        );
      }

      const existingFriendship = await this.friendshipsRepository.findOne({
        where: [
          { user1: { id: requestingUserId }, user2: { id: targetUserId } },
          { user1: { id: targetUserId }, user2: { id: requestingUserId } },
        ],
      });

      if (existingFriendship) {
        switch (existingFriendship.status) {
          case FriendshipStatus.ACCEPTED:
            throw new ConflictException(
              `Ya existe una relación de amistad entre ${requestingUserId} y ${targetUserId}.`,
            );
          case FriendshipStatus.PENDING:
            return {
              message: `Ya se ha enviado una solicitud de amistad a ${targetUserId}.`,
              friendship: existingFriendship,
            };
          default:
            throw new ConflictException(
              `La relación de amistad tiene un estado no esperado: ${existingFriendship.status}.`,
            );
        }
      }

      const newFriendship = this.friendshipsRepository.create({
        user1: { id: requestingUserId },
        user2: { id: targetUserId },
        status: FriendshipStatus.PENDING,
      });

      return await this.friendshipsRepository.save(newFriendship);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al agregar un amigo.');
    }
  }

  async acceptFriendship(friendshipId: string): Promise<Friendship> {
    try {
      const friendship = await this.friendshipsRepository.findOne({
        where: { id: friendshipId },
      });

      if (!friendship) {
        throw new NotFoundException(
          `La amistad con ID ${friendshipId} no fue encontrada.`,
        );
      }

      friendship.status = FriendshipStatus.ACCEPTED;
      return await this.friendshipsRepository.save(friendship);
    } catch {
      throw new InternalServerErrorException('Error al aceptar la amistad.');
    }
  }

  async findAllForUser(userId: string) {
    try {
      const friendships = await this.friendshipsRepository.find({
        where: [{ user1: { id: userId } }, { user2: { id: userId } }],
        relations: ['user1', 'user2'],
      });

      const responseObject = friendships.map((friendship) => ({
        ...friendship,
        user1: { id: friendship.id },
        user2: { id: friendship.id },
      }));

      return responseObject;
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al traer toda la lista de amigos. Inténtelo nuevamente.',
      );
    }
  }

  async removeFriendship(userId: string) {
    try {
      const eliminateUser = await this.friendshipsRepository.findOne({
        where: { id: userId },
      });

      if (!eliminateUser) {
        throw new NotFoundException(
          `El usuario con el id ${userId} no fue encontrado.`,
        );
      }

      eliminateUser.status = FriendshipStatus.DELETED;
      await this.friendshipsRepository.save(eliminateUser);
      return { message: `Friendship con ID ${userId} eliminada correctamente` }

    } catch {
      throw new InternalServerErrorException(
        'Error al intentar eliminar la relación de amistad.',
      );
    }
  }
}
