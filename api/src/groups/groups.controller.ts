import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, Req } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto } from './group.dto';
import { Filter } from 'types/types';
import { Types } from 'mongoose';
import { JwtPayload } from "jsonwebtoken";
import { JwtDecorator } from 'decorators/jwt-payload.decorator';
import { ValidateObjectIdPipe } from 'pipes/validate-object-id.pipe';
import { PetitionService } from 'petition/petition.service';
import { PetitionModelType, PetitionStatus } from 'petition/petition.enum';
import { CreatePetitionDto, TextPetitionDto } from 'petition/petition.dto';
import { JwkKeyExportOptions } from 'crypto';

@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly petitionService: PetitionService,

  ) { }

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }
  @Post(':groupId/petition')
  async sendPetition(
    @Param("groupId", new ValidateObjectIdPipe()) groupId: string,
    @Req() request: Request,
    @Body() text: TextPetitionDto
  ) {
    const { sub } = request['user'] as JwtPayload
    const userId = new Types.ObjectId(sub)
    let petition: CreatePetitionDto = {
      emitter: userId,
      reference: {
        type: PetitionModelType.group,
        id: new Types.ObjectId(groupId)
      },
      status: PetitionStatus.Pending
    }

    return this.petitionService.create({...petition, ...text})
  }
  @Post(':groupId/invite/:userId')
  async sendInvitation(
    @Param("groupId", new ValidateObjectIdPipe()) groupId: string,
    @Param("userId", new ValidateObjectIdPipe("usuario")) userId: string,
    @Req() request: Request,
    @Body() text: TextPetitionDto
  ) {
    const { sub } = request['user'] as JwtPayload;
    const adminId = new Types.ObjectId(sub);
    const group = await this.groupsService.findOne(new Types.ObjectId(groupId));
    if (!(group.userId as Types.ObjectId).equals(adminId)) {
      throw new BadRequestException("El usuario no es admin del grupo")
    }
    const petition: CreatePetitionDto = {
      emitter: adminId,
      receiver: new Types.ObjectId(userId),
      reference: {
        id: new Types.ObjectId(groupId),
        type: PetitionModelType.group,
      },
      status: PetitionStatus.Pending
    }
    return this.petitionService.create({...petition, ...text})

  }

  @Get()
  findAll(@Query() filter: Filter) {
    return this.groupsService.findAll(filter);
  }
  @Get("petitions")
  async getMatchesPetitions(
    @Req() request: Request
  ) {
    const { sub } = request['user'] as JwtPayload;
    return this.petitionService.findAll({
      where: {
        receiver: new Types.ObjectId(sub),
        status: PetitionStatus.Pending,
        'reference.type': PetitionModelType.match
      }
    })
  }

  @Get(':id')
  findOne(@Param('id', new ValidateObjectIdPipe()) id: string) {
    const objectId = new Types.ObjectId(id);
    return this.groupsService.findOne(objectId);
  }

  @Patch(':id')
  update(@Param('id', new ValidateObjectIdPipe()) id: string, @Body() updateGroupDto: UpdateGroupDto) {
    const objectId = new Types.ObjectId(id);
    return this.groupsService.update(objectId, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id', new ValidateObjectIdPipe()) id: string) {
    const objectId = new Types.ObjectId(id);
    return this.groupsService.remove(objectId);
  }

  @Patch(':groupId/users/:userId/remove')
  async removeUser(@Param('groupId', new ValidateObjectIdPipe("grupo")) groupId: string, @Param('userId', new ValidateObjectIdPipe("usuario")) userId: string, @JwtDecorator() payload: JwtPayload) {
    const group = new Types.ObjectId(groupId);
    const user = new Types.ObjectId(userId);
    const emitter = new Types.ObjectId(payload.sub);

    const updatedMatch = await this.groupsService.removeUserFromGroup(
      group,
      user,
      emitter

    );

    return updatedMatch;
  }

}
