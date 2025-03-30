import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { nodemailerTransport } from '../user/mailer.config';
import 'dotenv/config';

interface ContactData {
  name: string;
  email: string;
  message: string;
  phone: string;
  city: string;
  subject: string;
}

@Injectable()
export class ContactService {
  constructor() {}

  async send({ name, email, phone, city, subject, message }: ContactData) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

    if (!emailRegex.test(email)) {
      throw new BadRequestException('Ingrese un correo válido.');
    }

    await this.envioEmail(name, email, phone, city, subject, message);

    return {
      message: 'Mensaje enviado correctamente.',
    };
  }

  async envioEmail(name, email, phone, city, subject, message) {
    let filePath: string;

    filePath = path.resolve(process.cwd(), 'src/contact/plantillaMessage.html');

    const htmlTemplate = fs.readFileSync(filePath, 'utf8');
    const personalizedHtml = htmlTemplate
      .replace('{{name}}', name)
      .replace('{{email}}', email)
      .replace('{{phone}}', phone)
      .replace('{{city}}', city)
      .replace('{{subject}}', subject)
      .replace('{{message}}', message);

    await nodemailerTransport.sendMail({
      to: process.env.GMAIL_USER,
      subject: 'Correo de respectful-shoes',
      html: personalizedHtml,
    });
  }
}
