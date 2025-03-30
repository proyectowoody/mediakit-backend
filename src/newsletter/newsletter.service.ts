import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import 'dotenv/config';
import { nodemailerTransport } from '../user/mailer.config';

@Injectable()
export class NewsletterService {
  async newsletter({ email }: { email: string }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

    if (!emailRegex.test(email)) {
      throw new BadRequestException('Ingrese un correo válido.');
    }

    await this.envioEmailSuscribe(email);

    return {
      message: 'Suscrito correctamente.',
    };
  }

  async envioEmailSuscribe(email) {
    let filePath: string;

    filePath = path.resolve(
      process.cwd(),
      'src/newsletter/plantillaNewsLetter.html',
    );

    const htmlTemplate = fs.readFileSync(filePath, 'utf8');
    const personalizedHtml = htmlTemplate.replace('{{email}}', email);

    await nodemailerTransport.sendMail({
      to: process.env.GMAIL_USER,
      subject: 'Correo de respectful-shoes',
      html: personalizedHtml,
    });
  }
}
