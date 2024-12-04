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
} from "@nestjs/common";
import { PetitionService } from "./petition.service";
import { CreatePetitionDto } from "./petition.dto";
import { UpdatePetitionDto } from "./petition.dto";
import { ObjectId } from "mongodb";

@Controller("petitions")
export class PetitionController {
  constructor(private readonly petitionService: PetitionService) {}

  @Post()
  async createPetition(@Body("petition") petition: CreatePetitionDto) {
    return this.petitionService.create(petition);
  }

  //Aceptar una peticion
  @Put("accept/:petitionId")
  async acceptPetition(@Param("petitionId") petitionId: string) {
    if (!ObjectId.isValid(petitionId)) {
      throw new BadRequestException("ID de petición inválido");
    }
    return this.petitionService.acceptPetition(new ObjectId(petitionId));
  }

  //Rechazar peticion
  @Put("decline/:petitionId")
  async declinePetition(@Param("petitionId") petitionId: string) {
    if (!ObjectId.isValid(petitionId)) {
      throw new BadRequestException("ID de petición inválido");
    }
    return this.petitionService.declinePetition(new ObjectId(petitionId));
  }

  //comprobar si un usuario ya peticiono para unirse a un partido
  @Get("existing/:emitterId/:matchId")
  async getExistingPetition(
    @Param("emitterId") emitterId: string,
    @Param("matchId") matchId: string,
  ) {
    const existingPetition = await this.petitionService.findExistingPetition(
      emitterId,
      matchId,
    );

    return existingPetition;
  }

  @Get()
  findAll() {
    return this.petitionService.findAll();
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
