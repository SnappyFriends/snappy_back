import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message_Receiver, MessageReceiver } from './entities/message_Receiver.entity';



@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Message_Receiver) private readonly messageReceiverRepository: Repository<Message_Receiver>
  ) { }

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {

      const { userId, messageReceivers, ...messageData } = createMessageDto;

      const userFound = await this.userRepository.findOne({
        where: { id: userId }
      });

      if (!userFound) throw new NotFoundException(`User ${userId} not Found`);

      const newMsg = this.messageRepository.create({
        content: messageData.content,
        type: messageData.type,
        is_anonymous: !!messageData.is_anonymous,
        user: userFound,
        send_date: new Date(),
      });

      const savedMsg = await this.messageRepository.save(newMsg);

      const msgReceiversEntities = await Promise.all(
        messageReceivers.map(async (receiverId) => {

          const receiverUser = await this.userRepository.findOne({
            where: { id: receiverId }
          });

          if (!receiverUser) {
            throw new NotFoundException(`Receiver with ID ${receiverId} not found`);
          }

          const newReceiver = this.messageReceiverRepository.create({
            message: { message_id: savedMsg.message_id },
            receiver: { id: receiverUser.id },
            message_Receiver: MessageReceiver.UNREAD,
          });

          return newReceiver;

        })
      );

      const validReceivers = msgReceiversEntities.filter((receiver) => receiver !== null);

      if (validReceivers.length === 0) {
        throw new BadRequestException('No se encontraron receptores válidos.');
      }

      await this.messageReceiverRepository.save(validReceivers);

      return savedMsg;

    } catch (error) {
      throw new BadRequestException('Ocurrió un error inesperado al crear un message. Inténtelo de nuevo.',
      );
    }
  }

  async findAllMessage() {

    try {
      const messages = await this.messageRepository.find({
        relations: ['user'],
      });

      const resultMessage = messages.map((message) => ({
        ...message,
        user: {
          id: message.user.id,
        },
      }));

      return resultMessage;

    } catch (error) {
      throw new BadRequestException('Ocurrió un error inesperado al traer todos los Messages. Inténtelo nuevamente.',
      );
    }
  }

  async findOneMessage(idMessage: string) {
    try {
      const getAllMessage = await this.messageRepository.find({
        where: { message_id: idMessage },
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

  async updateMessage(idUpdateMessage: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
    try {

      const updateMessage = await this.messageRepository.findOne({
        where: { content: idUpdateMessage },
        relations: ['user', 'messageReceivers'],
      })

      if (!updateMessage) {
        throw new NotFoundException(`Mensaje con ID ${idUpdateMessage} no encontrado`);

      }

      Object.assign(updateMessage,
        {
          ...updateMessageDto,
          send_date: new Date()
        })

      const savedUpdateMessage = await this.messageRepository.save(updateMessage)
      return savedUpdateMessage;

    } catch (error) {
      throw new NotFoundException('No pudo actualizar el mensaje')
    }
  }

  async deleteMessage(messageId: string): Promise<{ message: string }> {
    try {
      const deleteMessage = await this.messageRepository.findOne({
        where: { message_id: messageId }
      })
      if (!deleteMessage) {
        throw new BadRequestException(`Mensaje con ID ${messageId} no encontrado`)
      }
      await this.messageRepository.remove(deleteMessage)
      return { message: 'Mensaje eliminado exitosamente' }

    } catch (error) {
      throw new BadRequestException('No se pudo eliminar mensaje')
    }
  }
}
