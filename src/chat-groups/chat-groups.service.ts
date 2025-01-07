import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { UpdateChatGroupDto } from './dto/update-chat-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat_Groups } from './entities/chat-group.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatGroupsService {
  constructor(
    @InjectRepository(Chat_Groups)
    private chatGroupsRepository: Repository<Chat_Groups>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createChatGroupDto: CreateChatGroupDto) {
    console.log('DATA RECIBIDA:', createChatGroupDto);
    const { creator_id, name, description, privacy } = createChatGroupDto;

    const findCreator = await this.usersRepository.findOne({
      where: { id: creator_id },
    });

    if (!findCreator) {
      throw new NotFoundException(
        `El creador con id ${creator_id} no se ha encontrado.`,
      );
    }

    const findName = await this.chatGroupsRepository.findOne({
      where: { name: name },
    });

    if (findName) {
      throw new BadRequestException(
        `El chat de grupo con el nombre ${name} ya existe. Intente con otro nombre.`,
      );
    }

    const newChatGroup = this.chatGroupsRepository.create({
      name: name,
      description: description,
      privacy: privacy,
      creator: findCreator,
    });

    await this.chatGroupsRepository.save(newChatGroup);

    const responseObject = {
      name: newChatGroup.name,
      description: newChatGroup.description,
      privacy: newChatGroup.privacy,
      creator: {
        id: newChatGroup.creator.id,
        fullname: newChatGroup.creator.fullname,
        username: newChatGroup.creator.username,
      },
      group_id: newChatGroup.group_id,
      creation_date: newChatGroup.creation_date,
    };

    return responseObject;
  }

  async findAll() {
    try {
      const chatGroups = await this.chatGroupsRepository.find({
        relations: ['groupMembers'],
      });

      return chatGroups;
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al traer todos los chats de grupos. Inténtelo nuevamente.',
      );
    }
  }

  async findOne(id: string) {
    try {
      const foundGroupChat = await this.chatGroupsRepository.findOne({
        where: { group_id: id },
        relations: ['groupMembers'],
      });

      if (!foundGroupChat) {
        throw new NotFoundException(
          `El chat de grupos con el id ${id} no fue encontrado.`,
        );
      }

      return foundGroupChat;
    } catch {
      throw new InternalServerErrorException(
        `Ocurrió un error al ejecutar la solicitud. Revise los datos e intente nuevamente.`,
      );
    }
  }

  async update(id: string, updateChatGroupDto: UpdateChatGroupDto) {
    try {
      const foundGroupChat = await this.chatGroupsRepository.findOne({
        where: { group_id: id },
        relations: ['groupMembers'],
      });

      if (!foundGroupChat) {
        throw new NotFoundException(
          `El chat de grupos con el id ${id} no fue encontrado.`,
        );
      }

      Object.assign(foundGroupChat, updateChatGroupDto);
      return await this.chatGroupsRepository.save(foundGroupChat);
    } catch {
      throw new BadRequestException(
        `Por favor, verifique nuevamente los datos ingresados.`,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const groupChat = await this.chatGroupsRepository.findOne({
        where: { group_id: id },
      });
      if (!groupChat) {
        throw new BadRequestException('Chat de grupo no encontrado.');
      }
      await this.chatGroupsRepository.remove(groupChat);
      return {
        message: `Chat de grupo con id ${id} borrado de forma exitosa.`,
      };
    } catch {
      throw new BadRequestException('Chat de grupo no encontrado.');
    }
  }

  async getAllMessagesByGroupId(group_id: string) {
    const groupMessagesFound = await this.chatGroupsRepository.find({
      where: { group_id },
      relations: ['groupMembers', 'messages'],
    });

    return groupMessagesFound;
  }
}
