import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Filter } from 'types/types';
import { Types } from 'mongoose';
import { JwtPayload } from "jsonwebtoken";
import { JwtDecorator } from 'decorators/jwt-payload.decorator';
import { ValidateObjectIdPipe } from 'pipes/validate-object-id.pipe';

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
