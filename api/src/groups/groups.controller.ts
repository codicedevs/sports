import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Filter } from 'types/types';
import { Types } from 'mongoose';

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
}
