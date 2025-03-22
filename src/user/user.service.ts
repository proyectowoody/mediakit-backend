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
import * as jose from 'jose';
import 'dotenv/config';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) { }

  async count(): Promise<{ total: number }> {
    const total = await this.usersRepository.count();
    return { total };
  }

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

    const userCount = await this.usersRepository.count(); 

    const hashedPassword = await bcryptjs.hash(password, 10);
    const isFirstUser = userCount === 0;

    const newUser = this.usersRepository.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      isVerified: isFirstUser ? true : false,
      role: isFirstUser ? 'admin' : 'client',
    });

    await this.usersRepository.save(newUser);

    if (!isFirstUser) {
      const Usuario = { email, role: 'client' };
      await this.envioEmail(Usuario, email, 'register');
    }

    return {
      message: isFirstUser
        ? 'Primer usuario creado como administrador.'
        : 'Registro exitoso, verifique su correo.',
    };
  }

  async login({ email, password }: LoginDto): Promise<string> {
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

    const payload: jose.JWTPayload = {
      email,
      user: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    return await this.encryptToken(payload);
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

    return
  }

  async token(email: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.usersRepository.update({ email }, { isVerified: true });

    const payload: jose.JWTPayload = {
      email,
      user: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    return await this.encryptToken(payload);
  }

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  async envioEmail(user: any, email: string, correo: string) {

    const payload = { email: user.email };

    const token = await this.encryptToken(payload);

    let url: string;
    let filePath: string;

    const baseUrl = URL_FRONTEND;

    if (correo === 'register') {
      url = `${baseUrl}/iniciar-sesion?token=${token}`;
      filePath = path.resolve(process.cwd(), 'src/user/html/plantillaReg.html');
    } else if (correo === 'verificacion') {
      url = `${baseUrl}/recuperar-contrasena?token=${token}`;
      filePath = path.resolve(process.cwd(), 'src/user/html/plantilla.html');
    } else if (correo === 'car') {
      url = `${baseUrl}/iniciar-sesion?token=${token}`;
      filePath = path.resolve(process.cwd(), 'src/user/html/plantillaCar.html');
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

  async encryptToken(payload: jose.JWTPayload): Promise<string> {
    let secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET no está definido');
    }

    secret = secret.padEnd(32, '0').slice(0, 32);
    const encodedSecret = new TextEncoder().encode(secret);

    return await new jose.EncryptJWT(payload)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setExpirationTime('1h')
      .encrypt(encodedSecret);
  }

}
