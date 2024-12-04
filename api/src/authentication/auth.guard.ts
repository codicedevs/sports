import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtSetting } from "settings";
import { IS_PUBLIC_KEY } from "./public";
import { ROLES_KEY } from "authorization/role.decorator";
import { Role } from "authorization/role.enum";

@Injectable()
export class AuthGuard implements CanActivate {
  // global pasado en main
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("missing token");
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSetting.JWT_ACCESS_SECRET, 
      });
      request["user"] = payload;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requiredRoles) {
      const userRoles = request.user.roles;
      const hasRole = () =>
        userRoles.some((role) => requiredRoles.includes(role));
      if (!hasRole()) {
        throw new ForbiddenException("Forbidden: Insufficient roles");
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
