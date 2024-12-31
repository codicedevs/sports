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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PetitionModelType } from "./petition.enum";
import { Types } from "mongoose";

@ApiBearerAuth()
@ApiTags('petitions')
@Controller("petitions")
export class PetitionController {
  constructor(private readonly petitionService: PetitionService) {}

  @Post()
  async createPetition(@Body() petition: CreatePetitionDto) {
    if (!ObjectId.isValid(petition.emitter)) {
      throw new BadRequestException("ID de emisor inválido");
    }
    if (!ObjectId.isValid(petition.receiver)) {
      throw new BadRequestException("ID de receptor inválido");
    }
    const emitter = new Types.ObjectId(petition.emitter)
    const receiver = new Types.ObjectId(petition.receiver)
    
    return this.petitionService.create({emitter, receiver, ...petition});
  }

  //Aceptar una peticion
  @Put("accept/:petitionId")
  async acceptPetition(@Param("petitionId") petitionId: string) {
    if (!ObjectId.isValid(petitionId)) {
      throw new BadRequestException("ID de petición inválido");
    }
    return this.petitionService.acceptPetition(new Types.ObjectId(petitionId));
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
  @Get("existing/:emitterId/:modelType/:targetId")
  async getExistingPetition(
    @Param("emitterId") emitterId: string,
    @Param("targetId") targetId: string,
    @Param("modelType") modelType: PetitionModelType,
  ) {
    const existingPetition = await this.petitionService.findExistingPetition(
      emitterId,
      targetId,
      modelType
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
