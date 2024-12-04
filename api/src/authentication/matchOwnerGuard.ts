import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { MatchService } from "match/match.service";
import { Request } from "express";
import { ObjectId, Types } from "mongoose"; // Importa Types para trabajar con ObjectId

interface JWTUser {
  sub: ObjectId | string;
  username: string;
  roles: string[];
  iat: number;
  exp: number;
}

@Injectable()
export class MatchOwnerGuard implements CanActivate {
  constructor(private readonly matchService: MatchService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Asegúrate de que TypeScript sabe que request.user es de tipo User
    const user = request.user as JWTUser;

    // Asegurarse de que user.sub es del tipo correcto
    const userId =
      user.sub instanceof Types.ObjectId
        ? user.sub
        : new Types.ObjectId(user.sub as string); // Cast a string si es necesario

    // Convertir partidoId a ObjectId
    const matchIdParam = request.params.matchId || request.params.id;
    if (!matchIdParam) {
      throw new ForbiddenException("ID de partido no encontrado");
    }

    // Convertir el ID del partido a ObjectId
    const matchId = new Types.ObjectId(matchIdParam);

    // Obtener el partido de la base de datos
    const match = await this.matchService.findOne(matchId);
    if (!match) {
      throw new ForbiddenException("Partido no encontrado");
    }

    // Verificar si el usuario es el creador del match
    if (!new Types.ObjectId(match.userId).equals(userId)) {
      throw new ForbiddenException(
        "No tienes permiso para modificar este partido",
      );
    }

    return true;
  }
}
