import { Injectable } from '@nestjs/common';
import { mailFrom, mailTransporter } from 'src/config/mail';


@Injectable()
export class NodemailerService {

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<{ message: string }> {
    try {
      const mailOptions = {
        from: mailFrom,
        to,
        subject,
        text,
        html,
      };
      await mailTransporter.sendMail(mailOptions)
      return { message: 'Correo enviado con éxito' };

    } catch (error) {
      console.error('Error al enviar el correo:', error.message)
      throw new Error('No se pudo enviar el correo. Verifica las credenciales o la configuración.');
    }

  }

}
