import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from "bcryptjs";
import { UserService } from 'src/user/user.service';
import 'dotenv/config';

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
      const payload = { email: user.email, role: user.role };
      return await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        jwtid: `${Date.now()}`,
      });
    } catch (error) {
      console.error("Error al generar el token:", error);
      throw new InternalServerErrorException("Error al generar el token de autenticación.");
    }
  }
}
