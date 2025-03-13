import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './activity.dto';
import { UpdateActivityDto } from './activity.dto';
import { Filter } from 'types/types';
import { Types } from 'mongoose';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Get()
  findAll(@Query() filter: Filter) {
    return this.activityService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(new Types.ObjectId(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activityService.update(new Types.ObjectId(id), updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(new Types.ObjectId(id));
  }
}
