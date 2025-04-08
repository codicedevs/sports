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
  UseInterceptors,
  UploadedFiles,
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
import { ZonesService } from "zones/zones.service";
import { Zone } from "zones/zone.entity";
import { PetitionService } from "petition/petition.service";
import { PetitionModelType, PetitionStatus } from "petition/petition.enum";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";

@ApiBearerAuth()
@ApiTags("matches")
@Controller("matches")
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly zonesService: ZonesService,
    private readonly petitionService: PetitionService,
  ) { }
  @Post()
  async createMatch(@Body() createMatchDto: CreateMatchDto) {
    if (!Types.ObjectId.isValid(createMatchDto.userId)) {
      throw new BadRequestException(`ID de usuario inválido`);
    }
    if (
      createMatchDto.location &&
      !Types.ObjectId.isValid(createMatchDto.location as Types.ObjectId)
    ) {
      throw new BadRequestException(`ID de location inválido`);
    }
    const newMatch = await this.matchService.createMatch(createMatchDto);
    return newMatch;
  }
  @Public()
  @Post(':matchId/upload-asset')
  @UseInterceptors(
    FilesInterceptor('files', 10, { // 'files' es el nombre del campo en form-data, y 10 es el máximo de archivos permitidos
      storage: diskStorage({
        destination: (req, file, callback) => {
          // Extrae el matchId de los parámetros de la ruta
          const matchId = req.params.matchId;
          // Define la ruta donde se guardarán los archivos
          const uploadPath = join(process.cwd(), 'public', matchId);
          // Si la carpeta no existe, la crea de forma recursiva
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          // Genera un nombre único para el archivo
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          const filename = `${uniqueSuffix}${fileExtName}`;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadMatchFiles(
    @Param('matchId', new ValidateObjectIdPipe()) matchId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(`Archivos recibidos para el match ${matchId}:`, files);
    return {
      matchId,
      files,
    };
  }
  @Public()
  @Get()
  async findAll(@Query() filter: Filter) {
    const zonesIds = filter?.where?.zones?.$in;
    if (zonesIds) {
      const zones = (
        await this.zonesService.findAll({ where: { _id: { $in: zonesIds } } })
      ).results;
      const zonePolygons = zones.map((zone: Zone) => zone.location);
      delete filter.where.zones;
      filter.where = {
        ...filter.where,
        ...{
          "location.location": {
            $geoWithin: {
              $geometry: {
                type: "MultiPolygon",
                coordinates: zonePolygons.map((polygon) => polygon.coordinates),
              },
            },
          },
        },
      };
    } else if (filter?.where?.zones) {
      throw new BadRequestException("Zones should be an array");
    }
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

  @Get("/findForDate/users/:userId")
  async findForDate(
    @Param("userId", new ValidateObjectIdPipe("usuario")) userId: string,
  ) {
    const matches = await this.matchService.getMatchesForUserDate(userId);
    return matches;
  }

  @Get("/findForZone/users/:userId")
  async findForZone(
    @Param("userId", new ValidateObjectIdPipe("usuario")) userId: string,
  ) {
    const matches = await this.matchService.getMatchesInUserZones(userId);
    return matches;
  }

  @Get("/findForSportMode/users/:userId")
  async findForSportMode(
    @Param("userId", new ValidateObjectIdPipe("usuario")) userId: string,
  ) {
    const matches = await this.matchService.getMatchesByUserSportMode(userId);
    return matches;
  }
  @Get("/findRecommendation/:userId")
  async findRecommendation(
    @Param("userId", new ValidateObjectIdPipe("usuario")) userId: string,
  ) {
    const matches =
      await this.matchService.getMatchesForUserRecommendation(userId);
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
    @Body() body: { team: 1 | 2; position: number },
  ) {
    const updatedMatch = await this.matchService.addUserToFormation(
      new Types.ObjectId(userId),
      new Types.ObjectId(matchId),
      body.team,
      body.position,
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
      new Types.ObjectId(userId),
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

  @Get(":matchId/petitions")
  async getPetitionsByMatch(
    @Query() filter: Filter, @Param("matchId", new ValidateObjectIdPipe("match")) matchId: string,
  ) {
    if (!filter) filter = {}
    if (filter?.where) filter.where = { ...filter.where, "reference.id": new Types.ObjectId(matchId), "reference.type": PetitionModelType.match }
    else filter.where = { "reference.id": new Types.ObjectId(matchId), "reference.type": PetitionModelType.match }
    const petitions = (await this.petitionService.findAll(filter)).results;

    const result = {
      pending: [] as any[],
      accepted: [] as any[],
      declined: [] as any[],
    };

    petitions.forEach((petition) => {
      switch (petition.status) {
        case PetitionStatus.Pending:
          result.pending.push(petition.receiver);
          break;
        case PetitionStatus.Accepted:
          result.accepted.push(petition.receiver);
          break;
        case PetitionStatus.Declined:
          result.declined.push(petition.receiver);
          break;
      }
    });

    return result;
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

  @Patch(":id")
  @UseGuards(MatchOwnerGuard) // solo el creador del partido puede editar el partido
  async updatePatch(
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
  // @UseGuards(MatchOwnerGuard) // Aplica el nuevo guard aquí
  async remove(@Param("id", new ValidateObjectIdPipe()) id: string) {
    await this.matchService.remove(new Types.ObjectId(id));
    return { message: "Partido eliminado" };
  }
}
