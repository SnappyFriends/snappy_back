import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as data from '../assets/users-seed.json';

@Injectable()
export class UsersSeederService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.seedUsers();
    }

    async seedUsers() {
        const userCount = await this.userRepository.count();
        if (userCount > 0) {
            console.log('Ya existen usuarios en la base de datos.');
            return;
        }

        const users = data.map((element) => ({
            fullname: element.fullname,
            username: element.username,
            email: element.email,
            password: element.password,
            profile_image: element.profile_image,
            location: element.location,
            birthdate: element.birthdate,
            genre: element.genre
        }));

        await this.userRepository
            .createQueryBuilder()
            .insert()
            .into(User)
            .values(users)
            .execute();

        console.log('Usuarios precargados exitosamente.');
    }
}
