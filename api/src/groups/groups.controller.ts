import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Filter } from 'types/types';
import { Types } from 'mongoose';
import { JwtPayload } from "jsonwebtoken";
import { JwtDecorator } from 'decorators/jwt-payload.decorator';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll(@Query() filter: Filter) {
    return this.groupsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID inválido");
    }
    const objectId = new Types.ObjectId(id);
    return this.groupsService.findOne(objectId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID inválido");
    }
    const objectId = new Types.ObjectId(id);
    return this.groupsService.update(objectId, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID inválido");
    }
    const objectId = new Types.ObjectId(id);
    return this.groupsService.remove(objectId);
  }

  @Patch(':groupId/users/:userId/remove')
  async removeUser(@Param('groupId') groupId: string, @Param('userId') userId: string, @JwtDecorator() payload: JwtPayload) {
    if (!Types.ObjectId.isValid(groupId)) {
      throw new BadRequestException("ID de grupo inválido");
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("ID de usuario inválido");
    }
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
