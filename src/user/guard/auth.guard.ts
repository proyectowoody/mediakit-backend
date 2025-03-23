import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException
} from "@nestjs/common";
import { Request } from "express";
import * as crypto from "crypto";
import 'dotenv/config';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.ACCESS_TOKEN;

    if (!token) {
      throw new UnauthorizedException("Usuario no autenticado");
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET no está definido');

      const key = crypto
        .createHash('sha256')
        .update(secret)
        .digest();

      const [ivB64, authTagB64, encryptedB64] = token.split('.');
      const iv = Buffer.from(ivB64, 'base64');
      const authTag = Buffer.from(authTagB64, 'base64');
      const encrypted = Buffer.from(encryptedB64, 'base64');

      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');

      const payload = JSON.parse(decrypted);
      (request as any).user = payload;

      this.validateRole(request);

    } catch (error) {
      throw new UnauthorizedException("Token inválido o expirado");
    }

    return true;
  }

  private validateRole(request: Request) {
    const user = (request as any).user;

    const adminRoutes = ["/admin", "/categorias", "/subcategorias", "/proveedores", "/articulos", "/ofertas", "/cuenta-admin"];
    const clientRoutes = ["/favoritos", "/carrito", "/comprar", "/direccion", "/comentarios", "/cuenta"];

    const path = request.path;

    if (user.user === "admin" && clientRoutes.some(route => path.startsWith(route))) {
      throw new ForbiddenException("Acceso denegado: No puedes acceder a rutas de clientes");
    }

    if (user.user === "client" && adminRoutes.some(route => path.startsWith(route))) {
      throw new ForbiddenException("Acceso denegado: No puedes acceder a rutas de administrador");
    }
  }
}
