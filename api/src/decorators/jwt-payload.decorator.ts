import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const JwtDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const jwtService = new JwtService();
    const token = request.headers.authorization.replace('Bearer ', '');

    // Decodificar el token y retornar el payload
    const payload = jwtService.decode(token);

    return payload;
  },
);