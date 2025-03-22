import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/registerDto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/loginDto';
import { EmailDto } from './dto/emailDto';
import { PasswordDto } from './dto/passwordDto';
import { UserService } from './user.service';
import { AuthGuard } from './guard/auth.guard';
import { Response as ExpressResponse } from 'express';
import { isProduction } from 'src/url';
import * as jose from 'jose';

@ApiTags('Users')
@Controller('users')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Get('me')
  @UseGuards(AuthGuard)
  async getUser(@Request() req) {
    return { email: req.user.email, user: req.user.user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res() res: ExpressResponse) {
    res.clearCookie('ACCESS_TOKEN', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.json({ message: "Sesión cerrada correctamente" });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: ExpressResponse) {
    const token = await this.userService.login(loginDto);
    res.cookie('ACCESS_TOKEN', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.json({ message: 'Login exitoso' });
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Get('count')
  async countArticles() {
    return this.userService.count();
  }

  @Post('email')
  email(@Body() email: EmailDto) {
    return this.userService.email(email);
  }

  @Patch('password')
  @UseGuards(AuthGuard)
  async password(@Request() req, @Body() passDto: PasswordDto, @Res() res: ExpressResponse) {
    await this.userService.password(req.user.email, passDto);
    return res.json({ message: 'Actualizado' });
  }

  @Patch('tokens')
  async token(@Body() body: { token: string }, @Res() res: ExpressResponse) {
    try {
      if (!body.token) {
        throw new UnauthorizedException("Token no proporcionado");
      }

      let secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET no está definido');
      }

      secret = secret.padEnd(32, '0').slice(0, 32);
      const encodedSecret = new TextEncoder().encode(secret);

      const decrypted = await jose.compactDecrypt(body.token, encodedSecret);
      const payload = JSON.parse(new TextDecoder().decode(decrypted.plaintext));

      const token = await this.userService.token(payload.email);

      res.cookie('ACCESS_TOKEN', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      });

      return res.json({ message: 'Token verificado y almacenado en cookie' });

    } catch (error) {
      console.error("Error en la verificación del token:", error);
      throw new UnauthorizedException("Token inválido o expirado");
    }
  }

  @Get('validate-token')
  async validateToken(@Query('token') token: string, @Res() res: ExpressResponse) {
    try {
      if (!token) {
        throw new UnauthorizedException("Token no proporcionado");
      }

      let secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET no está definido');
      }

      secret = secret.padEnd(32, '0').slice(0, 32);
      const encodedSecret = new TextEncoder().encode(secret);

      const decrypted = await jose.compactDecrypt(token, encodedSecret);
      const payload = JSON.parse(new TextDecoder().decode(decrypted.plaintext));

      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException("Usuario no encontrado");
      }

      const sessionToken = await this.userService.token(user.email);

      res.cookie('ACCESS_TOKEN', sessionToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      });

      return res.json({ message: "Sesión iniciada con éxito" });

    } catch (error) {
      console.error("Error en la validación del token:", error);
      throw new UnauthorizedException("Token inválido o expirado");
    }
  }


}

