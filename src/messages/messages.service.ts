import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message_Receiver, statusMessage } from './entities/message_Receiver.entity';

@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Message_Receiver) private readonly messageReceiverRepository: Repository<Message_Receiver>
  ) { }

  async createMessage(createMessageDto: CreateMessageDto) {

    const { sender_id, messageReceivers, ...messageData } = createMessageDto;

    const userFound = await this.userRepository.findOne({
      where: { id: sender_id }
    });

    if (!userFound) throw new NotFoundException(`User ${sender_id} not Found`);

    const newMsg = this.messageRepository.create({
      content: messageData.content,
      send_date: new Date(),
      type: messageData.type,
      sender_id: userFound,
      is_anonymous: !!messageData.is_anonymous
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
          message_id: savedMsg,
          receiver_id: receiverUser,
          status: statusMessage.UNREAD,
        });

        return newReceiver;

      })
    );

    await this.messageReceiverRepository.save(msgReceiversEntities);

    return savedMsg;

  }

  async findAllMessage() {
    const messages = await this.messageRepository.find({
      relations: ['sender_id', 'messageReceivers', 'messageReceivers.receiver_id']
    });

    const resultMessage = messages.map((message) => ({
      message: {
        message_id: message.message_id,
        send_date: message.send_date,
        type: message.type,
        content: message.content,
        is_anonymous: message.is_anonymous,
        sender_id: message.sender_id.id,

        receiver: message.messageReceivers.map((receiver) => ({
          receiverId: receiver.receiver_id.id,
          status: receiver.status
        }))
      },
    }));

    return resultMessage;
  }

  async findOneMessage(idMessage: string) {
    try {
      const getAllMessage = await this.messageRepository.findOne({
        where: { message_id: idMessage },
        relations: ['sender_id', 'messageReceivers', 'messageReceivers.receiver_id']
      })

      if (!getAllMessage) {
        throw new NotFoundException(`No se encuentra el mensaje con Id ${idMessage}`)
      }

      const resultMessage = {
        message_id: getAllMessage.message_id,
        send_date: getAllMessage.send_date,
        type: getAllMessage.type,
        content: getAllMessage.content,
        is_anonymous: getAllMessage.is_anonymous,
        sender_id: getAllMessage.sender_id.id,

        receiver: getAllMessage.messageReceivers.map((receiver) => ({
          receiverId: receiver.receiver_id.id,
          status: receiver.status
        }))

      }

      return resultMessage;

    } catch (error) {
      throw new BadRequestException('No se logro traer todos los mensajes.');
    }

  }

  async updateMessage(idUpdateMessage: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
    try {

      const updateMessage = await this.messageRepository.findOne({
        where: { message_id: idUpdateMessage },
        relations: ['sender_id', 'messageReceivers', 'messageReceivers.receiver_id'],
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
        where: { message_id: messageId },
        relations: ['sender_id', 'messageReceivers', 'messageReceivers.receiver_id'],
      })
      if (!deleteMessage) {
        throw new BadRequestException(`Mensaje con ID ${messageId} no encontrado`)
      }

      await this.messageReceiverRepository.delete({ message_id: deleteMessage });
      await this.messageRepository.delete(messageId);

      return { message: 'Mensaje eliminado exitosamente' }

    } catch (error) {
      throw new BadRequestException('No se pudo eliminar mensaje')
    }
  }
}
