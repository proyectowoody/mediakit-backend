import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import * as path from 'path';
import * as fs from 'fs';
import { MailerService } from '@nestjs-modules/mailer';
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

  constructor(
    private readonly mailerService: MailerService,
  ) { }

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

    filePath = path.resolve(
      process.cwd(),
      'src/contact/plantillaMessage.html',
    );

    const htmlTemplate = fs.readFileSync(filePath, 'utf8');
    const personalizedHtml = htmlTemplate
      .replace('{{name}}', name)
      .replace('{{email}}', email)
      .replace('{{phone}}', phone)
      .replace('{{city}}', city)
      .replace('{{subject}}', subject)
      .replace('{{message}}', message)

    await this.mailerService.sendMail({
      to: process.env.GMAIL_USER,
      subject: 'Correo de respectful-shoes',
      html: personalizedHtml,
    });
  }

  async sendCustom({ email }: { email: string }) {

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
      'src/contact/plantillaSuscribe.html',
    );

    const htmlTemplate = fs.readFileSync(filePath, 'utf8');
    const personalizedHtml = htmlTemplate
      .replace('{{email}}', email)

    await this.mailerService.sendMail({
      to: process.env.GMAIL_USER,
      subject: 'Correo de respectful-shoes',
      html: personalizedHtml,
    });
  }

}
