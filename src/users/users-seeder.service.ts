import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, userType } from './entities/user.entity';
import * as data from '../assets/users-seed.json';
import * as bcrypt from "bcrypt";

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

        const superadminUsername = process.env.SUPERADMIN_USER;
        const superadminPassword = process.env.SUPERADMIN_PASSWORD;
        const superadminEmail = process.env.SUPERADMIN_EMAIL;

        const hashedPassword = await bcrypt.hash(superadminPassword, 10);

        const superadmin = this.userRepository.create({
            fullname: 'Snappy Friends',
            username: superadminUsername,
            email: superadminEmail,
            password: hashedPassword,
            profile_image: 'snappyfriends.png',
            location: 'Argentina',
            birthdate: '2000-01-01',
            genre: 'SNAPPY',
            user_type: userType.SUPERADMIN
        });

        await this.userRepository.save(superadmin);

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
