import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrivacyDto } from './dto/create-privacy.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Privacy } from './entities/privacy.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PrivacyService {
  constructor(
    @InjectRepository(Privacy) private privacyRepository: Repository<Privacy>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    userId: string,
    createPrivacyDto: CreatePrivacyDto,
  ): Promise<Privacy> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`El usuario con id ${userId} no existe.`);
    }

    const newPrivacySettings = this.privacyRepository.create({
      ...createPrivacyDto,
      user: { id: userId },
    });

    return await this.privacyRepository.save(newPrivacySettings);
  }

  async findOne(id: string) {
    const privacySettings = await this.privacyRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (!privacySettings) {
      throw new NotFoundException(
        `No se encontraron ajustes de privacidad con el id ${id}`,
      );
    }

    if (!privacySettings.user) {
      throw new NotFoundException(
        `El ajuste de privacidad con id ${id} no tiene un usuario asociado.`,
      );
    }

    const privacyObject = {
      id,
      commentPermissions: privacySettings.comment_permissions,
      anonymousMessagePermissions:
        privacySettings.anonymous_message_permissions,
      enableSeenReceipt: privacySettings.enable_seen_receipt,
      recommendUsers: privacySettings.recommend_users,
      userId: privacySettings.user.id,
    };

    return privacyObject;
  }

  async update(
    id: string,
    updatePrivacyDto: UpdatePrivacyDto,
  ): Promise<Privacy> {
    const privacySettings = await this.privacyRepository.findOne({
      where: { id: id },
    });
    Object.assign(privacySettings, updatePrivacyDto);
    return this.privacyRepository.save(privacySettings);
  }
}
