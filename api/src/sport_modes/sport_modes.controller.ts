import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SportModesService } from './sport_modes.service';
import { CreateSportModeDto } from './dto/create-sport_mode.dto';
import { UpdateSportModeDto } from './dto/update-sport_mode.dto';

@Controller('sport-modes')
export class SportModesController {
  constructor(private readonly sportModesService: SportModesService) {}

  @Post()
  create(@Body() createSportModeDto: CreateSportModeDto) {
    return this.sportModesService.create(createSportModeDto);
  }

  @Get()
  findAll() {
    return this.sportModesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sportModesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSportModeDto: UpdateSportModeDto) {
    return this.sportModesService.update(+id, updateSportModeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sportModesService.remove(+id);
  }
}
