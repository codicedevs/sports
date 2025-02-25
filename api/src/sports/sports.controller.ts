import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SportsService } from './sports.service';
import { CreateSportDto, UpdateSportDto } from './sport.dto';
import { ValidateObjectIdPipe } from 'pipes/validate-object-id.pipe';
import { Types } from 'mongoose';
import { Filter } from 'types/types';
import { Public } from 'authentication/public';

@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) { }

  @Post()
  create(@Body() createSportDto: CreateSportDto) {
    return this.sportsService.create(createSportDto);
  }
@Public()
  @Get()
  findAll(@Query() filter: Filter) {
    return this.sportsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', new ValidateObjectIdPipe()) id: string) {
    return this.sportsService.findOne(new Types.ObjectId(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSportDto: UpdateSportDto) {
    return this.sportsService.update(+id, updateSportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sportsService.remove(+id);
  }
}
