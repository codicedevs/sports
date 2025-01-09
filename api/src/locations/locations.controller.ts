import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from "@nestjs/common";
import { LocationsService } from "./locations.service";
import { CreateLocationDto } from "./location.dto";
import { UpdateLocationDto } from "./location.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Types } from "mongoose";

@ApiBearerAuth()
@ApiTags('locations')
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.locationsService.findOne(new Types.ObjectId(id));
  }

  @Get("nearby")
  async findNearby(
    @Query("longitude") longitude: number,
    @Query("latitude") latitude: number,
    @Query("maxDistance") maxDistance: number,
  ) {
    return this.locationsService.findNearbyLocations(
      longitude,
      latitude,
      maxDistance,
    );
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.locationsService.remove(id);
  }
}
