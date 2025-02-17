import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateLocationDto } from "./location.dto";
import { UpdateLocationDto } from "./location.dto";
import { Location } from "./location.entity";
import { Model, Types } from "mongoose";
import { Filter, FilterResponse } from "types/types";

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) { }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const { name, address, coordinates } = createLocationDto;

    const location = new this.locationModel({
      name,
      address,
      location: {
        type: "Point", // GeoJSON type
        coordinates, // Coordinates in [longitude, latitude]
      },
    });
    return location.save();
  }

  // Ejemplo de consulta geoespacial: encontrar ubicaciones cercanas
  async findNearbyLocations(
    longitude: number,
    latitude: number,
    maxDistance: number,
  ): Promise<Location[]> {
    return this.locationModel
      .find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [longitude, latitude] },
            $maxDistance: maxDistance, // En metros
          },
        },
      })
      .exec();
  }

  async findAll(filter: Filter): Promise<FilterResponse<Location>> {
    const results = await this.locationModel.find(filter).exec();
    return {
      results,
      totalCount: await this.locationModel.countDocuments(filter.where)
    }
  }

  async findOne(id: Types.ObjectId): Promise<Location> {
    const location = await this.locationModel.findById(id).exec();
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const updatedLocation = await this.locationModel
      .findByIdAndUpdate(
        id,
        {
          name: updateLocationDto.name,
          location: {
            type: "Point",
            coordinates: updateLocationDto.coordinates,
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedLocation) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return updatedLocation;
  }

  async remove(id: string): Promise<void> {
    const result = await this.locationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }
}
