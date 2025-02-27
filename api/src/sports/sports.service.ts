import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSportDto, UpdateSportDto } from './sport.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sport } from './sport.entity';
import { Model, Types } from 'mongoose';
import { FindManyFilter } from 'filter/filter.dto';
import { Filter, FilterResponse } from 'types/types';

@Injectable()
export class SportsService {
  constructor(@InjectModel(Sport.name) private readonly sportModel: Model<Sport>) { }
  async create(createSportDto: CreateSportDto) {
    const createdSport = new this.sportModel(createSportDto)
    return createdSport.save()
  }

  async findAll(filter: Filter): Promise<FilterResponse<Sport>> {
    const results = await this.sportModel.find(filter).exec();
    return {
      results,
      totalCount: await this.sportModel.countDocuments(filter).exec()
    }
  }

  async findOne(id: Types.ObjectId) {
    const sport = await this.sportModel.findById(id)
    if (!sport) {
      throw new NotFoundException(`Sport with ID ${id} not found`);
    }
    return sport
  }


  update(id: number, updateSportDto: UpdateSportDto) {
    return `This action updates a #${id} sport`;
  }

  remove(id: number) {
    return `This action removes a #${id} sport`;
  }
}
