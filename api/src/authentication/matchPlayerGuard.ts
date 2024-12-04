import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { MatchService } from "match/match.service";
import { JwtPayload } from "jsonwebtoken";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class MatchPlayerGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private matchService: MatchService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const matchId = new ObjectId(request.params.matchId);
        const playerId = new ObjectId(request.params.userId);

        let token = this.getTokenFromHeader(request); // Obtener el token de la petición
        let userTokenId = new ObjectId(token.sub);

        const match = await this.matchService.findOne(matchId);

        if (!match) {
            throw new ForbiddenException("Partido no encontrado");
        }

        const ownerId = new ObjectId(match.userId);

        const isOwner = ownerId.equals(userTokenId);
        const playerIsInMatch = userTokenId.equals(playerId) && match.users.some((u) => new ObjectId(u).equals(userTokenId));

        if (isOwner || playerIsInMatch) {
            return true;
        }

        throw new ForbiddenException("No tienes permiso para modificar este partido");
    }

    getTokenFromHeader(request: Request): JwtPayload {
        const authHeader = request.headers.authorization;
        return this.jwtService.decode(authHeader.split(" ")[1]);
    }
}
