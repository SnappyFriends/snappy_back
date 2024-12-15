import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';



@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {

      const { userId, messageReceivers, ...messageData } = createMessageDto;

      const userFound = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!userFound) throw new NotFoundException(`User ${userId} not Found`);

      const newMsg = this.messageRepository.create({
        ...messageData,
        user: userFound,
        send_date: new Date(),
      })

      const savedMessage = await this.messageRepository.save(newMsg);

      return savedMessage;

    } catch (error) {
      throw new BadRequestException('Ocurrió un error inesperado al crear un message. Inténtelo de nuevo.',
      );
    }
  }

  async findAllMessage(): Promise<Message[]> {
    try {
      const message = await this.messageRepository.find({
        relations: ['messageReceivers', 'messageReceivers.receiver'],
      })

      const messageReceivers = message.map((message) => ({
        ...message,
        messageReceivers: message.messageReceivers.map((messageReceivers) => ({
          ...messageReceivers,
          user: {
            id: messageReceivers.receiver.id
          },
        })),
      }));

      return messageReceivers;
    } catch (error) {
      throw new BadRequestException('Ocurrió un error inesperado al traer todos los Messages. Inténtelo nuevamente.',
      );
    }
  }

  async findOneMessage(idMessage: string) {
    try {
      const getAllMessage = await this.messageRepository.find({
        where: { id: idMessage },
        relations: ['messageReceivers', 'messageReceivers.receiver']
      })

      if (!getAllMessage || getAllMessage.length === 0) {
        throw new NotFoundException(`No se encuentra el mensaje con Id ${idMessage}`)
      }

      const messageObject = getAllMessage.map((message) => ({
        ...message,
        messageReceivers: message.messageReceivers.map((messageReceivers) => ({
          ...message,
          user: {
            id: messageReceivers.receiver.id,
            name: messageReceivers.receiver.fullname
          },
        })),
      }));

      return messageObject;

    } catch (error) {
      throw new BadRequestException('No se logro traer todos los mensajes.');
    }

  }

  updateMessage(id: string, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  deleteMessage(id: string) {
    return `This action removes a #${id} message`;
  }
}
