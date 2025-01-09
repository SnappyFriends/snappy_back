import { Controller, Post, Body } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { SendMailDTO } from './dto/create-nodemailer.dto';


@Controller('nodemailer')
export class NodemailerController {
  constructor(private readonly nodemailerService: NodemailerService) { }

  @Post('sendMail')
  async sendEmail(
    @Body() mailData: SendMailDTO) {
    const { to, subject, text, html } = mailData;
    return this.nodemailerService.sendEmail(to, subject, text, html);
  }

}
