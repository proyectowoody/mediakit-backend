import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/registerDto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import * as fs from 'fs';
import { MailerService } from '@nestjs-modules/mailer';
import { LoginDto } from './dto/loginDto';
import { EmailDto } from './dto/emailDto';
import { PasswordDto } from './dto/passwordDto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/userDto';
import { URL_FRONTEND } from '../url';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) { }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async register({ password, email, name, lastName }: RegisterDto) {
    const user = await this.usersRepository.findOneBy({ email });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

    if (user) {
      throw new BadRequestException('Credenciales inválidas');
    }

    if (!emailRegex.test(email)) {
      throw new BadRequestException('Ingrese un correo válido.');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const role = 'client';
    const newUser = this.usersRepository.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false,
      role: role,
    });

    await this.usersRepository.save(newUser);

    const Usuario = { email, role };

    await this.envioEmail(Usuario, email, 'register');

    return { message: 'Registro exitoso, verifique su correo.' };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Correo inválido');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña inválida');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Su cuenta no está verificada');
    }

    const payload = {
      email,
      user: user.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      jwtid: `${Date.now()}`,
    });

    return { token };
  }

  async email({ email }: EmailDto) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Correo enviado (si existe en la base de datos).');
    }

    await this.envioEmail(user, email, 'verificacion');

    return;
  }

  async password(email: string, passDto: PasswordDto) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (passDto.password !== passDto.verPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const hashedNewPassword = await bcryptjs.hash(passDto.password, 10);

    await this.usersRepository.update({ email }, { password: hashedNewPassword });

    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      jwtid: `${Date.now()}`,
    });

    return { token, message: 'Contraseña actualizada' };
  }

  async token(email: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.usersRepository.update({ email }, { isVerified: true });

    const payload = { email, user: user.role };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      jwtid: `${Date.now()}`,
    });

    return { token };
  }

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  async envioEmail(user: any, email: string, correo: string) {

    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '5m',
      jwtid: `${Date.now()}`,
    });

    let url: string;
    let filePath: string;

    const baseUrl = URL_FRONTEND;

    if (correo === 'register') {
      url = `${baseUrl}/login?token=${token}`;
      filePath = path.resolve(process.cwd(), 'src/user/html/plantillaReg.html');
    } else if (correo === 'verificacion') {
      url = `${baseUrl}/password?token=${token}`;
      filePath = path.resolve(process.cwd(), 'src/user/html/plantilla.html');
    } else {
      throw new BadRequestException('Tipo de correo no válido');
    }

    const htmlTemplate = fs.readFileSync(filePath, 'utf8');
    const personalizedHtml = htmlTemplate.replace('{{name}}', user.email).replace('{{token}}', url);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Correo de verificación',
      html: personalizedHtml,
    });
  }

}
