import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateZoneDto, UpdateZoneDto } from "./zone.dto";
import { Zone } from "./zone.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { FindManyFilter } from "filter/filter.dto";
import { Filter, FilterResponse } from "types/types";

@Injectable()
export class ZonesService {
  constructor(
    @InjectModel(Zone.name) private readonly zoneModel: Model<Zone>,
  ) {}
  async create(createZoneDto: CreateZoneDto): Promise<Zone> {
    const createdZone = new this.zoneModel(createZoneDto);
    return createdZone.save();
  }

  async findAll(filter: Filter): Promise<FilterResponse<Zone>> {
    const results = await this.zoneModel.find(filter).exec();
    return {
      results,
      totalCount: await this.zoneModel.countDocuments(filter).exec(),
    };
  }

  async findOne(id: Types.ObjectId): Promise<Zone> {
    const zone = await this.zoneModel.findById(id).exec();

    if (!zone) {
      throw new NotFoundException(`Zone #${id} not found`);
    }
    return zone;
  }

  async update(id: string, updateZoneDto: UpdateZoneDto): Promise<Zone> {
    //Esto sirve solo para cambiar el  nombre
    const updatedZone = await this.zoneModel
      .findByIdAndUpdate(
        { _id: id },
        {
          name: updateZoneDto.name,
        },
        { new: true },
      )
      .exec();

    if (!updatedZone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }

    return updatedZone;
  }

  remove(id: number) {
    return `This action removes a #${id} zone`;
  }
}
