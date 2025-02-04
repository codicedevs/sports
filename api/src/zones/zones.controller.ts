import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto, UpdateZoneDto } from './zone.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryValidationPipe } from 'pipes/query-validation.pipe';
import { FindManyFilter } from 'filter/filter.dto';
import { User } from 'user/user.entity';

@ApiBearerAuth()
@ApiTags('zones')
@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) { }

  @Post()
  create(@Body() createZoneDto: CreateZoneDto) {
    return this.zonesService.create(createZoneDto);
  }

  @Get()
  findAll(@Query(QueryValidationPipe)
  options: FindManyFilter<User>,) {
    return this.zonesService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zonesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZoneDto: UpdateZoneDto) {
    return this.zonesService.update(+id, updateZoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zonesService.remove(+id);
  }
}
