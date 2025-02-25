import { Injectable } from '@nestjs/common';
import { CreateZoneDto, UpdateZoneDto } from './zone.dto';
import { Zone } from './zone.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindManyFilter } from 'filter/filter.dto';
import { Filter, FilterResponse } from 'types/types';

@Injectable()
export class ZonesService {
  constructor(
    @InjectModel(Zone.name) private readonly zoneModel: Model<Zone>,
  ) { }
  async create(createZoneDto: CreateZoneDto): Promise<Zone> {
    const createdZone = new this.zoneModel(createZoneDto);
    return createdZone.save();
  }

  async findAll(filter: Filter): Promise<FilterResponse<Zone>> {
    const results = await this.zoneModel.find(filter).exec();
    return {
      results,
      totalCount: await this.zoneModel.countDocuments(filter).exec()
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} zone`;
  }

  update(id: number, updateZoneDto: UpdateZoneDto) {
    return `This action updates a #${id} zone`;
  }

  remove(id: number) {
    return `This action removes a #${id} zone`;
  }
}
