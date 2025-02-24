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
import { MatchOwnerGuard } from "authentication/matchOwnerGuard";
import { MatchPlayerGuard } from "authentication/matchPlayerGuard";
import { Filter } from "types/types";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Types } from "mongoose";
import { create } from "domain";
import { ValidateObjectIdPipe } from "pipes/validate-object-id.pipe";
import { Public } from "authentication/public";

@ApiBearerAuth()
@ApiTags('matches')
@Controller("matches")
export class MatchController {
    constructor(private readonly matchService: MatchService) { }
    @Public()
    @Post()
    async createMatch(@Body() createMatchDto: CreateMatchDto) {
        if (!Types.ObjectId.isValid(createMatchDto.userId)) {
            throw new BadRequestException(`ID de usuario inválido`);
        }
        if (createMatchDto.location && !Types.ObjectId.isValid(createMatchDto.location as Types.ObjectId)) {
            throw new BadRequestException(`ID de location inválido`);
        }
        const newMatch = await this.matchService.createMatch(createMatchDto);
        return newMatch;
    }
    @Public()
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
    async findForDate(@Param("userId", new ValidateObjectIdPipe("usuario")) userId: string) {
        const matches = await this.matchService.getMatchesForUserDate(userId);
        return matches;
    }

    @Get("/findForZone/:userId")
    async findForZone(@Param("userId", new ValidateObjectIdPipe("usuario")) userId: string) {
        const matches = await this.matchService.getMatchesInUserZones(userId);
        return matches;
    }

    @Get("/findForSportMode/:userId")
    async findForSportMode(@Param("userId", new ValidateObjectIdPipe("usuario")) userId: string) {
        const matches = await this.matchService.getMatchesByUserSportMode(userId);
        return matches;
    }
    @Get("/findRecommendation/:userId")
    async findRecommendation(@Param("userId", new ValidateObjectIdPipe("usuario")) userId: string) {
        const matches = await this.matchService.getMatchesForUserRecommendation(userId);
        return matches;
    }

    @Public()
    @Get(":id")
    async findOne(@Param("id", new ValidateObjectIdPipe()) id: string) {
        const match = await this.matchService.findOne(new Types.ObjectId(id));
        return match;
    }

    @Patch("/:matchId/formation/:userId/add")
    async updateFormation(
        @Param("matchId", new ValidateObjectIdPipe("partido")) matchId: string,
        @Param("userId", new ValidateObjectIdPipe("usuario")) userId: string,
        @Body() body: { team: 1 | 2, position: number },
    ) {
        const updatedMatch = await this.matchService.addUserToFormation(
            new Types.ObjectId(userId),
            new Types.ObjectId(matchId),
            body.team,
            body.position
        );
        return updatedMatch;
    }

    @Patch("/:matchId/formation/:userId/remove")
    async deleteUserFromFormation(
        @Param("matchId", new ValidateObjectIdPipe("partido")) matchId: string,
        @Param("userId", new ValidateObjectIdPipe("usuario")) userId: string,
    ) {
        const updatedMatch = await this.matchService.removeUserFromFormation(
            new Types.ObjectId(matchId),
            new Types.ObjectId(userId)
        );
        return updatedMatch;
    }


    @Public()
    @Patch(":matchId/users/:userId/add")
    async addUserToMatch(
        @Param("matchId", new ValidateObjectIdPipe("partido")) matchId: string, // Use string as ObjectId is stored as string
        @Param("userId", new ValidateObjectIdPipe("usuario")) userId: string,
    ) {
        const updatedMatch = await this.matchService.addUserToMatch(
            new Types.ObjectId(matchId),
            new Types.ObjectId(userId),
        );

        return updatedMatch;
    }

    @Public()
    @Patch(":matchId/users/:userId/remove")
    @UseGuards(MatchPlayerGuard)
    async removeUserFromMatch(
        @Param("matchId", new ValidateObjectIdPipe("partido")) matchId: string,
        @Param("userId", new ValidateObjectIdPipe("usuario")) userId: string,
    ) {
        const match = new Types.ObjectId(matchId);
        const user = new Types.ObjectId(userId);

        const updatedMatch = await this.matchService.removeUserFromMatch(
            match,
            user,
        );

        return updatedMatch;
    }

    @Put(":id")
    @UseGuards(MatchOwnerGuard) // solo el creador del partido puede editar el partido
    async update(
        @Param("id", new ValidateObjectIdPipe()) id: string,
        @Body() updateMatchDto: UpdateMatchDto,
    ) {
        const updatedMatch = await this.matchService.update(
            new Types.ObjectId(id),
            updateMatchDto,
        );
        return updatedMatch;
    }

    @Delete(":id")
    @UseGuards(MatchOwnerGuard) // Aplica el nuevo guard aquí
    async remove(@Param("id", new ValidateObjectIdPipe()) id: string) {
        await this.matchService.remove(new Types.ObjectId(id));
        return { message: "Partido eliminado" };
    }
}
