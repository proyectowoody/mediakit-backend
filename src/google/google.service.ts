import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from "bcryptjs";
import { UserService } from 'src/user/user.service';
import 'dotenv/config';
import * as jose from 'jose';

@Injectable()
export class GoogleService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async googleLogin(req) {
    try {
      const name = req.user?.firstName;
      const lastName = req.user?.lastName;
      const email = req.user?.email;

      if (!email) {
        throw new InternalServerErrorException("No se pudo obtener el correo del usuario.");
      }

      const password = process.env.PASSWORD_GOOGLE_DATA;
      const isVerified = true;
      const role = "client";

      let user = await this.userService.findByEmail(email);
      let token;

      if (!user) {
        const hashedPassword = await bcryptjs.hash(password, 10);
        user = await this.saveUser({ name, lastName, email, password: hashedPassword, isVerified, role });
      }
      token = await this.generateToken(user);
      return { token };
    } catch (error) {
      console.error("Error en googleLogin:", error);
      throw new InternalServerErrorException("Error en la autenticación con Google.");
    }
  }

  private async saveUser({ name, lastName, email, password, isVerified, role }) {
    try {
      return await this.userService.create({
        name,
        lastName,
        email,
        password,
        isVerified,
        role
      });
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      throw new InternalServerErrorException("Error al guardar el usuario en la base de datos.");
    }
  }

  private async generateToken(user): Promise<string> {
    try {
      const payload: jose.JWTPayload = {
        email: user.email,
        user: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      return await this.encryptToken(payload);
    } catch (error) {
      console.error("Error al generar el token:", error);
      throw new InternalServerErrorException("Error al generar el token de autenticación.");
    }
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
