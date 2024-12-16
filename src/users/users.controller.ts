import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('username/:username')
  async getUserByUsername(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @Put(':id')
  async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() userData: UpdateUserDTO) {
    return this.usersService.updateUser(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post(':userId/assign-interest/:interestId')
  async assignInterestToUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('interestId', ParseUUIDPipe) interestId: string,
  ) {
    return this.usersService.assignInterestToUser(userId, interestId);
  }
}
