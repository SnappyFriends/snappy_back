/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { registerUserDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>, private jwtService: JwtService) { }

  async signUp(registerData: registerUserDTO) {
    const foundEmail = await this.usersRepository.findOneBy({ email: registerData.email });
    if (foundEmail) throw new ConflictException('El email ya se encuentra registrado.');

    const foundUsername = await this.usersRepository.findOneBy({ username: registerData.username });
    if (foundUsername) throw new ConflictException('El nombre de usuario ya está registrado.');

    if (registerData.password) {
      const hashedPassword = await bcrypt.hash(registerData.password, 10);
      const newUser = { ...registerData, password: hashedPassword }

      await this.usersRepository.save(newUser);

      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } else {
      await this.usersRepository.save(registerData);

      return registerData;
    }
  }

  async signIn(email: string, password: string) {
    const foundUser = await this.usersRepository.findOneBy({ email });

    if (!foundUser) throw new BadRequestException('Credenciales invalidas.');

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) throw new BadRequestException('Credenciales invalidas.');

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      user_type: foundUser.user_type
    }

    const token = this.jwtService.sign(payload);

    const userId = payload.id

    return { userId, token, message: "Iniciaste sesión satisfactoriamente." };
  }
}
