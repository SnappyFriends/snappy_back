import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';


@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>) { }

  async createMessage(message: Partial<Message>) {
    const newMessage = this.messageRepository.create(message);
    return this.messageRepository.save(newMessage)

  }

  async findAllMessage() {
    return this.messageRepository.find()
  }

  async findOneMessage(id: string) {
    return await this.messageRepository.findOne({
      where: { id }
    })
  }

  updateMessage(id: string, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  deleteMessage(id: string) {
    return `This action removes a #${id} message`;
  }
}
