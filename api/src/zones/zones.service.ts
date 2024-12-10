import { Injectable } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Zone } from './entities/zone.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindManyFilter } from 'filter/filter.dto';

@Injectable()
export class ZonesService {
  constructor(
    @InjectModel(Zone.name) private readonly zoneModel: Model<Zone>,
  ) {}
  async create(createZoneDto: CreateZoneDto): Promise<Zone> {
    const createdZone = new this.zoneModel(createZoneDto);
    return createdZone.save();
  }

  async findAll(options?: FindManyFilter<Zone>): Promise<Zone[]> {
    const users = await this.zoneModel.find(options).exec();
    return users; // Returns all users found
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
