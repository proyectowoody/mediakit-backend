import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException
} from "@nestjs/common";
import { Request } from "express";
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
      const { compactDecrypt } = await import('jose'); 

      let secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET no está definido');

      secret = secret.padEnd(32, '0').slice(0, 32);
      const encodedSecret = new TextEncoder().encode(secret);

      const decrypted = await compactDecrypt(token, encodedSecret);
      const payload = JSON.parse(new TextDecoder().decode(decrypted.plaintext));

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
