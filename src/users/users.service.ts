import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, userData: UpdateUserDTO) {
    return `This action updates a #${id} user. ${userData}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
