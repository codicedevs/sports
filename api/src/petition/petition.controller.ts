import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  BadRequestException,
  Query,
} from "@nestjs/common";
import { PetitionService } from "./petition.service";
import { CreatePetitionDto } from "./petition.dto";
import { UpdatePetitionDto } from "./petition.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PetitionModelType, PetitionStatus } from "./petition.enum";
import { Types } from "mongoose";
import { ValidateObjectIdPipe } from "pipes/validate-object-id.pipe";
import { types } from "util";
import { Filter } from "types/types";
import { Public } from "authentication/public";

@ApiBearerAuth()
@ApiTags('petitions')
@Controller("petitions")
export class PetitionController {
  constructor(private readonly petitionService: PetitionService) {}
  @Post()
  async createPetition(@Body() petition: CreatePetitionDto) {
    if (!Types.ObjectId.isValid(petition.emitter)) {
      throw new BadRequestException("ID de emisor inválido");
    }
    if (!Types.ObjectId.isValid(petition.receiver)) {
      throw new BadRequestException("ID de receptor inválido");
    }
    const emitter = new Types.ObjectId(petition.emitter)
    const receiver = new Types.ObjectId(petition.receiver)
    
    return this.petitionService.create({emitter, receiver, ...petition});
  }

  @Put("accept/:petitionId")
  async acceptPetition(@Param("petitionId", new ValidateObjectIdPipe()) petitionId: string) {
    return this.petitionService.acceptPetition(new Types.ObjectId(petitionId));
  }

  @Put("decline/:petitionId")
  async declinePetition(@Param("petitionId", new ValidateObjectIdPipe()) petitionId: string) {
    return this.petitionService.declinePetition(new Types.ObjectId(petitionId));
  }

  //comprobar si un usuario ya peticiono para unirse a un partido
  @Get("existing/:emitterId/:modelType/:targetId")
  async getExistingPetition(
    @Param("emitterId", new ValidateObjectIdPipe("emisor")) emitterId: string,
    @Param("targetId", new ValidateObjectIdPipe("target")) targetId: string,
    @Param("modelType") modelType: PetitionModelType,
  ) {
    const existingPetition = await this.petitionService.findExistingPetition(
      emitterId,
      targetId,
      modelType
    );

    return existingPetition;
  }
@Get('match/:matchId')
async getPetitionsByMatch(
  @Param('matchId', new ValidateObjectIdPipe('match')) matchId: string
) {
  // Obtenemos todas las petitions relacionadas con el match indicado
  const petitions = await this.petitionService.findByReference({
    id: new Types.ObjectId(matchId),
    type: PetitionModelType.match, // Suponiendo que en tu enum defines 'Match'
  });

  // Inicializamos el objeto de respuesta con las tres categorías
  const result = {
    pending: [] as any[],
    accepted: [] as any[],
    declined: [] as any[],
  };

  // Se recorre cada petition y se agrupa según el status, extrayendo la info del receptor
  petitions.forEach(petition => {
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

  @Get()
  findAll(@Query() filter: Filter) {
    return this.petitionService.findAll(filter);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.petitionService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePetitionDto: UpdatePetitionDto,
  ) {
    return this.petitionService.update(+id, updatePetitionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.petitionService.remove(+id);
  }
}
