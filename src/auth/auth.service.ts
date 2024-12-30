/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { registerUserDTO } from './dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {

  constructor(@InjectRepository(User) private usersRepository: Repository<User>, private jwtService: JwtService) { }

  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    const user_type = payload.user_type

    return { userId, token, user_type, message: "Iniciaste sesión satisfactoriamente." };
  }

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token de Google no válido');
    }
  }

  async googleLogin(googleToken: string) {
    const payload = await this.verifyGoogleToken(googleToken);

    if (!payload) {
      throw new UnauthorizedException('Credenciales de Google inválidas');
    }

    const { email, name, sub: googleId, picture } = payload;

    let user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      user = this.usersRepository.create({
        fullname: name,
        email,
        username: email.split('@')[0],
        genre: 'unknown',
        birthdate: '1900-01-01',
        profile_image: picture,
        googleId,
      });

      await this.usersRepository.save(user);
    }

    const jwtPayload = {
      id: user.id,
      email: user.email,
      user_type: user.user_type || 'standard',
    };

    const token = this.jwtService.sign(jwtPayload);

    return { userId: user.id, token, user_type: user.user_type };
  }
}
