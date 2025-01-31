import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SportModesService } from './sport_modes.service';
import { CreateSportModeDto, UpdateSportModeDto } from './sport_mode.dto';
import { Types } from 'mongoose';
import { ValidateObjectIdPipe } from 'pipes/validate-object-id.pipe';

@Controller('sport-modes')
export class SportModesController {
  constructor(private readonly sportModesService: SportModesService) { }

  @Post()
  create(@Body() createSportModeDto: CreateSportModeDto) {
    return this.sportModesService.create(createSportModeDto);
  }

  @Get()
  findAll() {
    return this.sportModesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ValidateObjectIdPipe()) id: string) {
    return this.sportModesService.findById(new Types.ObjectId(id));
  }

  @Get('sport/:sportId')
  findBySport(@Param('sportId', new ValidateObjectIdPipe("deporte")) sportId: string) {
    return this.sportModesService.findForSports([new Types.ObjectId(sportId)])
  }

  @Patch(':id')
  update(@Param('id', new ValidateObjectIdPipe()) id: string, @Body() updateSportModeDto: UpdateSportModeDto) {
    return this.sportModesService.update(+id, updateSportModeDto);
  }

  @Delete(':id')
  remove(@Param('id', new ValidateObjectIdPipe()) id: string) {
    return this.sportModesService.remove(+id);
  }
}
