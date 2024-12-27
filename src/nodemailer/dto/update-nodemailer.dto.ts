import { PartialType } from '@nestjs/swagger';
import { SendMailDTO } from './create-nodemailer.dto';

export class UpdateNodemailerDto extends PartialType(SendMailDTO) { }
