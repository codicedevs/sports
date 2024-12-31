import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Put,
    Param,
    Delete,
    UseGuards,
    BadRequestException,
    Query,
} from "@nestjs/common";
import { MatchService } from "./match.service";
import { CreateMatchDto } from "./match.dto";
import { UpdateMatchDto } from "./match.dto";
import { ObjectId } from "mongodb";
import { MatchOwnerGuard } from "authentication/matchOwnerGuard";
import { MatchPlayerGuard } from "authentication/matchPlayerGuard";
import { Filter } from "types/types";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Types } from "mongoose";
import { create } from "domain";

@ApiBearerAuth()
@ApiTags('matches')
@Controller("matches")
export class MatchController {
    constructor(private readonly matchService: MatchService) { }

    @Post()
    async createMatch(@Body() createMatchDto: CreateMatchDto) {
        const newMatch = await this.matchService.createMatch(createMatchDto);
        return newMatch;
    }

    @Post(":matchId/users/:userId")
    async addUserToMatch(
        @Param("matchId") matchId: string, // Use string as ObjectId is stored as string
        @Param("userId") userId: string,
    ) {
        if (!ObjectId.isValid(matchId) || !ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de partido o usuario inválido");
        }

        const updatedMatch = await this.matchService.addUserToMatch(
            new ObjectId(matchId),
            new ObjectId(userId),
        );

        return updatedMatch;
    }

    @Get()
    async findAll(@Query() filter: Filter) {                        
        return await this.matchService.findAll(filter);
    }

    @Get("/status")
    async findAllByStatus() {
        return await this.matchService.findAllByStatus();
    }
  
    @Get("/available")
    async getAvailableMatches() {
        return await this.matchService.getAvailableMatches();
    }

    @Get("/findForDate/:userId")
    async findForDate(@Param("userId") userId: string){
        if (!ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de usuario inválido");
        }
        const matches = await this.matchService.getMatchesForUserDate(userId);
        return matches;
    }

    @Get("/findForZone/:userId")
    async findForZone(@Param("userId") userId: string){
        if (!ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de usuario inválido");
        }
        const matches = await this.matchService.getMatchesInUserZones(userId);
        return matches;
    }

    @Get("/findForSportMode/:userId")
    async findForSportMode(@Param("userId") userId: string){
        if (!ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de usuario inválido");
        }
        const matches = await this.matchService.getMatchesByUserSportMode(userId);
        return matches;
    }
    @Get("/findRecommendation/:userId")
    async findRecommendation(@Param("userId") userId: string){
        if (!ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de usuario inválido");
        }
        const matches = await this.matchService.getMatchesForUserRecommendation(userId);
        return matches;
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestException("ID de partido inválido");
        }
        const match = await this.matchService.findOne(new ObjectId(id));
        return match;
    }

    @Put("/:matchId/formation/:userId")
    async updateFormation(
        @Param("matchId") matchId: string,
        @Param("userId") userId: string,
        @Body() body: {team:1|2, position:number},
    ) {
        if (!ObjectId.isValid(matchId)) {
            throw new BadRequestException("ID de partido inválido");
        }
        if (!ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de usuario inválido");
        }


        const updatedMatch = await this.matchService.addUserToFormation(
            new ObjectId(userId),
            new ObjectId(matchId),
            body.team,
            body.position
        );
        return updatedMatch;
    }

    @Delete("/:matchId/formation/:userId")
    async deleteUserFromFormation(
        @Param("matchId") matchId: string,
        @Param("userId") userId: string,
    ) {
        if (!ObjectId.isValid(matchId)) {
            throw new BadRequestException("ID de partido inválido");
        }
        if (!ObjectId.isValid(userId)) {
            throw new BadRequestException("ID de usuario inválido");
        }

        const updatedMatch = await this.matchService.removeUserFromFormation(
            new ObjectId(matchId),
            new ObjectId(userId)
        );
        return updatedMatch;
    }

    @Put(":id")
    @UseGuards(MatchOwnerGuard) // solo el creador del partido puede editar el partido
    async update(
        @Param("id") id: string,
        @Body() updateMatchDto: UpdateMatchDto,
    ) {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestException("ID de partido inválido");
        }

        const updatedMatch = await this.matchService.update(
            new ObjectId(id),
            updateMatchDto,
        );
        return updatedMatch;
    }

    @Patch(":matchId/users/:userId")
    @UseGuards(MatchPlayerGuard)
    async removeUserFromMatch(
        @Param("matchId") matchId: string,
        @Param("userId") userId: string,
    ) {
        const match = new ObjectId(matchId);
        const user = new ObjectId(userId);

        const updatedMatch = await this.matchService.removeUserFromMatch(
            match,
            user,
        );

        return updatedMatch;
    }

    @Delete(":id")
    @UseGuards(MatchOwnerGuard) // Aplica el nuevo guard aquí
    async remove(@Param("id") id: string) {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestException("ID de partido inválido");
        }
        await this.matchService.remove(new ObjectId(id));
        return { message: "Partido eliminado" };
    }
}
