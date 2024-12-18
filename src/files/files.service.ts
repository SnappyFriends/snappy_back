import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
    constructor(private fileRepository: FilesRepository, @InjectRepository(User) private usersRepository: Repository<User>) { }

    async uploadImg(userId: string, fileImg: Express.Multer.File) {
        const userFound = await this.usersRepository.findOneBy({id: userId})

        if(!userFound) throw new NotFoundException('User not found.');

        const uploadFileImg = await this.fileRepository.uploadImg(fileImg);

        await this.usersRepository.update(userFound.id, { profile_image: uploadFileImg.secure_url })

        return await this.usersRepository.findOneBy({ id: userId });
    }
}
