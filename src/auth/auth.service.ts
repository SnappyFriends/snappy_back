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
    const foundUser = await this.usersRepository.findOneBy({ email: registerData.email });

    if (foundUser) throw new ConflictException('El usuario ya se encuentra registrado.');

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

    return { token, message: "Iniciaste sesión satisfactoriamente." };
  }
}
